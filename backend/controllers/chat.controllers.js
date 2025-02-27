import { Pinecone } from '@pinecone-database/pinecone';
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { PineconeStore } from "@langchain/community/vectorstores/pinecone";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables"; 
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";

let vectorStore; 


const cleanVietnameseText = (text) => {
    return text
      .replace(/Dĩ nhiên rằng|Hình dung rằng là|à|ừm/g, '') 
      .replace(/\s+/g, ' ') 
      .trim();
  };
  
  // Chunking theo tokens (phù hợp tiếng Việt)
  const createTextSplitter = () => 
    new RecursiveCharacterTextSplitter({
      chunkSize: 500, 
      chunkOverlap: 50, 
      separators: ['\n\n', '\n', '. ', '! ', '? '], 
    });

export const initializeChatbotComponents = async () => {

    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    }, process.env.PINECONE_ENVIRONMENT);


    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);


    const embeddings = new HuggingFaceTransformersEmbeddings({
        modelName: "intfloat/multilingual-e5-small"
    });


    vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex,
    });


    const apiKeyGemini = process.env.GEMINI_API_KEY;
    const model = new ChatGoogleGenerativeAI({
        apiKey: apiKeyGemini,
        modelName: "gemini-1.5-pro",
    });

    return { vectorStore, embeddings, model, pineconeIndex };
};

export const indexLessonDataWithLangchain = async (lesson, embeddings, pineconeIndex) => {
    if (!lesson?._id || !lesson.summary || !lesson.transcript) return;
  

    const cleanedSummary = cleanVietnameseText(lesson.summary);
    const cleanedTranscript = cleanVietnameseText(lesson.transcript);
  

    const textSplitter = createTextSplitter();
    

    const transcriptChunks = await textSplitter.splitText(cleanedTranscript);
    

    const summaryChunks = await textSplitter.splitText(cleanedSummary);
  

    const allChunks = [...transcriptChunks, ...summaryChunks];
    const docs = allChunks.map((chunk, index) => 
      new Document({
        pageContent: chunk,
        metadata: { 
          lessonId: lesson._id,
          sourceType: index < transcriptChunks.length ? 'transcript' : 'summary', 
        },
      })
    );
  

    try {
      await PineconeStore.fromDocuments(docs, embeddings, { 
        pineconeIndex,
        namespace: 'lessons', 
      });
      console.log(`✅ Đã index ${docs.length} chunks của bài ${lesson._id} (Model: ${embeddings.modelName})`);
    } catch (error) {
      console.error("❌ Lỗi index:", error);
      throw new Error("Index failed: " + error.message);
    }
  };

  export const handleUserMessage = async (userQuestion, currentLessonData,currentLessonId, vectorStore, model) => {
    if (!userQuestion?.trim()) throw new Error("Câu hỏi không được để trống.");
  
    try {
  
      // Bước 1: Tìm kiếm trong Pinecone (nếu cần)
      const pineconeResults = await vectorStore.similaritySearch(userQuestion, 3);
      const pineconeContext = pineconeResults.map(doc => doc.pageContent).join("\n");
  
      // Bước 2: Kết hợp context từ bài học + Pinecone
      const combinedContext = `
        THÔNG TIN BÀI HỌC ${currentLessonId} HIỆN TẠI:
        ${currentLessonData}
  
        THÔNG TIN LIÊN QUAN TỪ HỆ THỐNG:
        ${pineconeContext}
      `;

  
      // Bước 3: Tạo prompt và gọi model
      const promptTemplate = PromptTemplate.fromTemplate(`
        Bạn đang xem bài học về **"React"**. Hãy trả lời câu hỏi sau dựa vào nội dung dưới đây:
        ------
        {context}  // Sử dụng {context} - 'combinedContext' sẽ được truyền vào đây
        ------
        Câu hỏi: {question} // Sử dụng {question} - 'userQuestion' sẽ được truyền vào đây

        Yêu cầu:
        - Ưu tiên thông tin từ "THÔNG TIN BÀI HỌC HIỆN TẠI".
        - Nếu không đủ thông tin, dùng dữ liệu từ hệ thống.
        - Luôn trả lời bằng tiếng Việt, có icon cảm xúc.
        - Không đề cập đến nội dung ngoài React hay liên quan tới lập trình nếu người dùng hỏi về một nội dung nào đó gần gần liên quan tới react cứ việc trả lời nhằm cho người dùng hiểu rõ hơn , luôn kèm icon phù hợp 🚀.
        - Nếu người dủng hỏi câu hỏi liên quan tới việc tạo câu hỏi hoặc Bài Tập Ôn Tập . Thì bạn sẽ tạo ra câu hỏi và các câu trả lời dạng trắc nghiệm ABCD và mỗi lần ghi ra mỗi câu hỏi , mỗi câu trả lời ABCD hãy xuống dòng mỗi lần  . Vui lòng chỉ tạo ra câu hỏi và không cho đáp án . Khi nào người dùng cần đáp án và hỏi mới cần trả lời đáp án cụ thể . Lưu ý  tối đa là 3 câu hỏi mỗi lần và có đánh số cho mỗi câu hỏi .
    `);
  
      const chain = RunnableSequence.from([
        { context: () => combinedContext, question: (input) => input.question },
        promptTemplate,
        model,
        new StringOutputParser(),
      ]);
  
      return await chain.invoke({ question: userQuestion });
    } catch (error) {
      console.error("[RAG Error]:", error);
      throw new Error(`Xử lý thất bại: ${error.message}`);
    }
  };


  
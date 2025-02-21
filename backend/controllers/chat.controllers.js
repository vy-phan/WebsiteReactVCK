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
        ${currentLessonData}
        ------
        Câu hỏi: ${userQuestion}

        Nếu thông tin trên không đủ, tham khảo thêm:
        ------
        ${pineconeContext}
        ------
        Yêu cầu:
        - Ưu tiên thông tin từ "THÔNG TIN BÀI HỌC HIỆN TẠI".
        - Nếu không đủ thông tin, dùng dữ liệu từ hệ thống.
        - Luôn trả lời bằng tiếng Việt, có icon cảm xúc.
        - Không đề cập đến nội dung ngoài React hay liên quan tới lập trình nếu người dùng hỏi về một nội dung nào đó gần gần liên quan tới react cứ việc trả lời nhằm cho người dùng hiểu rõ hơn , luôn kèm icon phù hợp 🚀
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


  // export const handleUserMessage = async (userQuestion, vectorStore, embeddings, model) => { 
  //   if (!userQuestion?.trim()) {
  //     throw new Error("Câu hỏi không được để trống.");
  //   }
  
  //   try {
  //     if (!vectorStore) {
  //       throw new Error("Vector store chưa được khởi tạo.");
  //     }
  
  //     // Bước 1: Tìm kiếm có lọc metadata (vd: lessonId nếu cần)
  //     const results = await vectorStore.similaritySearch(userQuestion, 5, {
  //       // Thêm filter nếu cần (vd: chỉ tìm trong transcript)
  //       // filter: { sourceType: "transcript" } 
  //     });
  
  //     // Bước 2: Giới hạn độ dài context để tránh vượt token limit
  //     const MAX_CONTEXT_TOKENS = 3000; // Tùy model (vd: GPT-3.5 ~ 4096 tokens)
  //     let contextText = "";
  //     for (const doc of results) {
  //       const docContent = `[Nguồn: ${doc.metadata.sourceType}]\n${doc.pageContent}\n---\n`;
  //       if ((contextText + docContent).length > MAX_CONTEXT_TOKENS) break;
  //       contextText += docContent;
  //     }
  
  //     // Bước 3: Tối ưu prompt để giảm hallucination
  //     const promptTemplate = PromptTemplate.fromTemplate(`
  //       Bạn là một chuyên gia React.js. HÃY TRẢ LỜI DỰA TRÊN CONTEXT SAU, KHÔNG TỰ BỊA ĐÁP ÁN:
  //       ------
  //       {context}
  //       ------
  //       Câu hỏi: {question}
  
  //       Yêu cầu:
  //       - Trả lời ngắn gọn và thể hiện sự lịch sự thân thiện bằng cách có icon vui vẻvẻ, tập trung vào technical details.
  //       - Nếu không đủ thông tin trong context, nói "Tôi chưa học về điều này".
  //       - KHÔNG đề cập đến bất kỳ nội dung khác nào khác ngoài React hay liên quan tới việc lập trình.
  //       - Dùng tiếng Việt và format markdown nếu cần.
        
  //     `);
  
  //     // Bước 4: Tạo chain với streaming (nếu cần)
  //     const chain = RunnableSequence.from([
  //       { context: () => contextText, question: (input) => input.question },
  //       promptTemplate,
  //       model,
  //       new StringOutputParser(),
  //     ]);
  
  //     const llmResponse = await chain.invoke({ question: userQuestion });
  //     return llmResponse;
  
  //   } catch (error) {
  //     console.error("[RAG Error]:", error);
  //     throw new Error(`Xử lý thất bại: ${error.message}`); 
  //   }
  // };  

// export const handleUserMessage = async (userQuestion, vectorStore, embeddings, model) => { 
//     if (!userQuestion) {
//         throw new Error("Câu hỏi không được để trống.");
//     }

//     try {
//         if (!vectorStore) {
//             throw new Error("Vector store chưa được khởi tạo.");
//         }

//         const queryEmbedding = await embeddings.embedQuery(userQuestion); // Không cần thay đổi tham số embeddings
//         const results = await vectorStore.similaritySearch(userQuestion, 3);
//         const contextText = results.map(r => r.pageContent).join("\n");

//         const promptTemplate = PromptTemplate.fromTemplate(`
//             Bạn là một chatbot chuyên gia về React.js. Dựa vào thông tin bài học liên quan sau đây:
//             {context}

//             Để trả lời câu hỏi của người dùng: "{question}".
//             Chỉ trả lời các câu hỏi liên quan đến lập trình và React.js. Nếu câu hỏi không liên quan, từ chối trả lời người dùng và yêu cầu họ chỉ trả lời liên quan tới lập trình và react.
//         `);

//         const chain = RunnableSequence.from([
//             {
//                 context: () => contextText,
//                 question: (input) => input.question,
//             },
//             promptTemplate,
//             model,
//             new StringOutputParser(),
//         ]);

//         const llmResponse = await chain.invoke({
//             question: userQuestion,
//         });

//         return llmResponse;
//     } catch (error) {
//         console.error("Lỗi xử lý tin nhắn trong controller: ", error);
//         throw error; // Ném lỗi để router có thể xử lý và trả về response lỗi
//     }
// };
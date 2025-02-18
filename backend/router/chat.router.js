import express from 'express';
import { initializeChatbotComponents, handleUserMessage, indexLessonDataWithLangchain } from '../controllers/chat.controllers.js';

const router = express.Router();

let chatbotComponentsInitialized = false; 
let vectorStore, embeddings, model, pineconeIndex; 


const ensureChatbotInitialized = async (req, res, next) => {
    if (!chatbotComponentsInitialized) {
        try {
            const components = await initializeChatbotComponents();
            vectorStore = components.vectorStore;
            embeddings = components.embeddings;
            model = components.model;
            pineconeIndex = components.pineconeIndex; 
            chatbotComponentsInitialized = true;
            console.log("Chatbot components initialized successfully.");
            next(); 
        } catch (error) {
            console.error("Lỗi khởi tạo chatbot components: ", error);
            return res.status(500).json({ error: "Lỗi khởi tạo chatbot." });
        }
    } else {
        next(); 
    }
};


router.post('/index-lesson', ensureChatbotInitialized, async (req, res) => {
    const lesson = req.body.lesson;
    if (!lesson) {
        return res.status(400).json({ error: "Dữ liệu bài học không được cung cấp." });
    }
    try {
        await indexLessonDataWithLangchain(lesson, embeddings, pineconeIndex); 
        res.json({ message: "Đã index bài học thành công vào Pinecone." });
    } catch (error) {
        console.error("Lỗi khi index bài học qua API: ", error);
        res.status(500).json({ error: "Lỗi khi index bài học." });
    }
});


router.post('/message', ensureChatbotInitialized, async (req, res) => {
    const userQuestion = req.body.message;
    const currentLessonData = req.body.currentLessonData; 
    const currentLessonId = req.body.currentLessonId;   

    if (!userQuestion) {
        return res.status(400).json({ error: "Câu hỏi không được để trống." });
    }

    try {
        const llmResponse = await handleUserMessage(userQuestion, currentLessonData,currentLessonId, vectorStore, model); // Gọi hàm controller
        res.json({ response: llmResponse });
    } catch (error) {
        console.error("Lỗi xử lý API /api/chat/message: ", error);
        res.status(500).json({ error: "Đã có lỗi xảy ra khi xử lý câu hỏi." });
    }
});


export default router;
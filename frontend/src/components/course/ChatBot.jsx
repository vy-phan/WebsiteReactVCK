import React, { useEffect, useState, useRef, useContext } from "react";
import { FaPaperPlane, FaTrash } from "react-icons/fa";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { Oval, ThreeDots } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/AuthContext";

const ChatBot = () => {
  const [user, setUser] = useState(null);
  const [userInput, setUserInput] = useState("");
  const { authUser } = useContext(AuthContext);
  const [chatHistory, setChatHistory] = useState(() => {
    const storedHistory = localStorage.getItem(`chat-history-${authUser?._id}`);
    return storedHistory ? JSON.parse(storedHistory) : [];
  });
  const [loading, setLoading] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [showIntroMessage, setShowIntroMessage] = useState(() => {
    return chatHistory.length === 0;
  });
  const chatAreaRef = useRef(null);
  const [keywords, setKeywords] = useState([
    "Tóm tắt nội dung bài học",
    "Tạo Bài Tập Ôn Tập",
  ]);


  const apiKey = import.meta.env.VITE_GEMNI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction:
      "Bạn là một chatbot chuyên gia về React .Bạn có tên là trợ giảng CoNan.Bạn phải trả lời người dùng một cách lịch sự và có icon để hiển hiện sự lịch sự .Và khi người dùng xin chào hay tạm biệt bạn hãy trả lời cách thân thiện . Và khi trả lời bạn chỉ trả lời các câu hỏi liên quan đến lập trình và React. Nếu câu hỏi không liên quan đang học hãy từ chối trả lời người dùng và yêu cầu họ chỉ trả lời liên quan tới lập trình và react .",
  });

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);

  useEffect(() => {
    const lessonData = localStorage.getItem("currentLesson");
    if (lessonData) {
      const lesson = JSON.parse(lessonData);
      setCurrentLesson(lesson);
      // console.log("Đã tải currentLesson từ localStorage:", lesson);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(`chat-history-${authUser?._id}`, JSON.stringify(chatHistory));
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [chatHistory, authUser?._id]);

  useEffect(() => {
    setShowIntroMessage(chatHistory.length === 0);
  }, [chatHistory]);

  const templateData = (currentLesson) => {
    return `Đây là nội dung bài học: "${currentLesson.description}". Và id tương ứng là "${currentLesson.id}".`;
  };

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    if (showIntroMessage) {
      setShowIntroMessage(false);
    }

    const loadingMessage = {
      role: "assistant",
      text: (
        <ThreeDots
          height={30}
          width={60}
          color="#718096"
          secondaryColor="#A0AEC0"
          wrapperClass="inline-block"
        />
      ),
    };
    setChatHistory((currentHistory) => [
      ...currentHistory,
      { role: "user", text: userInput },
      loadingMessage,
    ]);

    try {
      setLoading(true);

      const requestBody = {
        message: userInput,
        currentLessonData: currentLesson ? currentLesson.description : "", // Sử dụng currentLesson.description làm currentLessonData, hoặc bạn có thể chọn trường khác từ currentLesson nếu phù hợp hơn
        currentLessonId: currentLesson ? currentLesson.id : "", // Sử dụng currentLesson.id làm currentLessonId
      };

      const response = await fetch('/api/chat/message', { // **Đổi endpoint API của bạn nếu khác "/api/chat/message"**
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Lấy thông tin lỗi từ backend nếu có
        throw new Error(`Lỗi server đang bận `);
      }

      const responseData = await response.json();
      const llmResponse = responseData.response; // Backend trả về response trong trường "response"

      // Cập nhật tin nhắn loading bằng phản hồi thực tế từ backend
      setChatHistory((currentHistory) => {
        const updatedHistory = [...currentHistory];
        updatedHistory[updatedHistory.length - 1] = {
          role: "assistant",
          text: llmResponse, // Sử dụng phản hồi từ backend
        };
        return updatedHistory;
      });

      // **Kết thúc phần code thay đổi trong sendMessage**

    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn: ", error);
      setChatHistory((currentHistory) => {
        const updatedHistory = [...currentHistory];
        updatedHistory[updatedHistory.length - 1] = {
          role: "assistant",
          text: "Xin lỗi, đã có lỗi xảy ra khi phản hồi. Vui lòng thử lại sau. " + error.message, // Hiển thị thêm thông tin lỗi nếu có
        };
        return updatedHistory;
      });
    } finally {
      setLoading(false);
      setUserInput("");
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  const clearChatHistory = () => {
    localStorage.removeItem(`chat-history-${authUser?._id}`);
    setChatHistory([]);
    setShowIntroMessage(true);
  };

  const handleKeywordClick = (keyword) => {
    setUserInput(keyword);
  };

  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div
        ref={chatAreaRef}
        className="flex-1 overflow-y-auto p-4 mb-2"
        style={{ maxHeight: "calc(100vh - 280px)" }}
      >
        {showIntroMessage && chatHistory.length === 0 && (
          <div className={`mb-2 flex justify-start`}>
            <div className="mr-2 avatar">
              <div className="w-10 rounded-full overflow-hidden">
                <img
                  alt="Avatar Bot"
                  src="/chatbot.jpg"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className={`flex flex-col items-start`}>
              <div className={`text-sm text-gray-900 dark:text-white mb-1`}>
                {t("chatName")}
              </div>
              <div
                className={`rounded-xl p-3 bg-gray-100 text-gray-800 max-w-xs`}
              >
                Chào bạn! Tôi là trợ giảng React.js. Rất vui được hỗ trợ bạn
                trong quá trình học tập. Hãy đặt câu hỏi về React.js hoặc nội
                dung bài học nhé!
              </div>
            </div>
          </div>
        )}
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`mb-2 flex ${message.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            {message.role === "assistant" && (
              <div className="mr-2 avatar">
                <div className="w-10 rounded-full overflow-hidden">
                  <img
                    alt="Avatar Bot"
                    src="/chatbot.jpg"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            )}
            <div
              className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"
                }`}
            >
              <div
                className={`text-sm ${message.role === "user"
                  ? "text-blue-600"
                  : "text-gray-900 dark:text-white"
                  } mb-1`}
              >
                {message.role === "user" ? "Bạn" : "Trợ giảng"}
              </div>
              <div
                className={`rounded-xl p-3 ${message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
                  } max-w-xs`}
              >
                {message.role === "assistant" &&
                  typeof message.text !== "string" ? ( // Kiểm tra nếu message.text không phải string thì render trực tiếp (là component Oval)
                  message.text
                ) : (
                  <ReactMarkdown className="prose max-w-none">
                    {message.text}
                  </ReactMarkdown>
                )}
              </div>
            </div>
            {message.role === "user" && (
              <div className="ml-2 avatar">
                <div className="">
                  <img
                    alt="Avatar User"
                    className="rounded-full w-10 h-10"
                    src={
                      user?.avatarUrl || "https://avatar.iran.liara.run/public"
                    }
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="dark:bg-gray-900 border-t border-gray-200 dark:border-gray-950 pt-2 pb-4 mt-auto">
        <div className="max-w-screen-xl mx-auto flex flex-col gap-2 px-4">
          {showIntroMessage && ( // Conditional rendering for keywords
            <div className="flex flex-nowrap overflow-x-auto gap-3 mb-3 py-2 px-1 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent">
              {keywords.map((keyword, index) => (
                <button
                  key={index}
                  className="
                    px-6 py-3
                    rounded-full 
                    text-sm font-medium
                    transition-all duration-300 
                    shadow-lg
                    whitespace-nowrap
                    border-2
                    transform hover:scale-105
                    hover:shadow-xl
                    dark:hover:shadow-blue-900/30
                    bg-white
                    text-blue-700
                    dark:text-blue-200
                    dark:bg-gray-700
                    border-blue-300/50
                    dark:border-blue-700/50
                    hover:from-blue-200 hover:via-blue-100 hover:to-indigo-200
                    dark:hover:from-gray-700 dark:hover:via-blue-800/40 dark:hover:to-gray-700
                    backdrop-blur-sm
                    hover:border-blue-400
                    dark:hover:border-blue-600
                    hover:text-blue-800
                    dark:hover:text-blue-100
                  "
                  onClick={() => handleKeywordClick(keyword)}
                >
                  {keyword}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <input
                type="text"
                className="w-full p-3 border dark:bg-gray-900 bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-300 outline-none"
                placeholder={t("chatInput")}
                value={userInput}
                onChange={handleUserInput}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
            </div>
            <button
              className={`p-3 rounded-lg ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
                } text-white font-medium transition-colors duration-200`}
              onClick={sendMessage}
              disabled={loading}
              aria-label="Send message"
            >
              {loading ? (
                <Oval
                  height={20}
                  width={20}
                  color="#ffffff"
                  secondaryColor="#ffffff"
                  strokeWidth={4}
                  strokeWidthSecondary={4}
                />
              ) : (
                <FaPaperPlane className="w-5 h-5" />
              )}
            </button>
            <button
              className="p-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors duration-200 ml-2"
              onClick={() => {
                if (
                  window.confirm(
                    "Bạn có chắc chắn muốn xóa toàn bộ lịch sử chat?"
                  )
                ) {
                  clearChatHistory();
                }
              }}
              aria-label="Clear chat history"
            >
              <FaTrash className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
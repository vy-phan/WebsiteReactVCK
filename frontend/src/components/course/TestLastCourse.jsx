import React, { useMemo, useState } from 'react'
import useGetExercises from '../../hooks/useGetExercise'
import useGetAllCourses from '../../hooks/useGetAllCourse'
import { useAuthContext } from '../../context/AuthContext'
import ReactMarkdown from 'react-markdown'
import useGetProgress from '../../hooks/useGetProgress'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import useCU_Progress from '../../hooks/useCU_Progress'
import useTest from '../../hooks/useTest';
import toast from 'react-hot-toast';

const TestLastCourse = ({ filteredLessons }) => {
    const { t } = useTranslation()
    const { id } = useParams()
    const { courses } = useGetAllCourses()
    const { exercises } = useGetExercises()
    const { authUser } = useAuthContext()
    const [showModal, setShowModal] = useState(false)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState('')
    const [showResult, setShowResult] = useState(false)
    const [score, setScore] = useState(0)
    const [quizStarted, setQuizStarted] = useState(false)
    const [userAnswers, setUserAnswers] = useState([])
    const { progress } = useGetProgress()
    const { createTest, getTestByUserAndCourse, updateTest } = useTest()

    const filterProgress = progress.filter((p) => p.userId === authUser?._id)
    const filterProgressCourse = filterProgress.filter((p) => p.courseId === id)


    // Filter and randomize 10 exercises
    const randomExercises = useMemo(() => {
        if (!exercises || !filteredLessons) return [];
        const filtered = exercises.filter(exercise =>
            filteredLessons.some(lesson => lesson._id === exercise.lessonId)
        );
        // Randomly select 10 exercises
        return filtered
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.min(10, filtered.length));
    }, [exercises, filteredLessons]);

    const handleStartQuiz = () => {
        setQuizStarted(true)
        setShowModal(true)
        setCurrentQuestionIndex(0)
        setScore(0)
        setShowResult(false)
        setUserAnswers([])
    }

    // Add this function after getResultMessage
    const handleUpdateProgress = async () => {
        if (score >= 5) { // Pass condition: score 5 or higher
            try {
                const testData = {
                    userId: authUser._id,
                    courseId: id,
                    score: score,
                    isPass: true
                };
                await createTest(testData);
                toast.success("Test completed successfully!");
            } catch (error) {
                console.error("Error updating test progress:", error);
                toast.error("Failed to save test results");
            }
        }
    };

    // Modify the handleAnswerSelect function to call handleUpdateProgress when showing results
    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer)
        const currentExercise = randomExercises[currentQuestionIndex]

        // Store user's answer
        const userAnswer = {
            question: currentExercise.question,
            userAnswer: answer,
            correctAnswer: currentExercise.correctAnswer,
            isCorrect: answer === currentExercise.correctAnswer
        }

        setUserAnswers(prev => [...prev, userAnswer])

        if (answer === currentExercise.correctAnswer) {
            setScore(prev => prev + 1)
        }

        if (currentQuestionIndex < randomExercises.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
            setSelectedAnswer('')
        } else {
            setShowResult(true)
            // Update progress when test is completed
            handleUpdateProgress()
        }
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setQuizStarted(false)
        setCurrentQuestionIndex(0)
        setSelectedAnswer('')
        setShowResult(false)
        setUserAnswers([])
    }

    const getResultMessage = () => {
        const totalQuestions = randomExercises.length;

        if (score >= 6) {
            return {
                text: t('quiz.congratulations'),
                color: "text-green-600 dark:text-green-400",
                bgColor: "bg-green-50 dark:bg-green-900/20",
                borderColor: "border-green-200 dark:border-green-800",
                icon: "🎉"
            };
        } else if (score === 5) {
            return {
                text: t('quiz.justPassed'),
                color: "text-yellow-600 dark:text-yellow-400",
                bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
                borderColor: "border-yellow-200 dark:border-yellow-800",
                icon: "😅"
            };
        } else {
            return {
                text: t('quiz.failed'),
                color: "text-red-600 dark:text-red-400",
                bgColor: "bg-red-50 dark:bg-red-900/20",
                borderColor: "border-red-200 dark:border-red-800",
                icon: "😢"
            };
        }
    }

    const canTestExam = filterProgressCourse[0]?.progressPercentage === 100;

    const resultMessage = getResultMessage();

    return (
        <div className="space-y-4">
            {!quizStarted && (
                <>
                    {canTestExam ? (
                        <button
                            onClick={handleStartQuiz}
                            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            {t('quiz.startQuiz')}
                        </button>
                    ) : (
                        <div className="text-center p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-yellow-600 dark:text-yellow-400">
                                {t('quiz.pleaseComplete')}
                            </p>
                            <p className="text-yellow-500 dark:text-yellow-300 mt-2">
                                {t('quiz.currentProgress', { progress: filterProgressCourse[0]?.progressPercentage || 0 })}
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* Quiz Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl flex flex-col">
                        {/* Modal Header */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            {!showResult ? (
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                    Câu hỏi {currentQuestionIndex + 1}/{randomExercises.length}
                                </h3>
                            ) : (
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                    Kết quả
                                </h3>
                            )}
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-500 bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:bg-gray-900 dark:hover:text-gray-200 p-2 rounded-full"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: "70vh" }}>
                            {!showResult ? (
                                <div className="mb-6">
                                    <div className="text-lg text-gray-800 dark:text-white mb-4">
                                        <ReactMarkdown>
                                            {randomExercises[currentQuestionIndex]?.question || ''}
                                        </ReactMarkdown>
                                    </div>
                                    <div className="space-y-3">
                                        {randomExercises[currentQuestionIndex]?.options.map((option, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleAnswerSelect(option)}
                                                className={`w-full text-left p-4 rounded-lg transition-all duration-300 transform hover:scale-102 hover:shadow-md
                                                    ${selectedAnswer === option
                                                        ? 'bg-blue-200 dark:bg-blue-800 border-2 border-blue-500 shadow-lg scale-105'
                                                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-transparent'}
                                                `}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {/* Result message box */}
                                    <div className={`p-4 rounded-lg border mb-6 ${resultMessage.borderColor} ${resultMessage.bgColor}`}>
                                        <div className="flex items-center">
                                            <span className="text-3xl mr-3">{resultMessage.icon}</span>
                                            <h3 className={`text-xl font-bold ${resultMessage.color}`}>
                                                {resultMessage.text}
                                            </h3>
                                        </div>

                                        {score < 5 && (
                                            <div className="mt-4 flex justify-center">
                                                <button
                                                    onClick={handleStartQuiz}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    Làm lại bài test
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-center mb-6">
                                        <p className="text-xl mb-4 text-gray-700 dark:text-gray-300">
                                            Bạn đã trả lời đúng <span className="font-bold text-green-600 dark:text-green-400">{score}</span>/{randomExercises.length} câu hỏi
                                        </p>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
                                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(score / randomExercises.length) * 100}%` }}></div>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Tỷ lệ chính xác: {((score / randomExercises.length) * 100).toFixed(1)}%
                                        </p>
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                                            Chi tiết đáp án:
                                        </h4>

                                        <div className="space-y-6">
                                            {userAnswers.map((answer, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-4 rounded-lg border ${answer.isCorrect
                                                        ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800'
                                                        : 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'}`}
                                                >
                                                    <div className="text-gray-800 dark:text-white mb-3">
                                                        <span className="font-medium">Câu {index + 1}: </span>
                                                        <ReactMarkdown>{answer.question}</ReactMarkdown>
                                                    </div>

                                                    <div className="flex flex-col space-y-2">
                                                        <div className={`flex items-start ${answer.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                            <span className="font-medium mr-2">Câu trả lời của bạn:</span>
                                                            <span>{answer.userAnswer}</span>
                                                            <span className="ml-2">
                                                                {answer.isCorrect ? '✓' : '✗'}
                                                            </span>
                                                        </div>

                                                        {!answer.isCorrect && (
                                                            <div className="flex items-start text-green-600 dark:text-green-400">
                                                                <span className="font-medium mr-2">Đáp án đúng:</span>
                                                                <span>{answer.correctAnswer}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        {showResult && (
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Đóng
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {randomExercises.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                    Không có bài tập nào cho các bài học này.
                </div>
            )}
        </div>
    )
}

export default TestLastCourse
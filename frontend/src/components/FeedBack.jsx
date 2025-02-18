import React, { useTransition } from 'react';
import { Star, ThumbsUp } from "lucide-react";
import { useTranslation } from 'react-i18next';

const feedbacks = [
    {
        id: 1,
        name: "Lê Thị Hương",
        avatar: "https://th.bing.com/th/id/OIP.kExwnfk0Bjqsngf0yX03-AHaLH?rs=1&pid=ImgDetMain",
        content: "Em đang học khóa React, giảng viên dạy rất tận tình và hay giúp em tiếp thu nhiều kiến thức mới.",
        rating: 5,
        likes: 79
    },
    {
        id: 2,
        name: "Hoàng Nhân",
        avatar: "https://th.bing.com/th/id/OIP.EvqYDIEtDg1bL5YpidHkIgHaLH?rs=1&pid=ImgDetMain",
        content: "Khóa học thật bổ ích, mọi người nên học theo lộ trình nha.",
        rating: 5,
        likes: 260
    },
    {
        id: 3,
        name: "Minh Anh",
        avatar: "https://th.bing.com/th/id/R.c409f6c91fb3f0043d441d4ccd68c68a?rik=wCDfxFzXouuZbg&riu=http%3a%2f%2fres.heraldm.com%2fcontent%2fimage%2f2017%2f07%2f31%2f20170731000664_0.jpg&ehk=%2fU3L5R7eUJn1BBGoAy9nrFNqkk8pX0SxvN0m05upu90%3d&risl=&pid=ImgRaw&r=0",
        content: "Mình thích nhất phần bài tập của khóa học vì bài tập xoay quanh những kiến thức đã học, giúp em củng cố kiến thức.",
        rating: 5,
        likes: 98
    },
    {
        id: 4,
        name: "Nguyễn Văn An",
        avatar: "https://th.bing.com/th/id/OIP.F0Go_SNNB7ya0rwNzJXfUAHaLH?rs=1&pid=ImgDetMain",
        content: "Khóa học rất hữu ích, giúp tôi nâng cao kỹ năng lập trình.",
        rating: 4,
        likes: 150
    },
    {
        id: 5,
        name: "Trần Thị Bích",
        avatar: "https://0.soompi.io/wp-content/uploads/2020/11/23195241/kim-yoo-jung-4.jpg",
        content: "Giảng viên nhiệt tình, nội dung dễ hiểu và thực tế.",
        rating: 5,
        likes: 200
    },
    {
        id: 6,
        name: "Phạm Quang Huy",
        avatar: "https://th.bing.com/th/id/OIP.QExQ-BbfT2HRBAUH7A4FMAHaJq?rs=1&pid=ImgDetMain",
        content: "Tôi đã học được nhiều kiến thức mới và áp dụng vào công việc.",
        rating: 5,
        likes: 180
    },
    {
        id: 7,
        name: "Lê Thị Thu",
        avatar: "https://th.bing.com/th/id/R.26317d16f94ac7a3fa935db0c177ddb2?rik=LLBfeXWi8Flw6g&pid=ImgRaw&r=0",
        content: "Khóa học cung cấp nhiều bài tập thực hành bổ ích.",
        rating: 4,
        likes: 170
    },
    {
        id: 8,
        name: "Đặng Minh Tuấn",
        avatar: "https://i.pinimg.com/736x/b1/7b/83/b17b83af227ee8c3904be6395f83dadb.jpg",
        content: "Nội dung khóa học được cập nhật, phù hợp với xu hướng hiện nay.",
        rating: 5,
        likes: 190
    },
    {
        id: 9,
        name: "Hoàng Thị Lan",
        avatar: "https://th.bing.com/th/id/OIP.7Y0wHTn3iBvvLYYRM7urIgAAAA?rs=1&pid=ImgDetMain",
        content: "Tôi rất hài lòng với chất lượng giảng dạy và tài liệu học tập.",
        rating: 5,
        likes: 210
    }
];

const FeedbackCard = ({ feedback }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-4 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200/50">
        <div className="flex items-start mb-4">
            <img
                src={feedback.avatar}
                alt={feedback.name}
                loading="lazy"
                className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-blue-500/50"
            />
            <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2 tracking-wide">{feedback.name}</h3>
                <p className="text-gray-700 leading-relaxed">{feedback.content}</p>
            </div>
        </div>
        <div className="flex items-center justify-between mt-4">
            <div className="flex items-center animate-pulse">
                {[...Array(5)].map((_, index) => (
                    <Star
                        key={index}
                        size={20}
                        className={index < feedback.rating ? "text-yellow-400 fill-current filter drop-shadow-md" : "text-gray-300"}
                    />
                ))}
            </div>
            <div className="flex items-center group">
                <ThumbsUp size={20} className="text-blue-600 mr-2 transform group-hover:scale-125 transition-transform" />
                <span className="text-gray-600">{feedback.likes}</span>
            </div>
        </div>
    </div>
);

const FeedBack = () => {
    const { t } = useTranslation();
    const duplicatedFeedbacks = [...feedbacks, ...feedbacks, ...feedbacks, ...feedbacks];

    return (
        <div className="min-h-screen py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left section */}
                    <div className="flex flex-col justify-center dark:text-white relative"> {/* Thêm div relative bao ngoài */}
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                                {t('feedbackTitle1')}
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                                {t('feedbackTitle2')}
                            </span>
                            <br />
                            <span className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-300">
                                {t('feedbackTitle3')}
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed relative">
                            {t('feedbackContent')}
                        </p>
                        {/* Di chuyển div blur ra ngoài <p> nhưng vẫn trong div container relative */}
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
                        <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
                    </div>

                    {/* Right section */}
                    <div className="relative overflow-hidden rounded-xl" style={{ height: '600px' }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent dark:from-gray-900/80 pointer-events-none z-10"></div>
                        <div
                            className="space-y-4 absolute w-full"
                            style={{
                                animation: 'scroll 40s linear infinite'
                            }}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {duplicatedFeedbacks.map((feedback, index) => (
                                    <div key={index} className={`${index % 2 === 0 ? 'sm:transform sm:translate-y-8' : ''}`}>
                                        <FeedbackCard feedback={feedback} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                {`
                    @keyframes scroll {
                        0% {
                            transform: translateY(0);
                        }
                        100% {
                            transform: translateY(-50%);
                        }
                    }
                    
                    .space-y-4:hover {
                        animation-play-state: paused;
                    }

                    @keyframes gradient {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }

                    .animate-gradient {
                        background-size: 200% auto;
                        animation: gradient 4s linear infinite;
                    }
                `}
            </style>
        </div>
    );
};

export default FeedBack;
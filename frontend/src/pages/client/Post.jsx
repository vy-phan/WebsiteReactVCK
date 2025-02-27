import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaCalendarAlt, FaUser, FaFire } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import useCRUDPost from '../../hooks/useCRUDPost';
import { useAuthContext } from '../../context/AuthContext';
import useGetUsers from '../../hooks/useGetUsers';
import { marked } from "marked";
import Meta from '../../components/Meta.jsx';
import { useTheme } from "../../context/ThemeContext";

const Post = () => {
  const { t } = useTranslation();
  const { posts } = useCRUDPost();
  const { authUser } = useAuthContext();
  const { users } = useGetUsers();
  const { isDarkMode } = useTheme();

  // Memoize mockPosts to prevent unnecessary recalculations
  const mockPosts = useMemo(() => {
    if (posts && posts.length > 0) {
      return posts.filter((post) => post.permission === true);
    } else {
      return [];
    }
  }, [posts]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = mockPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts([]);
    }
  }, [searchTerm, mockPosts]);

  // Get latest 7 posts for main content
  const latestPosts = mockPosts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 7);
  // Get 3 featured posts for sidebar
  const featuredPosts = mockPosts.slice(0, 3);

  const postsToDisplay = searchTerm ? filteredPosts : latestPosts;

  const PostCard = ({ post, isFeatured, isCompact }) => (
    <div
      className={`relative ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
        isFeatured ? 'flex gap-4' : ''
      }  border-animated`} // Thêm class 'border-animated'
    >
      {/* Nội dung card bên trong (giữ nguyên như cũ) */}
      <div className={`relative ${isFeatured ? 'w-1/3' : isCompact ? 'h-48' : 'h-56'}`}>
        <img
          src={post.imageUrl}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-xl"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x240?text=Post+Image';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
      </div>
      <div className={`${isFeatured ? 'flex-1 p-4' : 'p-4'}`}>
        <h2 className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-3 line-clamp-2 ${
          isFeatured || isCompact ? 'text-lg' : 'text-xl'
        }`}>
          {post.title}
        </h2>
        {!isFeatured && (
          <>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 line-clamp-2 text-sm leading-relaxed`}
              dangerouslySetInnerHTML={{ __html: marked(post.content) }}></p>
            <div className={`flex items-center justify-between text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
              <div className="flex items-center space-x-2">
                <FaUser className={`${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                <span>{post.author ? users?.find((user) => user._id === post.author)?.username : 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className={`${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                <span>{new Date(post.updatedAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </>
        )}
        <Link
          to={`/post/${post._id}`}
          className={`inline-block w-full text-center px-4 py-2 ${
            isDarkMode
              ? 'bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
          } text-white rounded-lg hover:text-white transition-all duration-300 transform hover:scale-[1.02] ${
            isFeatured || isCompact ? 'text-sm' : ''
          }`}
        >
          {t('postButton')}
        </Link>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} py-12 relative overflow-hidden`}>
      {/* Background graphic elements with multiple colors */}
      <div className="absolute inset-0 z-0 p-8">
        {/* Top left rounded corner - gradient border */}
        <div className="absolute top-12 mt-10 left-12 w-1/4 h-32 border-l-2 border-t-2 rounded-tl-[80px] opacity-70 rounded-xl"
             style={{
               borderImage: isDarkMode
                 ? 'linear-gradient(135deg, #f87171, #8b5cf6, #3b82f6) 1'
                 : 'linear-gradient(135deg, #ef4444, #8b5cf6, #3b82f6) 1'
             }}></div>

        {/* Top right rounded corner - changing colors */}
        <div className="absolute top-16 mt-10 right-16 w-1/3 h-40 border-r-2 border-t-2 rounded-tr-[80px] opacity-70 rounded-xl"
             style={{
               borderImage: isDarkMode
                 ? 'linear-gradient(45deg, #10b981, #6366f1, #ec4899) 1'
                 : 'linear-gradient(45deg, #10b981, #6366f1, #f43f5e) 1'
             }}></div>

        {/* Middle left element - sunset colors */}
        <div className="absolute top-1/4 left-14 w-1/6 h-48 border-l-2 border-b-2 rounded-bl-[60px] opacity-60 rounded-xl"
             style={{
               borderImage: isDarkMode
                 ? 'linear-gradient(to bottom, #fb923c, #e11d48, #7c3aed) 1'
                 : 'linear-gradient(to bottom, #fb923c, #ef4444, #8b5cf6) 1'
             }}></div>

        {/* Middle element - rainbow effect */}
        <div className="absolute top-1/3 left-1/4 w-1/2 h-32 border-2 rounded-[50px] opacity-50 rounded-xl"
             style={{
               borderImage: isDarkMode
                 ? 'linear-gradient(to right, #f97316, #facc15, #22c55e, #0ea5e9, #a855f7) 1'
                 : 'linear-gradient(to right, #fb923c, #fde047, #4ade80, #38bdf8, #c084fc) 1'
             }}></div>

        {/* Bottom right element - cool tones */}
        <div className="absolute bottom-12 right-12 w-1/5 h-64 border-r-2 border-b-2 rounded-br-[70px] opacity-70 rounded-xl"
             style={{
               borderImage: isDarkMode
                 ? 'linear-gradient(225deg, #6366f1, #2563eb, #0ea5e9, #06b6d4) 1'
                 : 'linear-gradient(225deg, #818cf8, #3b82f6, #38bdf8, #22d3ee) 1'
             }}></div>

        {/* Bottom left element - warm tones */}
        <div className="absolute bottom-16 left-16 w-20 h-80 border-l-2 opacity-60 rounded-xl rounded-b-[80px]"
             style={{
               borderImage: isDarkMode
                 ? 'linear-gradient(to bottom, #f97316, #f59e0b, #eab308, #84cc16) 1'
                 : 'linear-gradient(to bottom, #fb923c, #fbbf24, #facc15, #a3e635) 1'
             }}></div>

        {/* The colored dots in the center */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 flex space-x-4">
          <div className="w-4 h-4 rounded-full bg-pink-500 animate-pulse"></div>
          <div className="w-4 h-4 rounded-full bg-purple-500 animate-pulse" style={{animationDelay: "0.2s"}}></div>
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" style={{animationDelay: "0.4s"}}></div>
          <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse" style={{animationDelay: "0.6s"}}></div>
          <div className="w-4 h-4 rounded-full bg-yellow-500 animate-pulse" style={{animationDelay: "0.8s"}}></div>
        </div>

        {/* Additional decorative elements */}
        <div className="absolute top-1/3 right-20 w-16 h-16 border-2 rounded-full opacity-60 "
             style={{
               borderImage: isDarkMode
                 ? 'linear-gradient(to right, #ec4899, #a855f7) 1'
                 : 'linear-gradient(to right, #f43f5e, #c084fc) 1'
             }}></div>

        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 border-2 rounded-full opacity-50 "
             style={{
               borderImage: isDarkMode
                 ? 'linear-gradient(to right, #14b8a6, #0ea5e9) 1'
                 : 'linear-gradient(to right, #2dd4bf, #38bdf8) 1'
             }}></div>
      </div>

      <Meta
        title={t('blogMetaTitle')}
        description={t('blogMetaDescription')}
        keywords={t('blogMetaKeywords')}
      />
      {/* Main Content */}
      <div className="container mx-auto px-4 mt-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Latest Posts */}
          <div className="lg:w-2/3">
            <h2 className={`text-3xl ${isDarkMode ? "text-gray-100" : "text-black"} font-bold mb-8 flex items-center`}>
              <FaFire className={`${isDarkMode ? "text-orange-400" : "text-orange-500"} mr-3 animate-pulse`} />
              {t('postTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {postsToDisplay.map((post) => (
                <PostCard key={post._id} post={post} isCompact={true} />
              ))}
            </div>
          </div>

          {/* Right Column - Search and Featured Posts */}
          <div className="lg:w-1/3">
            {/* Search Section */}
            <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-slate-50'} rounded-xl shadow-md p-6 mb-8 backdrop-blur-sm ${isDarkMode ? 'bg-opacity-70' : 'bg-opacity-90'}`}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>
                {t('postSearch')}
              </h2>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('postInputSearch')}
                    className={`w-full px-4 py-3 rounded-lg ${
                      isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400' : 'border-gray-300 bg-white'
                    } border focus:ring-2 ${
                      isDarkMode ? 'focus:ring-blue-400' : 'focus:ring-blue-500'
                    } focus:border-transparent transition-all duration-300`}
                  />
                  <FaSearch className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-500'
                  } transition-colors duration-300`} />
                </div>
              </div>
            </div>

            {/* Featured Posts */}
            <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-xl shadow-md p-6 backdrop-blur-sm ${isDarkMode ? 'bg-opacity-70' : 'bg-opacity-90'}`}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-6`}>
                {t('postFeatured')}
              </h2>
              <div className="space-y-6">
                {featuredPosts.map((post) => (
                  <PostCard key={post._id} post={post} isFeatured={true} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
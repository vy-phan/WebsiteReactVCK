import React, { useState, useEffect, useMemo } from 'react'; // Import useMemo
import { Link } from 'react-router-dom';
import { FaSearch, FaCalendarAlt, FaUser, FaFire } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import useCRUDPost from '../../hooks/useCRUDPost';
import { useAuthContext } from '../../context/AuthContext';
import useGetUsers from '../../hooks/useGetUsers';
import { marked } from "marked";
import Meta from '../../components/meta';

const Post = () => {
  const { t } = useTranslation();
  const { posts } = useCRUDPost();
  const { authUser } = useAuthContext();
  const { users } = useGetUsers();

  // Memoize mockPosts to prevent unnecessary recalculations
  const mockPosts = useMemo(() => {
    if (posts && posts.length > 0) { // Check if posts is not null or undefined and has length
      return posts.filter((post) => post.permission === true);
    } else {
      return []; // Return empty array if posts is not yet loaded or empty
    }
  }, [posts]); // Only recalculate when 'posts' array reference changes


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
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isFeatured ? 'flex gap-4' : ''
        }`}
    >
      <div className={`relative ${isFeatured ? 'w-1/3' : isCompact ? 'h-48' : 'h-56'}`}>
        <img
          src={post.imageUrl}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x240?text=Post+Image';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className={`${isFeatured ? 'flex-1 p-4' : 'p-4'}`}>
        <h2 className={`font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 ${isFeatured || isCompact ? 'text-lg' : 'text-xl'
          }`}>
          {post.title}
        </h2>
        {!isFeatured && (
          <>
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: marked(post.content) }}></p>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center space-x-2">
                <FaUser className="text-blue-500" />
                <span>{post.author ? users?.find((user) => user._id === post.author)?.username : 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="text-blue-500" />
                <span>{new Date(post.updatedAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </>
        )}
        <Link
          to={`/post/${post._id}`}
          className={`inline-block w-full text-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 hover:text-white transition-all duration-300 transform hover:scale-[1.02] ${isFeatured || isCompact ? 'text-sm' : ''
            }`}
        >
          {t('postButton')}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <Meta
        title={t('blogMetaTitle')} // Sử dụng translation cho title
        description={t('blogMetaDescription')} // Sử dụng translation cho description
        keywords={t('blogMetaKeywords')} // Sử dụng translation cho keywords
      />
      {/* Main Content */}
      <div className="container mx-auto px-4 mt-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Latest Posts */}
          <div className="lg:w-2/3">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
              <FaFire className="text-orange-500 mr-3 animate-pulse" />
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 backdrop-blur-sm bg-opacity-90">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('postSearch')}
              </h2>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('postInputSearch')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition-all duration-300"
                  />
                  <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-300" />
                </div>
              </div>
            </div>

            {/* Featured Posts */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 backdrop-blur-sm bg-opacity-90">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
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
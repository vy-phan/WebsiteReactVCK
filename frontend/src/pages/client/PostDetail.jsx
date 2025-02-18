import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaCalendarAlt, FaUser, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import useGetUsers from "../../hooks/useGetUsers";
import { marked } from "marked";
import useCRUDPost from "../../hooks/useCRUDPost";
import { useTranslation } from "react-i18next";

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { users } = useGetUsers();
  const { posts } = useCRUDPost(); // Lấy danh sách tất cả bài viết
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/post/${id}`);
        if (response.data.success) {
          setPost(response.data.data);
        } else {
          toast.error(
            response.data.message ||
              "Không thể tải bài viết. Vui lòng thử lại sau."
          ); // Hiển thị thông báo lỗi từ server nếu có
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Không thể tải bài viết. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="container mx-auto mt-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="container mx-auto mt-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Không tìm thấy bài viết
          </h1>
          <Link
            to="/post"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <FaArrowLeft className="mr-2" />
            {t("postDetailBack")}
          </Link>
        </div>
      </div>
    );
  }

  // Lọc bài viết liên quan (ví dụ: cùng category, loại bỏ bài viết hiện tại)
  const relatedPosts = posts
    .filter((p) => p.category === post.category && p._id !== post._id)
    .slice(0, 3); // Lấy tối đa 3 bài viết liên quan

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="container mx-auto mt-20">
        {/* Back Button */}
        <Link
          to="/post"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-6 transition-colors duration-200 ease-in-out"
        >
          <FaArrowLeft className="mr-2" />
          {t("postDetailBack")}
        </Link>

        {/* Post Content */}
        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden transition-shadow duration-300 hover:shadow-3xl">
          {/* Featured Image */}
          <div className="relative h-[500px]">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/1200x400?text=Post+Image";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="mb-3">
                <span className="px-4 py-2 bg-blue-600 text-sm font-semibold rounded-full hover:bg-blue-700 transition-colors duration-200">
                  {post.category}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center text-sm space-x-6">
                <div className="flex items-center">
                  <FaUser className="mr-2 text-blue-400" />
                  <span className="font-medium">{post.author ? users?.find((user) => user._id === post.author)?.username : 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-400" />
                  <span className="font-medium">
                    {new Date(post.updatedAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Post Body */}
          <div className="p-8 lg:p-12">
            <div className="prose prose-lg dark:prose-invert max-w-none text-lg text-justify">
              <div
                className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: marked(post.content) }}
              ></div>
            </div>
          </div>
        </article>

        {/* Related Posts Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            {t("postDetailTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Related Post Card */}
            {relatedPosts.map(
              (
                relatedPost // Sử dụng relatedPosts đã lọc
              ) => (
                <div
                  key={relatedPost._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="relative h-48">
                    <img
                      src={relatedPost.imageUrl}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/800x600?text=Related+Post"; // Ảnh placeholder cho related posts
                      }}
                    />
                  </div>
                  <div className="p-4">
                    {" "}
                    {/* Thêm padding để nội dung không bị sát viền */}
                    <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {" "}
                      {/* line-clamp-1 để giới hạn tiêu đề 1 dòng */}
                      {relatedPost.title}
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
                      {" "}
                      {/* line-clamp-2 để giới hạn mô tả 2 dòng */}
                      {relatedPost.content}
                    </p>
                    <Link
                      to={`/post/${relatedPost._id}`}
                      className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                    >
                      {t("postButton")} →
                    </Link>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;

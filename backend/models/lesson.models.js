import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    // Tên bài học
    nameLesson: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    }, // URL video bài giảng
    timeVideo: {
      type: String,
      default: "00:00"
    }, // Thời lượng video bài giảng
    description: {
      type: String,
    }, // Mô tả chi tiết bài học
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    }, // Tham chiếu khóa học chứa bài học
  },
  { timestamps: true }
);

// Tách hàm getYoutubeVideoId để tái sử dụng
function getYoutubeVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Hàm helper để xử lý thời lượng video
async function processVideoDuration(videoUrl) {
  const videoId = getYoutubeVideoId(videoUrl);
  if (!videoId) return null;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=AIzaSyDd8MOm9Th6npN8YfMIgFKvTv7-2C9Er1k`
    );
    const data = await response.json();
    if (data.items && data.items[0]) {
      const duration = data.items[0].contentDetails.duration;
      const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
      const hours = (match[1] ? match[1].replace('H', '') : 0);
      const minutes = (match[2] ? match[2].replace('M', '') : 0);
      const seconds = (match[3] ? match[3].replace('S', '') : 0);
      
      return `${hours > 0 ? hours + ':' : ''}${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }
  } catch (error) {
    console.error('Error fetching video duration:', error);
  }
  return null;
}

// Middleware pre-save
lessonSchema.pre('save', async function(next) {
  if (this.isModified('videoUrl')) {
    const duration = await processVideoDuration(this.videoUrl);
    if (duration) {
      this.timeVideo = duration;
    }
  }
  next();
});

// Middleware pre-findOneAndUpdate
lessonSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  if (update.videoUrl) {
    const duration = await processVideoDuration(update.videoUrl);
    if (duration) {
      update.timeVideo = duration;
    }
  }
  next();
});

const Lesson = mongoose.model("Lesson", lessonSchema);
export default Lesson;

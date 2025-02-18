import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { saveVerificationCode } from "./verification.helper.js";
dotenv.config();

export const mailSender = async ({ email, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const message = {
      from: "Course React",
      to: email,
      subject,
      html,
    };

    const info = await transporter.sendMail(message);
    console.log("Email sent successfully:", info.response);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: error.message };
  }
};

// Hàm gửi email xác thực
export const sendVerificationEmail = async (email, verificationCode) => {
  saveVerificationCode(email, verificationCode);

  const subject = "Xác minh email đăng ký";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1f2937; margin-bottom: 10px;">Xác thực email của bạn</h1>
        <p style="color: #4b5563; margin-bottom: 20px;">Cảm ơn bạn đã đăng ký. Vui lòng sử dụng mã xác thực dưới đây để hoàn tất quá trình đăng ký.</p>
      </div>
      
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #1f2937; margin-bottom: 15px;">Mã xác thực của bạn</h2>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4f46e5; background-color: #eef2ff; padding: 15px; border-radius: 6px;">
          ${verificationCode}
        </div>
      </div>
      
      <div style="color: #6b7280; font-size: 14px; text-align: center;">
        <p>Mã này sẽ hết hạn sau 5 phút.</p>
        <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
      </div>
    </div>
  `;

  return mailSender({ email, subject, html });
};

// Hàm gửi email chào mừng
export const sendWelcomeEmail = async (email, username) => {
  const subject = "Chào mừng bạn đến với Khóa học React!";
  const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
        <h2 style="color: #2c3e50; text-align: center;">🎉 Chào mừng bạn đến với Khóa học React! 🚀</h2>
        <p style="color: #34495e;">Xin chào <strong>${username}</strong>,</p>
        <p style="color: #34495e;">
          Chúc mừng bạn đã chính thức trở thành một thành viên của cộng đồng học tập React! 🎊 Đây sẽ là hành trình thú vị để bạn nâng cao kỹ năng lập trình và xây dựng các ứng dụng web chuyên nghiệp.
        </p>
        <p style="color: #34495e;">
          Hãy bắt đầu ngay bằng cách đăng nhập vào hệ thống và khám phá các bài học đầu tiên nhé!
        </p>
        <p style="color: #34495e;">
          Chúng tôi luôn ở đây để hỗ trợ bạn. Chúc bạn có một trải nghiệm học tập tuyệt vời! 🚀
        </p>
        <p style="color: #34495e; text-align: center;">
          <strong>💡 Học tập chăm chỉ hôm nay, trở thành lập trình viên giỏi ngày mai!</strong>
        </p>
      </div>
    `;

  return mailSender({ email, subject, html });
};

// Hàm gửi email đặt lại mật khẩu
export const sendPasswordResetEmail = async (email, resetCode) => {
  const subject = "Đặt lại mật khẩu của bạn";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1f2937; margin-bottom: 10px;">Đặt lại mật khẩu</h1>
        <p style="color: #4b5563; margin-bottom: 20px;">Vui lòng sử dụng mã xác thực dưới đây để đặt lại mật khẩu của bạn:</p>
      </div>
      
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #1f2937; margin-bottom: 15px;">Mã xác thực của bạn</h2>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4f46e5; background-color: #eef2ff; padding: 15px; border-radius: 6px;">
          ${resetCode}
        </div>
      </div>
      
      <div style="color: #6b7280; font-size: 14px; text-align: center;">
        <p>Mã này sẽ hết hạn sau 5 phút.</p>
        <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
      </div>
    </div>
  `;
  
  return mailSender({ email, subject, html });
};

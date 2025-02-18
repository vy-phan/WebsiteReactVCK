import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import User from "../models/user.models.js";
import PasswordReset from "../models/passwordReset.models.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
} from "../helpers/mail.sender.js";

// Lưu trữ tạm thởi thông tin đăng ký người dùng
const pendingRegistrations = new Map();

// Hàm kiểm tra mã xác thực
const verifyCode = (email, code) => {
  const registration = pendingRegistrations.get(email);
  if (!registration) {
    return { valid: false, message: "No pending registration found" };
  }

  // Kiểm tra thời gian hết hạn (5 phút)
  if (Date.now() - registration.timestamp > 5 * 60 * 1000) {
    pendingRegistrations.delete(email);
    return { valid: false, message: "Verification code has expired" };
  }

  if (registration.verificationCode !== code) {
    return { valid: false, message: "Invalid verification code" };
  }

  return { valid: true };
};

// Hàm xử lý đăng ký tài khoản
export const signup = async (req, res) => {
  try {
    const { username, password, gender, email, role } = req.body;

    // check if username or password is empty
    if (!username || !password || !gender || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all fields" });
    }

    // check if user already exists
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // avatar
    let avatar = req.body.avatarUrl || "";
    if (!avatar) {
      if (gender === "male") {
        avatar = `https://avatar.iran.liara.run/public/boy?username=${username}`;
      } else if (gender === "female") {
        avatar = `https://avatar.iran.liara.run/public/girl?username=${username}`;
      } else {
        avatar = `https://avatar.iran.liara.run/public?username=${username}`;
      }
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo mã xác thực
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Store registration data temporarily
    pendingRegistrations.set(email, {
      username,
      password: hashedPassword, // Lưu mật khẩu đã hash
      gender,
      email,
      avatarUrl: avatar,
      role: role || "user",
      verificationCode,
      timestamp: Date.now(),
    });

    // Send verification email (giả định bạn có hàm sendVerificationEmail)
    try {
      await sendVerificationEmail(email, verificationCode); // Cần cài đặt và import hàm này
    } catch (mailError) {
      console.error("Error sending verification email:", mailError);
      // Xử lý lỗi gửi email (ví dụ: thông báo cho người dùng, rollback đăng ký tạm thởi)
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again later.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Verification code sent to your email. Please verify to complete signup.",
    }); // Thông báo mã đã được gửi
    // Không tạo người dùng và không đăng nhập ở đây
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Hàm mới để xác minh mã xác thực và hoàn tất đăng ký
export const verifySignup = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    // Verify the code
    const verificationResult = verifyCode(email, verificationCode);
    if (!verificationResult.valid) {
      return res.status(400).json({
        success: false,
        message: verificationResult.message,
      });
    }

    // Get pending registration data
    const registrationData = pendingRegistrations.get(email);
    if (!registrationData) {
      return res.status(400).json({
        success: false,
        message: "Registration data not found or expired",
      });
    }

    // Create new user (mật khẩu đã được hash ở hàm signup)
    const newUser = new User({
      username: registrationData.username,
      password: registrationData.password, // Sử dụng mật khẩu đã hash từ registrationData
      gender: registrationData.gender,
      email: registrationData.email,
      avatarUrl: registrationData.avatarUrl,
      role: registrationData.role,
    });

    if (newUser) {
      await generateTokenAndSetCookie(newUser, res); // Đăng nhập sau khi xác thực thành công
      await newUser.save();
      pendingRegistrations.delete(email); // Xóa thông tin đăng ký tạm thởi sau khi thành công
      // Gửi email chào mừng (tùy chọn)
      try {
        await sendWelcomeEmail(email, registrationData.username); // Giả định bạn có hàm sendWelcomeEmail
      } catch (welcomeMailError) {
        console.error("Error sending welcome email:", welcomeMailError);
        // Xử lý lỗi gửi email chào mừng (không ảnh hưởng đến đăng ký chính)
      }

      res.status(201).json({
        success: true,
        message: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          gender: newUser.gender,
          avatarUrl: newUser.avatarUrl,
          role: newUser.role,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }

    // Định nghĩa hàm isMatch để so sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateTokenAndSetCookie(user, res);
    // console.log("JWT Token được tạo từ backend:", token); // <--- THÊM DÒNG LOG NÀY
    res.status(200).json({
      success: true,
      token, // Trả về JWT trong response
      message: {
        _id: user._id,
        username: user.username,
        email: user.email,
        gender: user.gender,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      errorDetails: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: "Logout successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No users found" });
    }
    res.status(200).json({ success: true, data: users }); // Trả về trong `data`
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const postUser = async (req, res) => {
  try {
    // **Không cần kiểm tra vai trò admin ở đây nữa**
    // Middleware authorizeRole đã xử lý việc này

    const { username, password, gender, email, role } = req.body;

    // Input Validation (combined for clarity)
    if (!username || !password || !gender || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng điền đầy đủ thông tin." });
    }

    if (!["male", "female"].includes(gender)) {
      return res
        .status(400)
        .json({ success: false, message: "Giới tính không hợp lệ." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Email không hợp lệ." });
    }

    // Check for existing user (username or email)
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Tên người dùng hoặc email đã tồn tại.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate Avatar URL
    const avatarUrl =
      gender === "male"
        ? `https://avatar.iran.liara.run/public/boy?username=${username}`
        : `https://avatar.iran.liara.run/public/girl?username=${username}`;

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      gender,
      email,
      avatarUrl,
      role: role || "user", // Default role is "user"
    });

    await newUser.save();

    // Create user response (exclude password)
    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      gender: newUser.gender,
      avatarUrl: newUser.avatarUrl,
      role: newUser.role,
    };

    res.status(201).json({ success: true, data: userResponse });
  } catch (error) {
    console.error("Error in postUser:", error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};

// Refactored deleteUser function
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng.", // Consistent message
      });
    }

    // Prevent deleting the last admin
    if (user.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "Không thể xóa người dùng quản trị cuối cùng.", // More user-friendly message
        });
      }
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      // Double check if deletion was successful (though unlikely after findById)
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng để xóa.", // In case user was deleted in between
      });
    }

    res.status(200).json({
      success: true,
      message: "Người dùng đã được xóa thành công.", // More user-friendly message
      data: { _id: userId }, // Optionally return the deleted user ID for confirmation
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server.", // Consistent message
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, currentPassword, newPassword, gender, avatarUrl, role} = req.body;
    const userId = req.params.id;

    // Kiểm tra user tồn tại
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng"
      });
    }

    // Kiểm tra quyền - chỉ admin hoặc chính user đó mới được cập nhật
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Không có quyền thực hiện"
      });
    }

    const updates = {};

    // Cập nhật username nếu có thay đổi
    if (username && username !== user.username) {
      // Kiểm tra username đã tồn tại chưa
      const existingUser = await User.findOne({
        username,
        _id: { $ne: userId }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Tên người dùng đã tồn tại"
        });
      }
      updates.username = username;
    }

    // Cập nhật gender nếu có thay đổi
    if (gender && gender !== user.gender) {
      if (!["male", "female"].includes(gender)) {
        return res.status(400).json({
          success: false,
          message: "Giới tính không hợp lệ"
        });
      }
      updates.gender = gender;


    }

     // Xử lý cập nhật role
     if (role) {
      updates.role = role;
    }

    // Xử lý cập nhật avatarUrl trực tiếp từ request body
    if (avatarUrl) {
      updates.avatarUrl = avatarUrl;
    }
    

    // Cập nhật password nếu có
    if (newPassword) {
      // Kiểm tra mật khẩu hiện tại
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập mật khẩu hiện tại"
        });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Mật khẩu hiện tại không đúng"
        });
      }

      // Validate mật khẩu mới
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Mật khẩu mới phải có ít nhất 6 ký tự"
        });
      }

      // Hash mật khẩu mới
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(newPassword, salt);
    }

    // Chỉ cập nhật nếu có thay đổi
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không có thông tin nào được cập nhật"
      });
    }

    // Thực hiện cập nhật
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: "Cập nhật thành công",
      data: updatedUser
    });

  } catch (error) {
    console.error("Lỗi cập nhật thông tin:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server"
    });
  }
};


// Hàm xử lý yêu cầu đặt lại mật khẩu
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email không tồn tại",
      });
    }

    // Tạo mã xác thực
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Lưu mã reset vào database
    await PasswordReset.findOneAndDelete({ email }); // Xóa mã cũ nếu có
    await PasswordReset.create({
      email,
      resetCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 phút
    });

    // Gửi email đặt lại mật khẩu
    await sendPasswordResetEmail(email, resetCode);

    return res.status(200).json({
      success: true,
      message: "Mã đặt lại mật khẩu đã được gửi đến email của bạn.",
      data: { email },
    });
  } catch (error) {
    console.error("Lỗi đặt lại mật khẩu:", error);
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi xử lý yêu cầu đặt lại mật khẩu",
    });
  }
};

// Hàm xác minh mã đặt lại mật khẩu và cập nhật mật khẩu mới
export const resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    // Kiểm tra mã reset
    const resetRequest = await PasswordReset.findOne({
      email,
      resetCode,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRequest) {
      return res.status(400).json({
        success: false,
        message: "Mã xác thực không hợp lệ hoặc đã hết hạn",
      });
    }

    // Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // Xóa mã reset đã sử dụng
    await PasswordReset.deleteOne({ email, resetCode });

    return res.status(200).json({
      success: true,
      message: "Mật khẩu đã được cập nhật thành công",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi đặt lại mật khẩu",
    });
  }
};


export const getCurrentUser = async (req, res) => {
  console.log("getCurrentUser controller - Bắt đầu thực thi..."); // <---- LOG 1: BẮT ĐẦU CONTROLLER

  try {
    console.log("getCurrentUser controller - Kiểm tra req.user:", req.user); // <---- LOG 2: KIỂM TRA req.user

    if (!req.user) { // Middleware protectRoute đã set req.user nếu JWT hợp lệ
      console.log("getCurrentUser controller - req.user không tồn tại. Trả về 401 Unauthorized."); // <---- LOG 3: req.user KHÔNG TỒN TẠI
      return res.status(401).json({ success: false, message: 'Unauthorized' }); // Không có req.user => JWT không hợp lệ
    }

    // Vì req.user đã chứa thông tin user đầy đủ, không cần query lại database
    const user = req.user;
    console.log("getCurrentUser controller - Thông tin user từ req.user:", user); // <---- LOG 4: THÔNG TIN USER TỪ req.user

    const responseData = { // Tạo object response data rõ ràng
      success: true,
      message: {
        _id: user._id,
        username: user.username,
        email: user.email,
        gender: user.gender,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    };
    console.log("getCurrentUser controller - Chuẩn bị gửi JSON response:", responseData); // <---- LOG 5: TRƯỚC KHI GỬI JSON

    // Trả về thông tin user (KHÔNG bao gồm password) trong response body
    res.status(200).json(responseData); // Sử dụng responseData đã tạo

    console.log("getCurrentUser controller - Gửi JSON response thành công."); // <---- LOG 6: SAU KHI GỬI JSON (THÀNH CÔNG)

  } catch (error) {
    console.error("getCurrentUser controller - Lỗi trong catch block:", error); // <---- LOG 7: LỖI TRONG CATCH BLOCK
    res.status(500).json({ success: false, message: "Server Error" });
    console.log("getCurrentUser controller - Gửi JSON lỗi 500."); // <---- LOG 8: SAU KHI GỬI JSON LỖI 500
  }

  console.log("getCurrentUser controller - Kết thúc thực thi."); // <---- LOG 9: KẾT THÚC CONTROLLER
};

import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

const protectRoute = async (req, res, next) => {
  // console.log("protectRoute Middleware - Bắt đầu thực thi..."); // <---- LOG 1: BẮT ĐẦU MIDDLEWARE

  let token;

  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    // console.log("protectRoute Middleware - Không có JWT token, Unauthorized."); // <---- LOG 2: KHÔNG CÓ TOKEN
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const userId = verified.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      // console.log("protectRoute Middleware - User không tồn tại, Unauthorized."); // <---- LOG 3: USER KHÔNG TỒN TẠI
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    // console.log("protectRoute Middleware - Xác thực thành công, set req.user:", req.user); // <---- LOG 4: XÁC THỰC THÀNH CÔNG
    next(); // <---- GỌI NEXT SAU KHI LOG
    // console.log("protectRoute Middleware - Gọi next() thành công."); // <---- LOG 5: SAU KHI GỌI NEXT

  } catch (error) {
    // console.error("protectRoute Middleware - Lỗi xác thực JWT:", error); // <---- LOG LỖI
    return res.status(401).json({ message: "Unauthorized" });
  }

  // console.log("protectRoute Middleware - Kết thúc thực thi."); // <---- LOG 6: KẾT THÚC MIDDLEWARE
};


export default protectRoute;
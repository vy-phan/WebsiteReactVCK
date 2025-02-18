import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (user, res) => { // Nhận đối tượng user thay vì userId
    try {
        // Tạo token JWT, payload bây giờ bao gồm userId và role
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { // Thêm role vào payload
            expiresIn: '15d'
        });

        res.cookie("jwt", token, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== 'development'
        });

        return token;
        
    } catch (error) {
        console.error('Error generating token:', error);
        // Xử lý lỗi
    }
};

export default generateTokenAndSetCookie;
// Lưu trữ mã xác minh trong bộ nhớ
const verificationCodes = new Map();

// Thêm thời gian hết hạn là hằng số
const VERIFICATION_EXPIRY = 5 * 60 * 1000; // 5 phút

// Tạo mã xác minh ngẫu nhiên gồm 6 chữ số
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Lưu mã xác minh có dấu thời gian
const saveVerificationCode = (email, code) => {
    verificationCodes.set(email, {
        code,
        timestamp: Date.now()
    });
};

// Verify the code
const verifyCode = (email, code) => {
    const verification = verificationCodes.get(email);
    if (!verification) {
        return { valid: false, message: "Mã xác thực không tồn tại" };
    }

    if (Date.now() - verification.timestamp > VERIFICATION_EXPIRY) {
        verificationCodes.delete(email); // Xóa mã hết hạn
        return { valid: false, message: "Mã xác thực đã hết hạn" };
    }

    // Kiểm tra mã xác thực có khớp không
    if (verification.code !== code) {
        return { valid: false, message: "Mã xác thực không chính xác" };
    }

    // Xóa mã xác thực sau khi xác thực thành công
    verificationCodes.delete(email);
    return { valid: true, message: "Xác thực thành công" };
};

// Xóa mã xác thực 
const removeVerificationCode = (email) => {
    verificationCodes.delete(email);
};

// Kiểm tra xem mã xác thực có tồn tại và còn hiệu lực không
const isVerificationCodeValid = (email) => {
    const verification = verificationCodes.get(email);
    if (!verification) {
        return false;
    }

    if (Date.now() - verification.timestamp > VERIFICATION_EXPIRY) {
        verificationCodes.delete(email);
        return false;
    }

    return true;
};

export {
    generateVerificationCode,
    saveVerificationCode,
    verifyCode,
    removeVerificationCode,
    isVerificationCodeValid,
    VERIFICATION_EXPIRY
};

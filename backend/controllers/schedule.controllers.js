import Schedule from "../models/schedule.models.js";

export const getScheduleAll = async (req, res) => {
    try {
        const schedules = await Schedule.find()
        res.status(200).json({success: true, data: schedules});
    } catch (error) {
        console.error('Lỗi khi lấy lịch học:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy lịch học.' });
    }
};

export const getSchedulesByUserId = async (req, res) => {
    try {
        const userId = req.params.id; // <--  THIS IS STILL LIKELY THE PROBLEM
        const schedules = await Schedule.find({ userId: userId })

        if (!schedules || schedules.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy lịch học cho người dùng này.' });
        }

        res.status(200).json({success: true, data: schedules});
    } catch (error) {
        console.error('Lỗi khi lấy lịch học theo userId:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy lịch học.' });
    }
};

export const createSchedule = async (req, res) => {
    try {
        const { userId, courseId, level, totalDays, endDate, scheduleItems } = req.body;

        if (!userId || !courseId || !level || !totalDays || !endDate || !scheduleItems) {
            return res.status(400).json({ message: 'Vui lòng cung cấp userId, courseId, level, totalDays, endDate, scheduleItems.' });
        }

        if (!Array.isArray(scheduleItems)) {
            return res.status(400).json({ message: 'scheduleItems phải là một mảng.' });
        }

        for (const item of scheduleItems) {
            if (!item.day || !Array.isArray(item.lessons)) {
                return res.status(400).json({ message: 'Mỗi item trong scheduleItems phải có thuộc tính "day" (Date) và "lessons" (mảng ObjectId).' });
            }
        }

        const newSchedule = new Schedule({
            userId,
            courseId,
            level,
            totalDays,
            endDate: new Date(endDate), 
            scheduleItems,
        });

        const savedSchedule = await newSchedule.save();
        res.status(201).json({success: true, data: savedSchedule}); 

    } catch (error) {
        console.error('Lỗi khi tạo lịch học:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Lỗi xác thực dữ liệu.', errors: error.errors });
        }
        res.status(500).json({ message: 'Lỗi máy chủ khi tạo lịch học.' });
    }
};


export const updateSchedule = async (req, res) => {
    try {
        const scheduleId = req.params.scheduleId; 
        const updates = req.body;

        if (!scheduleId) { 
            return res.status(400).json({ message: 'Vui lòng cung cấp scheduleId để cập nhật.' });
        }

        const updatedSchedule = await Schedule.findByIdAndUpdate(scheduleId, updates, {
            new: true,
            runValidators: true,
        })

        if (!updatedSchedule) { 
            return res.status(404).json({ message: 'Không tìm thấy lịch học để cập nhật.' });
        }

        res.status(200).json({success: true, data: updatedSchedule}); 
    } catch (error) {
        console.error('Lỗi khi cập nhật lịch học:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Lỗi xác thực dữ liệu khi cập nhật.', errors: error.errors });
        }
        res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật lịch học.' });
    }
};

export const deleteSchedule = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: 'Vui lòng cung cấp scheduleId để xóa.' });
        }

        const deletedSchedule = await Schedule.findByIdAndDelete(id);

        if (!deletedSchedule) {
            return res.status(404).json({success: false, message: 'Không tìm thấy lịch học để xóa.' });
        }

        res.status(200).json({success: true, message: 'Lịch học đã được xóa thành công.' });
    } catch (error) {
        console.error('Lỗi khi xóa lịch học:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi xóa lịch học.' });
    }
};

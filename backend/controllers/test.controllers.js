import Test from '../models/test.models.js';

// Create a new test result
export const createTest = async (req, res) => {
    try {
        const { userId, courseId, score } = req.body;
        const isPass = score >= 5; // Pass if score is 5 or higher

        const test = new Test({
            userId,
            courseId,
            score,
            isPass
        });

        const savedTest = await test.save();
        res.status(201).json(savedTest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all tests
export const getTests = async (req, res) => {
    try {
        const tests = await Test.find()
            .populate('userId', 'fullName email')
            .populate('courseId', 'title');
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get tests by user ID
export const getTestsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const tests = await Test.find({ userId })
            .populate('courseId', 'title')
            .sort({ createdAt: -1 });
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get tests by course ID
export const getTestsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const tests = await Test.find({ courseId })
            .populate('userId', 'fullName email')
            .sort({ createdAt: -1 });
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get specific test by user and course
export const getTestByUserAndCourse = async (req, res) => {
    try {
        const { userId, courseId } = req.params;
        const test = await Test.findOne({ userId, courseId })
            .populate('userId', 'fullName email')
            .populate('courseId', 'title');
        
        if (!test) {
            return res.status(404).json({ message: "Test not found" });
        }
        
        res.status(200).json(test);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update test result
export const updateTest = async (req, res) => {
    try {
        const { id } = req.params;
        const { score } = req.body;
        const isPass = score >= 5;

        const updatedTest = await Test.findByIdAndUpdate(
            id,
            { score, isPass },
            { new: true }
        );

        if (!updatedTest) {
            return res.status(404).json({ message: "Test not found" });
        }

        res.status(200).json(updatedTest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete test
export const deleteTest = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTest = await Test.findByIdAndDelete(id);

        if (!deletedTest) {
            return res.status(404).json({ message: "Test not found" });
        }

        res.status(200).json({ message: "Test deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
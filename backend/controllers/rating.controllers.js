import Rating from "../models/rating.models.js";

export const createRating = async (req, res) => {
    const { userId, courseId, rating } = req.body;
    if (!userId || !courseId || !rating) {
        return res.status(400).json({ message: "Vui lòng cung cấp userId, courseId, rating" });
    }
    try {
        // Check if user has already rated this course
        const existingRating = await Rating.findOne({ userId, courseId });
        
        if (existingRating) {
            // Update existing rating
            existingRating.rating = rating;
            await existingRating.save();
            return res.status(200).json({ success: true, data: existingRating });
        }

        // Create new rating
        const newRating = new Rating({
            userId,
            courseId,
            rating
        });
        await newRating.save();
        res.status(201).json({ success: true, data: newRating });
    } catch (error) {
        console.error("Error in POST rating:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getRatings = async (req, res) => {
    try {
        const ratings = await Rating.find();
        res.status(200).json({ success: true, data: ratings });
    } catch (error) {
        console.error("Error in GET ratings:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getRatingByCourseId = async (req, res) => {
    const { id } = req.params;
    try {
        const ratings = await Rating.find({ courseId: id });
        
        if (ratings.length === 0) {
            return res.status(200).json({ 
                success: true, 
                averageRating: 0,
                totalRatings: 0,
                ratings: []
            });
        }

        // Calculate average rating
        const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        const averageRating = totalRating / ratings.length;
        
        // Count ratings for each star level (1-5)
        const ratingCounts = {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        };
        
        ratings.forEach(rating => {
            ratingCounts[rating.rating]++;
        });
        
        res.status(200).json({ 
            success: true, 
            averageRating: Math.round(averageRating * 10) / 10,
            totalRatings: ratings.length,
            ratingDistribution: ratingCounts,
            ratings: ratings
        });
    } catch (error) {
        console.error("Error in GET rating by course ID:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getUserCourseRating = async (req, res) => {
    const { userId, courseId } = req.params;
    try {
        const rating = await Rating.findOne({ userId, courseId });
        
        if (!rating) {
            return res.status(404).json({ 
                success: false, 
                message: "Rating not found" 
            });
        }
        
        res.status(200).json({ success: true, data: rating });
    } catch (error) {
        console.error("Error in GET user course rating:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
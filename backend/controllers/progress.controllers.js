import Progress from '../models/progress.models.js'
import mongoose from 'mongoose'

export const postProgress = async(req,res) => {
    const progress = req.body 

    if (!progress.userId || !progress.courseId) {
        return res.status(400).json({success: false,message: "Please input all fields"})
    }

    const newProgress = new Progress(progress)
    try {
        await newProgress.save()
        res.status(201).json({success: true,data: newProgress})
    } catch (error) {
        console.error("Error in POST Progress:", error.message);
        res.status(500).json({success: false, message: "Server Error"})
    }
}

export const getProgressById = async (req, res) => {
    const { id } = req.params; 

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "No such progress with this ID" });
    }

    try {
        const progress = await Progress.findById(id);

        if (!progress) {
            return res.status(404).json({ success: false, message: "Progress not found" });
        }

        res.status(200).json({ success: true, data: progress });
    } catch (error) {
        console.error("Error in GET Progress by ID:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const getProgresses = async(req,res) => {
    try {
        const progresses = await Progress.find();
        res.status(200).json({ success: true, data: progresses });
    } catch (error) {   
        console.log("Error in GET progresses:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const updateProgress = async(req,res) => {
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success: false, message: "No such progress"})
    }
    try {
        const updatedProgress = await Progress.findByIdAndUpdate(id, {...req.body}, {new: true})
        res.status(200).json({success: true, message: updatedProgress})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: "Server Error"})    
    }
}   
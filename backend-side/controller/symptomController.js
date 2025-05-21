import mongoose from 'mongoose';

import Symptom from '../models/SymptomTracker.js';
import MainUser from '../models/MainUser.js'

export const createSymptom = async (req, res) => {
  try {
    const { name, description, elderlyPerson } = req.body;
    const loggedBy = req.user.id;

    if (!name) return res.status(400).json({ message: "Symptom name is required" });

    const newSymptom = new Symptom({ name, description, loggedBy, elderlyPerson });
    await newSymptom.save();

    res.status(201).json(newSymptom);
  } catch (error) {
    res.status(500).json({ message: "Server error creating symptom", error });
  }
};

export const getSymptoms = async (req, res) => {
  try {
    const symptoms = await Symptom.find()
      .populate('loggedBy', 'name email')
      .limit(100);
    res.json(symptoms);
  } catch (error) {
    console.error('Error fetching symptoms:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteSymptom = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid symptom ID" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const symptom = await Symptom.findById(id);

    if (!symptom) {
      return res.status(404).json({ message: "Symptom not found" });
    }

    if (!symptom.loggedBy) {
      return res.status(400).json({ message: "Symptom missing loggedBy user" });
    }

    if (symptom.loggedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to delete this symptom" });
    }

    await Symptom.findByIdAndDelete(id);

    res.json({ message: "Symptom deleted" });
  } catch (error) {
    console.error("Delete symptom error:", error);
    res.status(500).json({ message: "Error deleting symptom", error });
  }
};

export const getSymptomTrends = async (req, res) => {
  try {
    const { elderlyPerson } = req.query;

    if (!elderlyPerson || !mongoose.Types.ObjectId.isValid(elderlyPerson)) {
      return res.status(400).json({ message: "Valid elderlyPerson ID is required" });
    }

    const trends = await Symptom.aggregate([
      { $match: { elderlyPerson: new mongoose.Types.ObjectId(elderlyPerson) } },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: "%Y-%m-%d", date: "$dateLogged" } },
            name: "$name",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.day": 1 } },
    ]);

    res.json(trends);
  } catch (error) {
    console.error("Error fetching symptom trends:", error);
    res.status(500).json({ message: "Error fetching trends", error });
  }
};

import MedicalRecord from "../models/MedicalRecords.js"; // models schema

const getAllMedicalRecords = async (req, res) => {
    try {
        const medicalRecords = await MedicalRecord.find()
        console.log(medicalRecords)
        res.status(200).json(medicalRecords)
        
    } catch (error) {
        res.status(500).json({
            message: "Error Fetching Medical records",
            error: error.message
        })
    }
}

const addMedicalRecord = async (req, res) => {
    try {
        const {description, doctorName, category, fileUrl} = req.body
        const newRecord = new MedicalRecord({
            description,
            doctorName,
            category,
            fileUrl,
            uploadAt: Date.now()
        })
        const savedRecord = await newRecord.save() // saving to mongoDB
        
        res.status(201).json({
            message: "Medical Record added successfully",
            error: false,
            data: savedRecord // returning the saved record
        })
    } catch (error) {
        res.status(500).json({
            message: "Error adding medical record",
            error: error.message
        })
        
    }
}


const uploadFile = async (req, res) => {
    try {
        const { description, doctorName, category} = req.body
        const fileUrl = req.file.path // cloudinary url

        //save url to mongodb
        const newRecord = new MedicalRecord({ 
            description,
            doctorName,
            category,
            fileUrl,
            uploadAt: Date.now()
        })

        const savedRecord = await newRecord.save()
        
        res.status(200).json({
            message: "File Uploaded Successfully",
            error: false,
            data: savedRecord // retruning the save Record
        })
    } catch (error) {
        res.status(500).json({
            message: "Error Uploadin File",
            error: error.message
        })
        
    }
}
export {getAllMedicalRecords, addMedicalRecord, uploadFile}
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const User = require("../models/user");

const uploadimage = async (req,res) => {
    try {

        if(!req.file) {
            return res.status(400).json({
                success: false,
                massage: "no file uploaded"
            });
        }
        const result =  await cloudinary.uploader.upload(req.file.path);

        fs.unlinkSync(req.file.path);

        await User.findByIdAndUpdate(
            req.user.id,
            {
                profileImage: result.secure_url
            }
        );

        return res.status(200).json({
            success: true,
            imageurl: result.secure_url
        });
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {uploadimage};
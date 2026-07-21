const crypto = require("crypto");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const transporter = require("../config/nodemailer");
const registerUser = async (req, res) => {

    try{
        const { name, email, password } = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({
            success: false,
            massage: "all the feild are require"
        })
    }

    const existingUser = await User.findOne({email})

    if(existingUser) {
        return res.status(409).json({
            success: false, 
            massage: "email is already exist"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    res.status(201).json({
        success:true,
        massage: "registration sussecfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }

    });
    } catch(error) {

    }
};

const loginUser = async (req, res) => {

    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({
            success:false,
            massage: "fill the all details"
        })
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
    return res.status(401).json({
        success: false,
        message: "Invalid email or password"
    });
    }
        
    const isPasswordMatched = await bcrypt.compare(
        password,
        existingUser.password
    )

    if (!isPasswordMatched) {
    return res.status(401).json({
        success: false,
        message: "Invalid email or password"
    });
}

    const token = jwt.sign(
    { id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
);

    return res.status(200).json({
    success: true,
    message: "Login Successful",
    token,
    user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        profileImage: existingUser.profileImage
    }
});
}

const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = resetToken;

        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

        await user.save();

        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset",
            html: `
                <h2>Reset Password</h2>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}">${resetLink}</a>
            `
        });


        return res.status(200).json({

    success: true,

    message: "Reset Token Generated",

    token: resetToken

});

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

const resetPassword = async (req, res) => {

    try{

        const {token} = req.params;
        const {password} = req.body;

        const user = await User.findOne({

        resetPasswordToken: token,

        resetPasswordExpires: { $gt: Date.now() }

    });

    if(!user){

    return res.status(400).json({

        success:false,

        message:"Invalid or Expired Token"

    });

}
        const hashedPassword = await bcrypt.hash(password,10);

        user.password = hashedPassword;

        user.resetPasswordToken = undefined;

        user.resetPasswordExpires = undefined;

        await user.save();

        return res.status(200).json({

            success:true,

            message:"Password Reset Successfully"

        });


    }catch (error) {
        return res.status(400).json({
            success: false,
            massage: error.massage
        })
    }
}

const getProfile = async (req, res) => {

    console.log("getprofile controlled")

    try {

        const user = await User.findById(req.user.id).select("-password");

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getProfile
}; 
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const {
    registerUser,
    loginUser
} = require("../controllers/user.controller");
const upload = require("../middleware/upload");
const { uploadimage } = require("../controllers/upload.controller");
const {
    forgotPassword
} = require("../controllers/user.controller");
const {resetPassword} = require("../controllers/user.controller")
const {getProfile} = require("../controllers/user.controller")
// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Protected Route

router.get("/users",authMiddleware, adminMiddleware, (req, res) => {
    res.json({
        success: true,
        massage: "welcome admin"
    })
})

//upload
router.post("/upload",
    upload.single("image"),
    uploadimage
)

router.post(
    "/upload-profile",
    authMiddleware,
    upload.single("image"),
    uploadimage
);

router.post("/forgot-password",
    forgotPassword
)

router.post("/reset-password/:token", resetPassword);

router.get("/profile", authMiddleware, getProfile);

// Sabse LAST me export
module.exports = router;
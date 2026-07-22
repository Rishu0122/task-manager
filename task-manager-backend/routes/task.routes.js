const express = require("express")
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware")


const {createdTask, findTask, updateTask, deleteTask, search} = require("../controllers/task.controller")


router.post("/create",authMiddleware, createdTask);
router.get("/",authMiddleware, findTask);
router.put("/update/:id", authMiddleware, updateTask);
router.delete("/delete/:id",authMiddleware, deleteTask);
router.get("/search",authMiddleware, search)
module.exports = router;
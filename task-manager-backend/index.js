require("dotenv").config();
const connectDB = require("./config/db")
const express = require("express")
const userRouter = require("./routes/user.routes");
const taskRouter = require("./routes/task.routes")
const cors  = require("cors");

const app = express();
app.use(cors({
    origin: [
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://6a5fc9f50ccbeb3b2282b850--dazzling-mousse-f53346.netlify.app"
    ]
}))
app.use(express.json());
connectDB();
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter)

app.listen(3000);

app.get("/", function(req, res) {

    res.send("hello");
})

app.get("/about", (req, res) => {
    res.send("this is about page")
})

app.get("/contact", (req, res) => {
    res.send("this is contact page")
}) 
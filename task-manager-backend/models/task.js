const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({

    title:{
        type:String,
        required: true
    },
    description:{ 
        type:String,
    },
    status:{
        type:String,
        enum:["pending", "in-progress", "complete"],
        default: "pending"
    },
    priority:{
        type:String,
        enum:["low", "medium","high"],
        default: "medium"   
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

module.exports= mongoose.model("Task", taskSchema);
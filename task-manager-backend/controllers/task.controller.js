const task = require("../models/task");

const createdTask = async (req, res) => {

try{
const {title, description, status, priority} = req.body

if(!title) {
    return res.status(400).json({

        success: false,
        massage:"the title field is required"
    })
}

const makeTask =  await task.create({title , description,status,priority, user:req.user.id});

return res.status(201).json({
    succes:true,
    massage: "task created successfully",
    task: makeTask 
})

} catch(error) {

    return res.status(400).json({
        success:false,
        massgae:error.message
    })
}
}

const findTask = async (req,res) => {

    try{

    const tasks = await task.find({user: req.user.id})

    return res.status(200).json({
        success: true,
        massage:"all of your tasks",
        tasks: tasks
    })

} catch(error) {

    return res.status(500).json({
        success:false,
        massage:error.message
    })
}

} 

const updateTask = async (req,res) => {

    try{
    const Task = await task.findById(req.params.id)

    if(!Task) {
        return res.status(400).json({
            success:false,
            massgae:"not find",
            
        })
    }

    const isOwner = req.user.id;

    if(Task.user.toString() !== isOwner) {

        return res.status(403).json({
            success:false,
            massage:"access denied"
        })
    }

    const {title, description, status, priority} = req.body

    Task.title =title
    Task.description=description
    Task.status = status
    Task.priority= priority

    await Task.save()

    return res.status(200).json({
        success:true,
        massage: "updated successfully",
        tasks:Task
    })
} catch(error) {
    return res.status(400).json({
        success:false,
        massage:error.message
    })
}
}

const deleteTask = async (req, res) => {

    const tasks = await task.findById(req.params.id);

    if(!tasks) {
        return res.status(400).json({
            success:false,
            massage:"task not found"
        })
    }

    const isOwner = req.user.id;

    if(tasks.user.toString() !== isOwner) {

        return res.status(403).json({
            success:false,
            massage:"access denied"
        })
    }

    await tasks.deleteOne()

    return res.status(200).json({
        success: true,
        massage: "the task is deleted"
    })
}

const search = async (req, res) => {

    const taskSearch = req.query.search
    const tasks = await task.find({
        user:req.user.id,
        title: {
            $regex: taskSearch,
            $options: "i"
        }
    });

    if(!tasks) {
        return res.status(400).json({
            success:false,
            massage:"access denied"
        })
    }

    return res.status(200).json({
        success:true,
        massage:"result found",
        tasks:tasks
    })

    console.log(req.query.search);
}

module.exports = {
    createdTask,
    findTask,
    updateTask,
    deleteTask,
    search
}
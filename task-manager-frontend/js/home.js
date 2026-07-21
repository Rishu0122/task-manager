let editingTaskId = null;
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "./login.html";
}

async function getProfile() {

    try {

        const response = await fetch(
            "http://localhost:3000/api/users/profile",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        document.getElementById("welcomeUser").innerText =
            `${data.user.name}`;

        document.getElementById("profileImage").src =
            data.user.profileImage ||
            "https://ui-avatars.com/api/?name=" + data.user.name;

    } catch (error) {
        console.log(error);
    }
}

const createdTask = document.getElementById("createTask");
const closetask = document.getElementById("closetask");
const popup = document.getElementById("taskModal")

createdTask.addEventListener("click", (e) => {
    e.preventDefault()
    popup.classList.add("show")
})

popup.addEventListener("click", (e) => {
    if (e.target === popup) {
        popup.classList.remove("show")
    }
})

closetask.addEventListener("click", (e) => {
    e.preventDefault()
    popup.classList.remove("show")
})

const form = document.getElementById("taskCreation");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("Description").value;
    const status = document.getElementById("Status").value;
    const priority = document.getElementById("Priority").value;

    const token = localStorage.getItem("token");

    let response;

    if (editingTaskId) {

        // UPDATE TASK
        response = await fetch(
            `http://localhost:3000/api/tasks/update/${editingTaskId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    status,
                    priority
                })
            }
        );

    } else {

        // CREATE TASK
        response = await fetch(
            "http://localhost:3000/api/tasks/create",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    status,
                    priority
                })
            }
        );
    }

    const data = await response.json();

    alert(data.massage);

    form.reset();
    popup.classList.remove("show");

    // Update mode se bahar aa jao
    editingTaskId = null;

    // Button aur heading wapas normal
    create.textContent = "Create Task";
    updatetask.textContent = "Create Task"; // agar heading ka id updatetask hai

    getAllTask();
});


async function getAllTask() {

    const token = localStorage.getItem("token");
    const response = await fetch(
            "http://localhost:3000/api/tasks",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        const data = await response.json();
        console.log(data);

        const div = document.getElementById("taskList");
        div.innerHTML =""

        data.tasks.forEach((task) => {

            div.innerHTML +=  `<div class="task-card">
            
        <h3> ${task.title}</h3>

            
        <p>  ${task.description}</p>

            
        <p>  ${task.status}</p>

            
        <p>  ${task.priority}</p>

        <button class="editButton" data-id="${task._id}">
            Edit
        </button>
        <button class="deleteButton" data-id="${task._id}"> Delete </button>

    </div>
`;
            
});
        const editbutn = document.querySelectorAll(".editButton")
        const deletetask = document.querySelectorAll(".deleteButton")
        const create = document.getElementById("create");
        const updatetask = document.getElementById("updatetask");
        const taskcard = document.getElementsByClassName("task-card")
        editbutn.forEach((button) => {
            button.addEventListener("click", (e) => {
                const id  = button.dataset.id
                popup.classList.add("show")
                create.textContent = "Update Task"
                updatetask.textContent ="Update Task"
                editingTaskId = button.dataset.id


                const search = data.tasks.find((task) => {

                    return task._id === id;
                })

                const title = document.getElementById("title");
                const description = document.getElementById("Description");
                const status = document.getElementById("Status");
                const priority = document.getElementById("Priority");

                if(search) {
                        title.value = search.title
                        description.value = search.description
                        status.value = search.status
                        priority.value = search.priority
                    }


            });
            
});

                deletetask.forEach((button) => {

                    const token = localStorage.getItem("token");
                    button.addEventListener("click", async (e) => {
                        const id = button.dataset.id
                        const response = await fetch(
            `http://localhost:3000/api/tasks/delete/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            const data = await response.json()
            alert(data.massage)
            getAllTask();
                    })
                })
}



getProfile();
getAllTask();
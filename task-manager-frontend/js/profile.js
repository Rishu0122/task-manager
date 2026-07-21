const token = localStorage.getItem("token");

if (!token) {

    alert("Please Login First");

    window.location.href = "./login.html";

}

async function getProfile() {

    try {

        const response = await fetch(
            " https://task-manager-jyrx.onrender.com/api/users/profile",
            {

                method: "GET",

                headers: {
                    Authorization: `Bearer ${token}`
                }

            }
        );

        const data = await response.json();

        document.getElementById("name").innerText = data.user.name;

        document.getElementById("email").innerText = data.user.email;

        document.getElementById("role").innerText = data.user.role;

        document.getElementById("profileImage").src = data.user.profileImage;

        const logoutBtn = document.getElementById("logoutBtn");
        const goback =document.getElementById("go-back");

        logoutBtn.addEventListener("click", () => {

            localStorage.removeItem("token");

            alert("Logout Successful");

            window.location.href = "./login.html";

        });

        goback.addEventListener("click", () => {
            window.location.href= "./home.html"
        })

        console.log(data);

    } catch (error) {

        console.log(error);

    }

}

const imageInput = document.getElementById("image");

imageInput.addEventListener("change", async () => {

    const file = imageInput.files[0];

    if (!file) return;

    // Preview
    profileImage.src = URL.createObjectURL(file);

    const formData = new FormData();

    formData.append("image", file);

    try {

        const response = await fetch(
            " https://task-manager-jyrx.onrender.com/api/users/upload-profile",
            {
                method: "POST",

                headers: {
                    Authorization: `Bearer ${token}`
                },

                body: formData
            }
        );

        const data = await response.json();

        alert(data.message);

        getProfile();

    } catch (error) {

        console.log(error);

    }

});

const loading = document.getElementById("loading");

loading.style.display = "block";

try{

    // Upload

    loading.style.display = "none";

}catch(error){

    loading.style.display = "none";

}

getProfile();
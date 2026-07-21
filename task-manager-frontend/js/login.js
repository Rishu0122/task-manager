const loginForm = document.getElementById("LoginForm");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch(
            " https://task-manager-jyrx.onrender.com/api/users/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (data.success) {

            localStorage.setItem("token", data.token);

            alert("Login Successful");

            window.location.href = "./home.html";

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.log(error);

        alert("Something went wrong");

    }

});
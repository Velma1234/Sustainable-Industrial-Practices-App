document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.getElementById("registerform");

  registrationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const email = document.getElementById("useremail").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstname, lastname, email, password }),
      });

            if (response.ok) {
              alert("Registration successful");

              // Redirect to login after 1 second
              console.log("Redirecting to login page");
              setTimeout(() => {
                window.location.href = "login.html";
              }, 1000);

            } else {
              alert("Registration failed ");


            }

      
    } catch (err) {
      alert("An error occurred: " + err.message);
    }
  });
});

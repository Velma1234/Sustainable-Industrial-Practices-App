document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.getElementById("registerform");
  const authmsg = document.getElementById("authmsg"); // Assuming you have an element to display the authentication message.

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

      const data = await response.json();

      if (!response.ok) {
        authmsg.textContent = data.message || "Registration failed";
      } else {
        authmsg.textContent = "Registration succesful ";

        // Redirect to login after 1 second
        console.log("Redirecting to login.html");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1000);
      }
    } catch (err) {
      authmsg.textContent = "An error occurred: " + err.message;
    }
  });
});

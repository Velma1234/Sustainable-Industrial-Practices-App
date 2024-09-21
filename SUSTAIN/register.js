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
        alert("Registration Successful");
        window.location.href = "/login.html"; // Redirect to login form after success
      } else {
        alert("Registration failed!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
});
// Handle login form submission

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById(" useremail").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          alert("Login successful");
          window.location.href = "/addexpenses"; // Redirect to add expenses page after successful login
        } else {
          const data = await response.json();
          alert(data.error || "Login failed"); // Display specific error message
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      }
    });
  }   
    



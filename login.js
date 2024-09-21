document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginform");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("useremail").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/login", {
        // Change to the correct login endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        alert("Login successful");

        // Redirect to Dashboard.html after 1 second
        console.log("Redirecting to Dashboard.html");
        setTimeout(() => {
          window.location.href = "Dashboard.html";
        }, 1000);
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (err) {
      alert("An error occurred: " + err.message);
    }
  });
});

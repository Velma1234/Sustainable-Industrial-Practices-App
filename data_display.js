document.addEventListener("DOMContentLoaded", function () {
  fetchUserData();
});

function fetchUserData() {
  // Replace with your actual API endpoint
  fetch("/api/user-data")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const tableBody = document
        .getElementById("dataTable")
        .querySelector("tbody");
      tableBody.innerHTML = ""; // Clear existing data

      // Iterate over the data and create table rows
      data.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${item.energyUsage || "N/A"}</td>
                    <td>${item.wasteProduction || "N/A"}</td>
                    <td>${item.waterUsage || "N/A"}</td>
                    <td>${item.carbon || "N/A"}</td>
                    <td>${item.renewable || "N/A"}</td>
                `;
        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
      alert("Error fetching user data");
    });
}

// Sustainability Benchmark Chart
const benchmarkCtx = document.getElementById("benchmarkChart").getContext("2d");
const benchmarkChart = new Chart(benchmarkCtx, {
  type: "bar",
  data: {
    labels: ["Energy Usage", "Waste Production", "Water Usage"],
    datasets: [
      {
        label: "Sustainability Benchmark",
        data: [65, 50, 75], // Initial data
        backgroundColor: ["#023D54", "#9A6735", "#94DEA5"],
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Industry Sustainability Benchmarks",
      },
    },
  },
});

// Function to update chart and submit benchmark data
function updateBenchmarkChart() {
  // Get values from form
  const energyUsage = document.getElementById("energyUsage").value;
  const wasteProduction = document.getElementById("wasteProduction").value;
  const waterUsage = document.getElementById("waterUsage").value;

  // Send data to the server using fetch
  fetch("/submit-benchmark", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      energyUsage: energyUsage,
      wasteProduction: wasteProduction,
      waterUsage: waterUsage,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message); // Show success or error message
    })
    .catch((error) => console.error("Error:", error));

  // Update chart data
  benchmarkChart.data.datasets[0].data = [
    energyUsage,
    wasteProduction,
    waterUsage,
  ];

  // Refresh chart to display new data
  benchmarkChart.update();
}

// Tracking Progress Chart
const trackingCtx = document.getElementById("trackingChart").getContext("2d");
const trackingChart = new Chart(trackingCtx, {
  type: "line",
  data: {
    labels: [], // Dates for tracking progress
    datasets: [
      {
        label: "Energy Consumption",
        data: [], // Data for energy consumption
        borderColor: "#023D54",
        fill: false,
      },
      {
        label: "Waste Production",
        data: [], // Data for waste production
        borderColor: "#9A6735",
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Tracking Progress",
      },
    },
  },
});

// Function to track progress and submit data to the server
function updateChart() {
  const energy = document.getElementById("energy").value;
  const waste = document.getElementById("waste").value;
  const today = new Date().toLocaleDateString();

  // Send data to the server using fetch
  fetch("/track-progress", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      energy: energy,
      waste: waste,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message); // Show success or error message
    })
    .catch((error) => console.error("Error:", error));

  // Update chart data
  trackingChart.data.labels.push(today); // Add today's date to the labels
  trackingChart.data.datasets[0].data.push(energy); // Add energy consumption data
  trackingChart.data.datasets[1].data.push(waste); // Add waste production data

  // Refresh chart to display new data
  trackingChart.update();
}

function setGoals() {
    const carbon = document.getElementById("carbon").value;
    const renewable = document.getElementById("renewable").value;

    // Send data to the server
    fetch('/set-goal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            carbon: carbon ? parseFloat(carbon) : null, // Convert to float or null
            renewable: renewable ? parseFloat(renewable) : null // Convert to float or null
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        console.log(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    
}

 

// Function to download a report
function downloadReport() {
  const userId = "yourUserId"; // You can dynamically get the userId if needed

  window.location.href = `/report/${userId}`;
}

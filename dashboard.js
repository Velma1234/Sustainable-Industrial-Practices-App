// Sustainability Benchmark Chart
const benchmarkCtx = document.getElementById("benchmarkChart").getContext("2d");
const benchmarkChart = new Chart(benchmarkCtx, {
  type: "bar",
  data: {
    labels: ["Energy Usage", "Waste Production", "Water Usage"],
    datasets: [
      {
        label: "Sustainability Benchmark",
        data: [65, 50, 75],
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
// Function to update chart based on user input
function updateBenchmarkChart() {
  // Get values from form
  const energyUsage = document.getElementById("energyUsage").value;
  const wasteProduction = document.getElementById("wasteProduction").value;
  const waterUsage = document.getElementById("waterUsage").value;
  
  // Update chart data
  benchmarkChart.data.datasets[0].data = [energyUsage, wasteProduction, waterUsage];
  
  // Refresh chart to display new data
  benchmarkChart.update();
}

// Tracking Progress Chart
const trackingCtx = document.getElementById("trackingChart").getContext("2d");
const trackingChart = new Chart(trackingCtx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Energy Consumption",
        data: [],
        borderColor: "#023D54",
        fill: false,
      },
      {
        label: "Waste Production",
        data: [],
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

function updateChart() {
  const energy = document.getElementById("energy").value;
  const waste = document.getElementById("waste").value;
  const today = new Date().toLocaleDateString();

  trackingChart.data.labels.push(today);
  trackingChart.data.datasets[0].data.push(energy);
  trackingChart.data.datasets[1].data.push(waste);
  trackingChart.update();
}

function setGoals() {
  const carbon = document.getElementById("carbon").value;
  const renewable = document.getElementById("renewable").value;
  alert(
    `Goals set!\nCarbon Footprint: ${carbon}%\nRenewable Energy: ${renewable}%`
  );
}


function downloadReport() {
    const userId =

    window.location.href = `/report/${userId}`;
}


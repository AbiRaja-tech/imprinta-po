"use client"

import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Mock data for monthly PO count
const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Purchase Orders",
      data: [12, 19, 15, 22, 24, 18, 15, 21, 25, 28, 30, 25],
      backgroundColor: "rgba(59, 130, 246, 0.5)",
      borderColor: "rgba(59, 130, 246, 1)",
      borderWidth: 1,
    },
  ],
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        color: "rgba(255, 255, 255, 0.7)",
      },
    },
    title: {
      display: false,
    },
    tooltip: {
      backgroundColor: "rgba(15, 18, 25, 0.9)",
      titleColor: "rgba(255, 255, 255, 0.9)",
      bodyColor: "rgba(255, 255, 255, 0.7)",
      borderColor: "rgba(31, 41, 55, 0.5)",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: {
        color: "rgba(31, 41, 55, 0.2)",
      },
      ticks: {
        color: "rgba(255, 255, 255, 0.7)",
      },
    },
    y: {
      grid: {
        color: "rgba(31, 41, 55, 0.2)",
      },
      ticks: {
        color: "rgba(255, 255, 255, 0.7)",
      },
    },
  },
}

export function MonthlyPOChart() {
  return <Bar data={data} options={options} />
}

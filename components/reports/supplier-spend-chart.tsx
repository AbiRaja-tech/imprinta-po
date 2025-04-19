"use client"

import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

// Mock data for supplier spend
const data = {
  labels: [
    "XYZ Paper Suppliers",
    "Ink Masters Co.",
    "Premium Packaging Ltd.",
    "Machine Parts Inc.",
    "Global Print Services",
  ],
  datasets: [
    {
      label: "Spend ($)",
      data: [12500, 7800, 9400, 15200, 8700],
      backgroundColor: [
        "rgba(59, 130, 246, 0.7)",
        "rgba(99, 102, 241, 0.7)",
        "rgba(139, 92, 246, 0.7)",
        "rgba(168, 85, 247, 0.7)",
        "rgba(217, 70, 239, 0.7)",
      ],
      borderColor: [
        "rgba(59, 130, 246, 1)",
        "rgba(99, 102, 241, 1)",
        "rgba(139, 92, 246, 1)",
        "rgba(168, 85, 247, 1)",
        "rgba(217, 70, 239, 1)",
      ],
      borderWidth: 1,
    },
  ],
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right" as const,
      labels: {
        color: "rgba(255, 255, 255, 0.7)",
        padding: 20,
        font: {
          size: 12,
        },
        boxWidth: 15,
      },
    },
    tooltip: {
      backgroundColor: "rgba(15, 18, 25, 0.9)",
      titleColor: "rgba(255, 255, 255, 0.9)",
      bodyColor: "rgba(255, 255, 255, 0.7)",
      borderColor: "rgba(31, 41, 55, 0.5)",
      borderWidth: 1,
      callbacks: {
        label: (context: any) => {
          const label = context.label || ""
          const value = context.raw || 0
          return `${label}: $${value.toLocaleString()}`
        },
      },
    },
  },
}

export function SupplierSpendChart() {
  return <Pie data={data} options={options} />
}

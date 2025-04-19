"use client"

import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

// Mock data for item type distribution
const data = {
  labels: ["Paper", "Ink", "Packaging", "Machinery", "Outsourced Print"],
  datasets: [
    {
      label: "Purchase Orders",
      data: [35, 25, 15, 10, 15],
      backgroundColor: [
        "rgba(59, 130, 246, 0.7)",
        "rgba(16, 185, 129, 0.7)",
        "rgba(245, 158, 11, 0.7)",
        "rgba(239, 68, 68, 0.7)",
        "rgba(139, 92, 246, 0.7)",
      ],
      borderColor: [
        "rgba(59, 130, 246, 1)",
        "rgba(16, 185, 129, 1)",
        "rgba(245, 158, 11, 1)",
        "rgba(239, 68, 68, 1)",
        "rgba(139, 92, 246, 1)",
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
      position: "bottom" as const,
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
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = Math.round((value / total) * 100)
          return `${label}: ${percentage}% (${value} POs)`
        },
      },
    },
  },
}

export function ItemTypeChart() {
  return <Doughnut data={data} options={options} />
}

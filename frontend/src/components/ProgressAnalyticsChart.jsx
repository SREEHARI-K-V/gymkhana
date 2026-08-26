import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const ProgressAnalyticsChart = ({ labels = [], weightData = [], bmiData = [] }) => {
  const data = {
    labels: labels.length ? labels : ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Body Weight (kg)',
        data: weightData.length ? weightData : [78.5, 77.8, 77.0, 76.2],
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#4F46E5',
        pointBorderColor: '#FFF',
        pointHoverRadius: 6,
        yAxisID: 'y',
      },
      {
        label: 'BMI (kg/m²)',
        data: bmiData.length ? bmiData : [24.8, 24.5, 24.3, 24.0],
        borderColor: '#06B6D4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        borderDash: [5, 5],
        tension: 0.4,
        fill: false,
        pointBackgroundColor: '#06B6D4',
        pointBorderColor: '#FFF',
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94A3B8',
          boxWidth: 12,
          padding: 10,
          font: { family: 'Plus Jakarta Sans', size: 11 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#FFF',
        bodyColor: '#CBD5E1',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94A3B8', font: { size: 10 }, maxRotation: 45 },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Weight (kg)', color: '#4F46E5', font: { size: 11 } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94A3B8', font: { size: 10 } },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'BMI', color: '#06B6D4', font: { size: 11 } },
        grid: { drawOnChartArea: false },
        ticks: { color: '#94A3B8', font: { size: 10 } },
      },
    },
  };

  return (
    <div style={{ height: 'clamp(240px, 45vw, 320px)', width: '100%', position: 'relative' }}>
      <Line data={data} options={options} />
    </div>
  );
};

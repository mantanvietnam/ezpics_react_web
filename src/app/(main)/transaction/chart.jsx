'use client'
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartPage = () => {
  const [data, setData] = useState({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Thống Kê',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255, 99, 132, 0.4)',
        hoverBorderColor: 'rgba(255, 99, 132, 1)',
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  });
  return (
    <div className="">
      {/* <h1 className="text-3xl font-bold mb-4">Biểu đồ thống kê</h1> */}
      <div className="w-full max-w-full bg-white p-8 rounded-lg shadow-md pl-3 space-y-4 bg-center">
        <Line data={data} />
      </div>
    </div>

  );
};

export default ChartPage;

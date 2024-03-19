import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function GraphComponent({ stockData }) {
  if (!stockData || !stockData.values_daily) {
    return <div>No data available</div>;
  }

  // maneja data
  const data = Object.entries(stockData.values_daily).map(([date, details]) => ({
    date,
    close: parseFloat(details["4. close"]),
  }));

  return (
    <div>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="close" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </div>
  );
}

export default GraphComponent;

import React, { useContext, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesGraphComponent = ({ productData }) => {

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  // Витягуємо дані для графіку (Monthly Order Statistics)
  const orderData = productData.monthlyOrderStatistics.map(item => ({
    name: `${item.year}-${item.month < 10 ? '0' + item.month : item.month}`,
    totalOrdered: item.totalOrdered
  }));

  return (
    <div>
      <div>
        <h2>{productData.product.productName}</h2> 
        <p><strong>Description:</strong> {productData.product.description} </p>
        <p><strong>Price:</strong> {productData.product.priceETH} ETH</p>
        <p><strong>Date Added:</strong> {formatDate(productData.product.dateAdded)}</p>
        <p><strong>Total sold:</strong> {productData.salesCount} </p>
        <p><strong>Added to wishlists:</strong> {productData.wishListAddCount} times</p>
        
      </div>

      {/* Графік з продажами по місяцях */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={orderData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalOrdered" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesGraphComponent;


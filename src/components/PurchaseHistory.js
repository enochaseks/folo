import React, { useState } from "react";

const PurchaseHistory = () => {
  const [purchases] = useState([]); // Start with an empty array

  return (
    <div className="purchase-history">
      <h3>Your Purchases</h3>
      <div className="purchase-list">
        {purchases.length === 0 ? (
          <p>No purchases made yet.</p>
        ) : (
          purchases.map((purchase) => (
            <div key={purchase.id} className="purchase-item">
              <h4>{purchase.service}</h4>
              <p>Date: {purchase.date}</p>
              <p>Status: {purchase.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;
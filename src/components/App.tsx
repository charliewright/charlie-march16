import React from "react";
import "./App.css";
import { OrderBookTables } from "./OrderBook";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1> BTC/USD Order Book </h1>
      <div>
        In securities trading an order book contains the list of buy orders and
        the list of sell orders.
      </div>
      <div>
        A matching engine uses the book to determine which orders can be fully
        or partially executed.
      </div>
      <OrderBookTables />
    </div>
  );
}

export default App;

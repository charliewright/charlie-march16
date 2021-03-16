import React from "react";
import "./App.css";
import { WebSocketDemo } from "./SocketDemo";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Order book app</h1>

      <h4> Order Book </h4>
      <div>
        In securities trading an order book contains the list of buy orders and
        the list of sell orders.
      </div>
      <div>
        A matching engine uses the book to determine which orders can be fully
        or partially executed.
      </div>
      <h4> Websocket demo</h4>
      <WebSocketDemo />
    </div>
  );
}

export default App;

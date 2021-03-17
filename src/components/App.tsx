import React from "react";
import { Box } from "rebass";
import "./App.css";
import { OrderBookTables } from "./OrderBook";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginTop: "40px" }}>
        <img
          style={{ marginBottom: "-6px" }}
          alt="usd-logo"
          src="https://www.cryptofacilities.com/trade/assets/images/crypto-icons/color/usd.svg"
        />
        <img
          style={{ marginBottom: "-6px" }}
          alt="bitcoin-logo"
          src="https://www.cryptofacilities.com/trade/assets/images/crypto-icons/color/xbt.svg"
        />{" "}
        Order Book{" "}
      </h1>

      <h3>What is an order book?</h3>
      <Box mb={3}>
        In securities trading an{" "}
        <b>
          <i>order book</i>
        </b>{" "}
        contains the list of buy orders and the list of sell orders.
      </Box>
      <Box>
        A{" "}
        <b>
          <i>matching engine</i>
        </b>{" "}
        uses the book to determine which orders can be fully or partially
        executed.
      </Box>
      <OrderBookTables />
    </div>
  );
}

export default App;

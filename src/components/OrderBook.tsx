import React, { useState } from "react";
import useInterval from "react-useinterval";
import { Flex, Box } from "rebass";
import {
  OrderFromWebSocket,
  ordersInMemory,
} from "../utils/in-memory-order-book";
import { formatNumber } from "../utils/order-book-utils";
import { OrderTable } from "./OrdersTable";

export interface OrderToDisplay {
  price: number;
  size: number;
  total: number; // t​he summed amount of the size at the current level and every level below it
}

const orderWithNonZeroSize = (bid: OrderFromWebSocket) => bid[1];
const sortedByPrice = (
  orderA: OrderFromWebSocket,
  orderB: OrderFromWebSocket
) => orderA[0] - orderB[0];

export const OrderBookTables = () => {
  const [bidsToRender, setBids] = useState<OrderToDisplay[]>([]);
  const [asksToRender, setAsks] = useState<OrderToDisplay[]>([]);

  useInterval(() => {
    const { bids, asks } = ordersInMemory;

    const nonZeroBids = bids.filter(orderWithNonZeroSize).sort(sortedByPrice);
    const nonZeroAsks = asks.filter(orderWithNonZeroSize).sort(sortedByPrice);

    // We're concerned with the highest bids and the lowest asks
    const bidsWithTotals = ordersWithSummedTotals(nonZeroBids.reverse());
    const asksWithTotals = ordersWithSummedTotals(nonZeroAsks);

    setAsks(asksWithTotals.slice(0, 3)); // only take the top 3
    setBids(bidsWithTotals.slice(0, 3)); // only take the top 3
  }, 500);

  const spreadPercentage =
    (100 * (asksToRender[0]?.price - bidsToRender[0]?.price)) /
    asksToRender[0]?.price;

  return (
    <Box>
      <h4>Spread: {formatNumber(spreadPercentage, 2)}% </h4>
      <Flex flexWrap="wrap">
        <Box padding={2} width={[1, 1, 1 / 3]}>
          <h4
            className="darkmode-ignore"
            style={{ backgroundColor: "lightgreen", width: "100%" }}
          >
            Bids (orders to buy buy bitcoin)
          </h4>
          <OrderTable ordersToRender={bidsToRender} />
        </Box>

        <Box padding={2} width={[1, 1, 1 / 3]}>
          <h4
            className="darkmode-ignore"
            style={{ backgroundColor: "lightcoral", width: "100%" }}
          >
            Asks (orders to sell bitcoin)
          </h4>
          <OrderTable ordersToRender={asksToRender} />
        </Box>
      </Flex>
    </Box>
  );
};

// const RefreshSelect = () => {
//   const rates = [{label: '1 second', value: 1000},{label: '5 seconds', value: 1000},{label: '1/10 second', value: 100}]

//   <select defaultValue="1 second">
//     {rates.map( ({value, label}) => (
//       <option key={label}>{label}</option>
//     ))}
//   </select>;
// };

const ordersWithSummedTotals = (bids: OrderFromWebSocket[]) => {
  let i = 0,
    total = 0;
  const bidsWithTotals = [];

  while (i < bids.length) {
    const bid = bids[i];
    total += bid[1];
    bidsWithTotals.push({ price: bid[0], size: bid[1], total });
    i++;
  }
  return bidsWithTotals;
};

// Styling to note:
// Monospace fonts are what people use for numbers (each char is the same width)

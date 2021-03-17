import React, { useState } from "react";
import useInterval from "react-useinterval";
import { Flex, Box } from "rebass";
import { aggregateOrdersInMemory } from "../utils/in-memory-order-book";
import { formatNumber } from "../utils/order-book-utils";
import { OrderTable } from "./OrdersTable";

export interface OrderToDisplay {
  price: number;
  size: number;
  total: number; // t​he summed amount of the size at the current level and every level below it
}

export const OrderBookTables = () => {
  const [bidsToRender, setBids] = useState<OrderToDisplay[]>([]);
  const [asksToRender, setAsks] = useState<OrderToDisplay[]>([]);

  useInterval(() => {
    const { bids, asks } = aggregateOrdersInMemory();
    setAsks(asks);
    setBids(bids);
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

// TODO: later, make a refresh rate selector
// const RefreshSelect = () => {
//   const rates = [{label: '1 second', value: 1000},{label: '5 seconds', value: 1000},{label: '1/10 second', value: 100}]

//   <select defaultValue="1 second">
//     {rates.map( ({value, label}) => (
//       <option key={label}>{label}</option>
//     ))}
//   </select>;
// };

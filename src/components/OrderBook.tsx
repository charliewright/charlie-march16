import React, { useState } from "react";
import { isEqual } from "lodash";
import useInterval from "react-useinterval";
import { Flex, Box } from "rebass";

const PRICE_SUBSCRIBE_EVENT = JSON.stringify({
  event: "subscribe",
  feed: "book_ui_1",
  product_ids: ["PI_XBTUSD"],
});

type OrderFromWebSocket = [number, number];

interface OrderToDisplay {
  price: number;
  size: number;
  total: number; // t​he summed amount of the size at the current level and every level below it
}

interface OrderBook {
  bids: OrderFromWebSocket[];
  asks: OrderFromWebSocket[];
}
interface Dictionary {
  [key: string]: number;
}

let ordersInMemory: OrderBook = { bids: [], asks: [] };
let prevOrdersInMemory: OrderBook = { bids: [], asks: [] };

const orderBookSocket = new WebSocket("wss://www.cryptofacilities.com/ws/v1​");

orderBookSocket.onopen = () => {
  // Send a message to let the api know I want to receive messages
  orderBookSocket.send(PRICE_SUBSCRIBE_EVENT);
};

const updateOrdersInMemory = (e: any) => {
  const newOrders = JSON.parse(e.data) as OrderBook;

  const mergedOrders = mergeOrderBooks(ordersInMemory, newOrders);
  prevOrdersInMemory = { ...ordersInMemory };
  ordersInMemory = { ...mergedOrders };

  if (!isEqual(ordersInMemory.asks, prevOrdersInMemory.asks)) {
    console.log(`this is good, the asks are not equal. Its going to refresh`);
    console.log(
      `in mem have ${ordersInMemory.asks.length} asks and ${ordersInMemory.bids.length} bids`
    );
  }
};

orderBookSocket.onmessage = updateOrdersInMemory;

export const OrderBookTables = () => {
  const [bidsToRender, setBids] = useState<OrderToDisplay[]>([]);
  const [asksToRender, setAsks] = useState<OrderToDisplay[]>([]);

  useInterval(() => {
    const { bids, asks } = ordersInMemory;

    // console.log(
    //   `how many are in memory? ${bids.length} bids and ${asks.length} asks`,
    //   bids,
    //   asks
    // );

    const orderWithNonZeroSize = (bid: OrderFromWebSocket) => bid[1];
    const sortedByPrice = (
      orderA: OrderFromWebSocket,
      orderB: OrderFromWebSocket
    ) => orderA[0] - orderB[0];

    debugger;
    const nonZeroBids = bids.filter(orderWithNonZeroSize).sort(sortedByPrice);
    const nonZeroAsks = asks.filter(orderWithNonZeroSize).sort(sortedByPrice);

    // We're concerned with the highest bids and the lowest asks
    const bidsWithTotals = ordersWithSummedTotals(nonZeroBids.reverse());
    const asksWithTotals = ordersWithSummedTotals(nonZeroAsks);

    setAsks(asksWithTotals.slice(0, 3)); // only take the top 3
    setBids(bidsWithTotals.slice(0, 3)); // only take the top 3
  }, 2000);

  const spreadPercentage =
    (100 * (asksToRender[0]?.price - bidsToRender[0]?.price)) /
    asksToRender[0]?.price;

  console.log("Render");
  return (
    <Box>
      <h4>Spread: {formatNumber(spreadPercentage)}% </h4>
      <Flex>
        <Box padding={4}>
          <h4 style={{ backgroundColor: "lightgreen" }}>
            Bids: people want to buy bitcoin at
          </h4>
          <OrderTable ordersToRender={bidsToRender} />
        </Box>

        <Box padding={4}>
          <h4 style={{ backgroundColor: "lightcoral" }}>
            Asks: people want to sell bitcoin at
          </h4>
          <OrderTable ordersToRender={asksToRender} />
        </Box>
      </Flex>
    </Box>
  );
};

const OrderTable = ({
  ordersToRender,
}: {
  ordersToRender: OrderToDisplay[];
}) => (
  <table style={{ minWidth: "400px" }}>
    <tbody>
      <tr>
        <th style={{ padding: "20px" }}>Price</th>
        <th style={{ padding: "20px" }}>Size</th>
        <th style={{ padding: "20px" }}>Total</th>
      </tr>
      {ordersToRender.map((order) => (
        <tr key={`row-${order.price}`}>
          <td style={{ padding: "20px" }}>{formatNumber(order.price)}</td>
          <td style={{ padding: "20px" }}>{formatNumber(order.size)}</td>
          <td style={{ padding: "20px" }}>{formatNumber(order.total)}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const mergeOrderBooks = (previousOrders: OrderBook, newOrders: OrderBook) => {
  const newBids = mergeOrders(newOrders?.bids, previousOrders.bids);
  const newAsks = mergeOrders(newOrders?.asks, previousOrders.asks);

  return { bids: newBids.slice(0, 100), asks: newAsks.slice(0, 100) };
};

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

const mergeOrders = (
  oldOrders: OrderFromWebSocket[],
  newOrders: OrderFromWebSocket[]
) => {
  if (!newOrders) {
    return oldOrders;
  }

  // merge the bids + asks using a hash map
  const orderMap = {} as Dictionary;

  oldOrders?.forEach((order) => (orderMap[order[0].toString()] = order[1]));
  // stomp on the hashmap with new orders.
  newOrders.forEach((order) => (orderMap[order[0].toString()] = order[1]));
  // Turn it back into the object we were expecting (tuples)
  const mergedOrders = Object.entries(orderMap).map((entry) => [
    parseFloat(entry[0]),
    entry[1],
  ]) as OrderFromWebSocket[];

  return mergedOrders.filter((order) => order[1]); // remove orders with no size
};

const formatNumber = (num: number) => {
  return num.toLocaleString("en-US", { minimumFractionDigits: 2 });
};

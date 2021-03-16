import React, { useEffect, useRef, useState } from "react";
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

export const OrderBookTables = () => {
  const [bidsToRender, setBids] = useState<OrderToDisplay[]>([]);
  const [asksToRender, setAsks] = useState<OrderToDisplay[]>([]);

  const orderBookSocket: React.MutableRefObject<null | WebSocket> = useRef(
    null
  );

  useInterval(() => {
    const { bids, asks } = ordersInMemory;

    // console.log(
    //   `how many are in memory? ${bids.length} bids and ${asks.length} asks`,
    //   bids,
    //   asks
    // );

    const orderWithNonZeroSize = (bid: OrderFromWebSocket) => bid[1];
    const sortedByPrice = (
      bida: OrderFromWebSocket,
      bidb: OrderFromWebSocket
    ) => bida[0] - bidb[0];

    const nonZeroBids = bids.filter(orderWithNonZeroSize).sort(sortedByPrice);
    const nonZeroAsks = asks.filter(orderWithNonZeroSize).sort(sortedByPrice);

    // We're concerned with the highest bids and the lowest asks
    const bidsWithTotals = ordersWithSummedTotals(nonZeroBids.reverse());
    const asksWithTotals = ordersWithSummedTotals(nonZeroAsks);

    setAsks(asksWithTotals.slice(0, 5)); // only take the top 3
    setBids(bidsWithTotals.slice(0, 5)); // only take the top 3
  }, 400);

  useEffect(() => {
    orderBookSocket.current = new WebSocket(
      "wss://www.cryptofacilities.com/ws/v1​"
    );

    orderBookSocket.current.onopen = () => {
      // Send a message to let the api know I want to receive messages
      orderBookSocket.current?.send(PRICE_SUBSCRIBE_EVENT);
    };

    orderBookSocket.current.onmessage = updateOrdersInMemory.bind(this);

    // todo tear down the socket, handle api errors gracefully
  }, []);

  console.log("are we rendering!?!?!?");
  return (
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

const updateOrdersInMemory = (e: any) => {
  const newOrders = JSON.parse(e.data) as OrderBook;

  const mergedOrders = mergeOrderBooks(ordersInMemory, newOrders);
  prevOrdersInMemory = { ...ordersInMemory };
  ordersInMemory = { ...mergedOrders };
  // console.log(
  //   "are these the same!?",
  //   isEqual(ordersInMemory, prevOrdersInMemory)
  // );
};

const mergeOrderBooks = (previousOrders: OrderBook, newOrders: OrderBook) => {
  const newBids = mergeOrders(newOrders?.bids, previousOrders.bids);
  const newAsks = mergeOrders(newOrders?.asks, previousOrders.asks);

  return { bids: newBids.slice(0, 30), asks: newAsks.slice(0, 30) };
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

  // merge the bids + asks - hash map is probably fastest
  const bidMap = {} as Dictionary;

  oldOrders?.forEach((bid) => (bidMap[bid[0].toString()] = bid[1]));
  // stomp on it with new bids kind of like an object merge using the spread operator {...}
  newOrders.forEach((bid) => (bidMap[bid[0].toString()] = bid[1]));
  // turn it back into the object we were expecting
  // I'm actually scared parsefloat will be the bottleneck here
  const mergedBids = Object.entries(bidMap).map((entry) => [
    parseFloat(entry[0]),
    entry[1],
  ]) as OrderFromWebSocket[];

  // console.log(
  //   `I am removing: ${
  //     mergedBids.length - mergedBids.filter((order) => order[1]).length
  //   } elements here!`
  // );
  return mergedBids.filter((order) => order[1]); // remove orders with no size
};

const formatNumber = (num: number) => {
  return num.toLocaleString("en-US", { minimumFractionDigits: 2 });
};

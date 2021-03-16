import React, { useEffect, useRef, useState } from "react";
import useInterval from "react-useinterval";

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

interface OrdersFromWebSocket {
  bids: OrderFromWebSocket[];
  asks: OrderFromWebSocket[];
}

export const WebSocketDemo = () => {
  const [ordersInState, setOrders] = useState<OrdersFromWebSocket>();
  const [count, setCount] = useState(0);
  const [bidsToRender, setBids] = useState<OrderToDisplay[]>([]);

  const orderBookSocket: React.MutableRefObject<null | WebSocket> = useRef(
    null
  );

  useInterval(() => {
    const { bids, asks } = ordersInState as OrdersFromWebSocket;

    const nonZeroBids = bids.filter((bid) => bid[1]);

    // They are sorted (increasing order)
    // I probably want to show them in reverse (top 3)

    let i = 0,
      total = 0;
    const bidsWithTotals = [];

    while (i < nonZeroBids.length) {
      const bid = nonZeroBids[i];
      total += bid[1];
      bidsWithTotals.push({ price: bid[0], size: bid[1], total });
      i++;
    }

    setBids(bidsWithTotals.reverse().slice(0, 3));
  }, 1000);

  useEffect(() => {
    orderBookSocket.current = new WebSocket(
      "wss://www.cryptofacilities.com/ws/v1​"
    );

    orderBookSocket.current.onopen = () => {
      // Send a message to let the api know I want to receive messages
      orderBookSocket.current?.send(PRICE_SUBSCRIBE_EVENT);
    };

    orderBookSocket.current.onmessage = updateBids.bind(this);

    // todo tear down the socket, handle api errors gracefully
  }, []);

  interface Dictionary {
    [key: string]: number;
  }
  const updateBids = (e: any) => {
    setOrders((previousOrders) => {
      const { bids, asks } = JSON.parse(e.data) as OrdersFromWebSocket;
      if (!bids) {
        console.log(
          "no new bids, returning the last one set which has: ",
          previousOrders?.bids?.length
        );
        return previousOrders;
      }

      // merge the bids + asks - hash map is probably fastest
      const bidMap = {} as Dictionary;

      previousOrders?.bids?.forEach(
        (bid) => (bidMap[bid[0].toString()] = bid[1])
      );
      // stomp on it with new bids kind of like an object merge using the spread operator {...}
      bids.forEach((bid) => (bidMap[bid[0].toString()] = bid[1]));
      // turn it back into the object we were expecting
      // I'm actually scared parsefloat will be the bottleneck here
      const mergedBids = Object.entries(bidMap).map((entry) => [
        parseFloat(entry[0]),
        entry[1],
      ]) as OrderFromWebSocket[];

      if (mergedBids.length == 4) {
        return previousOrders;
      }

      return { bids: mergedBids, asks };
    });

    setOrders(JSON.parse(e.data));
    setCount((prev) => prev + 1);
  };

  return (
    <div>
      <div>count: {count}</div>
      <h4>bids:</h4>
      <table>
        <tr>
          <th style={{ padding: "20px" }}>Price</th>
          <th style={{ padding: "20px" }}>Size</th>
          <th style={{ padding: "20px" }}>Total</th>
        </tr>
      </table>
      {bidsToRender.map((bid) => (
        <tr>
          <td style={{ padding: "20px" }}>{bid.price}</td>
          <td style={{ padding: "20px" }}>{bid.size}</td>
          <td style={{ padding: "20px" }}>{bid.total}</td>
        </tr>
      ))}
    </div>
  );
};

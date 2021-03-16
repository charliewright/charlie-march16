import React, { useEffect, useRef, useState } from "react";

const PRICE_SUBSCRIBE_EVENT = JSON.stringify({
  event: "subscribe",
  feed: "book_ui_1",
  product_ids: ["PI_XBTUSD"],
});

export const WebSocketDemo = () => {
  const [bidsToRender, setBids] = useState<any>([]);
  const [count, setCount] = useState(0);

  const orderBookSocket: React.MutableRefObject<null | WebSocket> = useRef(
    null
  );

  useEffect(() => {
    orderBookSocket.current = new WebSocket(
      "wss://www.cryptofacilities.com/ws/v1​"
    );

    orderBookSocket.current.onopen = () => {
      console.log("onopened!");
      orderBookSocket.current?.send(PRICE_SUBSCRIBE_EVENT);
    };

    orderBookSocket.current.onmessage = updateBids.bind(this);
  }, []);

  const updateBids = (e: any) => {
    debugger;
    const { bids, asks } = JSON.parse(e.data);
    console.log();
    setBids((prev: any) => {
      debugger;
      console.log(
        `we currently have ${prev.length} bids in state and have received ${bids?.length} from the backend`
      );
      return [...prev, bids];
    });
    setCount((prev) => prev + 1);
  };

  return (
    <div>
      <div>count: {count}</div>

      {bidsToRender?.map((bid: any) => (
        <div>{bid}</div>
      ))}
      {/* <div>message: {message}</div> */}
    </div>
  );
};

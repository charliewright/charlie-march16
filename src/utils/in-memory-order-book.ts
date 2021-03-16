import { isEqual } from "lodash";
import { mergeOrderBooks } from "./order-book-utils";

export type OrderFromWebSocket = [number, number];

export interface OrderBook {
  bids: OrderFromWebSocket[];
  asks: OrderFromWebSocket[];
}

const PRICE_SUBSCRIBE_EVENT = JSON.stringify({
  event: "subscribe",
  feed: "book_ui_1",
  product_ids: ["PI_XBTUSD"],
});

export let ordersInMemory: OrderBook = { bids: [], asks: [] };
export let prevOrdersInMemory: OrderBook = { bids: [], asks: [] };

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

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

const orderBookSocket = new WebSocket("wss://www.cryptofacilities.com/ws/v1​");

orderBookSocket.onopen = () => {
  // Send a message to let the api know I want to receive messages
  orderBookSocket.send(PRICE_SUBSCRIBE_EVENT);
};

const updateOrdersInMemory = (e: any) => {
  const newOrders = JSON.parse(e.data) as OrderBook;
  const mergedOrders = mergeOrderBooks(ordersInMemory, newOrders);
  ordersInMemory = { ...mergedOrders };
};

orderBookSocket.onmessage = updateOrdersInMemory;

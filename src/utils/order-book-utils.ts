import { OrderBook, OrderFromWebSocket } from "./in-memory-order-book";

interface Dictionary {
  [key: string]: number;
}

export const mergeOrderBooks = (
  previousOrders: OrderBook,
  newOrders: OrderBook
) => {
  const newBids = mergeOrders(previousOrders.bids, newOrders?.bids);
  const newAsks = mergeOrders(previousOrders.asks, newOrders?.asks);

  return { bids: newBids.slice(0, 100), asks: newAsks.slice(0, 100) };
};

export const mergeOrders = (
  oldOrders: OrderFromWebSocket[],
  newOrders: OrderFromWebSocket[]
) => {
  if (!newOrders) {
    return oldOrders;
  }

  // merge the bids + asks using a hash map
  // doing this with nested for-loops would be O(N^2)
  // using a hash-map (object) with O(1) access lets us merge the order delta in O(2N)
  const orderMap = {} as Dictionary;

  oldOrders?.forEach((order) => (orderMap[order[0].toString()] = order[1]));
  // stomp on the hashmap with new orders.
  newOrders.forEach((order) => (orderMap[order[0].toString()] = order[1]));
  // Turn it back into the object we were expecting (tuples)
  // Parsing the float is probably actually pretty intense computationally
  const mergedOrders = Object.entries(orderMap).map((entry) => [
    parseFloat(entry[0]),
    entry[1],
  ]) as OrderFromWebSocket[];

  return mergedOrders.filter((order) => order[1]); // remove orders with no size
};

export const formatNumber = (num: number) => {
  return num.toLocaleString("en-US", { minimumFractionDigits: 2 });
};

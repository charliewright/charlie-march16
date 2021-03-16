import { OrderFromWebSocket } from "./in-memory-order-book";
import { mergeOrders } from "./order-book-utils";
import { isEqual } from "lodash";

const oldBids: OrderFromWebSocket[] = [
  [200, 10],
  [210, 200],
  [220, 30],
];

test("A bid delta clears the order book", () => {
  const clearingBid: OrderFromWebSocket[] = [[220, 0]];
  const result = mergeOrders(oldBids, clearingBid);
  const bidsWithClearedOrder = [
    [200, 10],
    [210, 200],
  ];
  expect(isEqual(result, bidsWithClearedOrder)).toBeTruthy();
});

test("A bid delta adds to order book", () => {
  const newBid: OrderFromWebSocket[] = [[230, 300]];

  const result = mergeOrders(oldBids, newBid);
  const bidsWithNewOrder = [
    [200, 10],
    [210, 200],
    [220, 30],
    [230, 300],
  ];
  console.log(result);
  expect(isEqual(result, bidsWithNewOrder)).toBeTruthy();
});

test("A bid delta adds to order book", () => {
  const newBid: OrderFromWebSocket[] = [[230, 300]];

  const result = mergeOrders(oldBids, newBid);
  const bidsWithNewOrder = [
    [200, 10],
    [210, 200],
    [220, 30],
    [230, 300],
  ];
  console.log(result);
  expect(isEqual(result, bidsWithNewOrder)).toBeTruthy();
});

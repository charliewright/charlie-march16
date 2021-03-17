import React from "react";
import { OrderToDisplay } from "./OrderBook";
import { formatNumber } from "../utils/order-book-utils";

export const OrderTable = ({
  ordersToRender,
}: {
  ordersToRender: OrderToDisplay[];
}) => (
  <table style={{ minWidth: "330px" }}>
    <tbody>
      <tr>
        <th style={{ padding: "5px", width: "130px", textAlign: "end" }}>
          Price
        </th>
        <th style={{ padding: "5px", width: "100px", textAlign: "end" }}>
          Size
        </th>
        <th style={{ padding: "5px", width: "100px", textAlign: "end" }}>
          Total
        </th>
      </tr>
      {ordersToRender.map((order) => (
        <tr key={`row-${order.price}`}>
          <td style={{ padding: "5px", width: "130px", textAlign: "end" }}>
            {formatNumber(order.price, 2)}
          </td>
          <td style={{ padding: "5px", width: "100px", textAlign: "end" }}>
            {formatNumber(order.size, 0)}
          </td>
          <td style={{ padding: "5px", width: "100px", textAlign: "end" }}>
            {formatNumber(order.total, 0)}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

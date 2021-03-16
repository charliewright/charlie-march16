import React from "react";
import { OrderToDisplay } from "./OrderBook";
import { formatNumber } from "../utils/order-book-utils";

export const OrderTable = ({
  ordersToRender,
}: {
  ordersToRender: OrderToDisplay[];
}) => (
  <table style={{ minWidth: "400px" }}>
    <tbody>
      <tr>
        <th style={{ padding: "5px", width: "120px", textAlign: "end" }}>
          Price
        </th>
        <th style={{ padding: "5px", width: "120px", textAlign: "end" }}>
          Size
        </th>
        <th style={{ padding: "5px", width: "120px", textAlign: "end" }}>
          Total
        </th>
      </tr>
      {ordersToRender.map((order) => (
        <tr key={`row-${order.price}`}>
          <td style={{ padding: "5px", width: "120px", textAlign: "end" }}>
            {formatNumber(order.price)}
          </td>
          <td style={{ padding: "5px", width: "120px", textAlign: "end" }}>
            {formatNumber(order.size)}
          </td>
          <td style={{ padding: "5px", width: "120px", textAlign: "end" }}>
            {formatNumber(order.total)}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from "recharts";
import "./bigChartBox.scss";
import { productApiRequests, ordersApiRequests } from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";

interface MonthlyData {
  name: string;
  products: number;
  revenue: number;
}

const BigChartBox = () => {
  const [chartData, setChartData] = useState<MonthlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Function to get month name based on index
  const getMonthName = (monthIndex: number) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[monthIndex];
  };

  useEffect(() => {
    const fetchData = async () => {
      // Guard clause: Don't fetch if no storeId
      if (!user?.storeId) {
        setIsLoading(false);
        setError("Store not configured");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const productsResponse = await productApiRequests.getProducts();
        const ordersResponse = await ordersApiRequests.getOrders();

        const products = productsResponse.data as any[];
        const orders = ordersResponse.data as any[];

        if (!products || !orders) {
          setChartData([]);
          setIsLoading(false);
          return;
        }

        // Aggregate data on a monthly basis
        const data = Array.from({ length: 12 }, (_, i) => {
          const monthData: MonthlyData = {
            name: getMonthName(i),
            products: 0,
            revenue: 0,
          };

          // Filter products for the current month and store
          if (Array.isArray(products)) {
            products.forEach((product: any) => {
              if (
                product.storeId === user.storeId &&
                new Date(
                  product.lastUpdated || product.createdAt
                ).getMonth() === i
              ) {
                monthData.products++;
              }
            });
          }

          // Process orders
          if (Array.isArray(orders)) {
            orders.forEach((order: any) => {
              if (new Date(order.orderDate).getMonth() === i) {
                // Filter orders to include only those containing products from the user's store
                const storeProducts =
                  order.products?.filter(
                    (orderProduct: any) => orderProduct.storeId === user.storeId
                  ) || [];

                // Count products and sum revenue
                storeProducts.forEach((orderProduct: any) => {
                  monthData.products += orderProduct.quantity || 1;
                  monthData.revenue +=
                    (orderProduct.quantity || 1) *
                    (orderProduct.product?.discountPrice ||
                      orderProduct.product?.price ||
                      0);
                });
              }
            });
          }

          return monthData;
        });

        setChartData(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load analytics data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.storeId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="bigChartBox">
        <h1>Revenue Analytics</h1>
        <div
          className="chart"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={32} />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bigChartBox">
        <h1>Revenue Analytics</h1>
        <div
          className="chart"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#888",
          }}
        >
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bigChartBox">
      <h1>Revenue Analytics</h1>
      <div className="chart">
        <ResponsiveContainer width="99%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value: number, name: string) => [
                name === "revenue" ? `$${value.toFixed(2)}` : value,
                name === "revenue" ? "Revenue" : "Products",
              ]}
            />
            <Area
              type="monotone"
              dataKey="products"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stackId="2"
              stroke="#ffc658"
              fill="#ffc658"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BigChartBox;

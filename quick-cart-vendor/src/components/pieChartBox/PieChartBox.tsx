/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import "./pieChartBox.scss";
import { ordersApiRequests } from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

// Predefined color palette for consistent category colors
const CATEGORY_COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#0088FE",
  "#a4de6c",
  "#d0ed57",
];

const PieChartBox = () => {
  const [pieChartData, setPieChartData] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

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
        const ordersResponse = await ordersApiRequests.getOrders();
        const orders = ordersResponse.data as any[];

        if (!orders || !Array.isArray(orders)) {
          setPieChartData([]);
          setIsLoading(false);
          return;
        }

        // Calculate revenue for each category related to the user's products
        const categoryDataMap = new Map<string, number>();

        orders.forEach((order: any) => {
          order.products?.forEach((orderProduct: any) => {
            // Filter products based on the user's store
            if (orderProduct.storeId === user.storeId) {
              const categoryName = orderProduct.categoryName || "Uncategorized";
              const productPrice = Number(
                orderProduct.product?.discountPrice ||
                  orderProduct.product?.price ||
                  0
              );
              const quantity = orderProduct.quantity || 1;

              const revenue = productPrice * quantity;

              if (categoryDataMap.has(categoryName)) {
                categoryDataMap.set(
                  categoryName,
                  (categoryDataMap.get(categoryName) || 0) + revenue
                );
              } else {
                categoryDataMap.set(categoryName, revenue);
              }
            }
          });
        });

        // Convert map to array for PieChart data format
        const chartData = Array.from(categoryDataMap.entries()).map(
          ([name, value], index) => ({
            name,
            value,
            color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
          })
        );

        setPieChartData(chartData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load category data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.storeId]);

  // Function to format value as currency
  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="pieChartBox">
        <h1>Revenue by Product Category</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
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
      <div className="pieChartBox">
        <h1>Revenue by Product Category</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
            color: "#888",
          }}
        >
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (pieChartData.length === 0) {
    return (
      <div className="pieChartBox">
        <h1>Revenue by Product Category</h1>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
            color: "#888",
          }}
        >
          <p>No category data yet</p>
          <p style={{ fontSize: "12px" }}>
            Revenue by category will appear when orders are placed
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pieChartBox">
      <h1>Revenue by Product Category</h1>
      <div className="chart">
        <ResponsiveContainer width="99%" height={300}>
          <PieChart>
            <Tooltip
              contentStyle={{ background: "white", borderRadius: "5px" }}
              formatter={(value: any) => formatCurrency(value)}
            />
            <Pie
              data={pieChartData}
              innerRadius={"70%"}
              outerRadius={"90%"}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {pieChartData.map((item, index) => (
                <Cell key={`cell-${index}`} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="options">
        {pieChartData.map((item, index) => (
          <div className="option" key={`option-${index}`}>
            <div className="title">
              <div className="dot" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
            </div>
            <span>{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChartBox;

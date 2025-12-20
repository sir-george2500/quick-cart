/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import BarChartBox from "../BarChartBox";
import { ordersApiRequests } from "../../../api/api";
import { useAuth } from "../../../contexts/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";

type ChartDataItem = {
  name: string;
  profit: number;
};

type BarChartBoxRevenue = {
  title: string;
  color: string;
  dataKey: string;
  chartData: ChartDataItem[];
};

const ProfitStats = () => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
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
        const response = await ordersApiRequests.getOrders();
        const orders = response.data as any[];

        if (!orders || !Array.isArray(orders)) {
          setChartData([]);
          setIsLoading(false);
          return;
        }

        // Calculate profit for each day
        const dailyProfitMap: Map<string, number> = new Map();

        orders.forEach((order: any) => {
          // Filter products that belong to the user
          const userProducts =
            order.products?.filter(
              (product: any) =>
                product.product?.storeId === user.storeId ||
                product.storeId === user.storeId
            ) || [];

          userProducts.forEach((product: any) => {
            const productCost = Number(
              product.product?.discountPrice || product.product?.price || 0
            );
            const quantity = product.quantity || 1;
            const adminCut = productCost * 0.05 * quantity; // 5% cut for the organization per product quantity
            const userProfit = productCost * quantity - adminCut; // User's profit considering quantity
            const orderDate = new Date(order.orderDate).toLocaleDateString();

            if (dailyProfitMap.has(orderDate)) {
              dailyProfitMap.set(
                orderDate,
                (dailyProfitMap.get(orderDate) || 0) + userProfit
              );
            } else {
              dailyProfitMap.set(orderDate, userProfit);
            }
          });
        });

        // Convert map to array for chart data format
        const data: ChartDataItem[] = Array.from(dailyProfitMap.entries()).map(
          ([name, profit]) => ({
            name,
            profit: Number(profit.toFixed(2)),
          })
        );

        // Sort by date
        data.sort(
          (a, b) => new Date(a.name).getTime() - new Date(b.name).getTime()
        );

        // Take last 7 days
        const recentData = data.slice(-7);

        setChartData(recentData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load profit data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.storeId]);

  // Loading state
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          padding: "20px",
        }}
      >
        <CircularProgress size={24} />
      </div>
    );
  }

  // Error or no data state
  if (error || chartData.length === 0) {
    const emptyData: ChartDataItem[] = [];
    const barChartBoxEmpty: BarChartBoxRevenue = {
      title: "Profit Earned",
      color: "#8884d8",
      dataKey: "profit",
      chartData: emptyData,
    };

    return (
      <BarChartBox
        title={barChartBoxEmpty.title}
        color={barChartBoxEmpty.color}
        dataKey={barChartBoxEmpty.dataKey}
        chartData={barChartBoxEmpty.chartData}
      />
    );
  }

  const barChartBoxRevenue: BarChartBoxRevenue = {
    title: "Profit Earned",
    color: "#8884d8",
    dataKey: "profit",
    chartData: chartData,
  };

  return (
    <BarChartBox
      title={barChartBoxRevenue.title}
      color={barChartBoxRevenue.color}
      dataKey={barChartBoxRevenue.dataKey}
      chartData={barChartBoxRevenue.chartData}
    />
  );
};

export default ProfitStats;

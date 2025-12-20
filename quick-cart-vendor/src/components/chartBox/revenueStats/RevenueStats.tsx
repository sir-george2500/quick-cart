/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ordersApiRequests } from "../../../api/api";
import ChartBox from "../ChartBox";
import { useAuth } from "../../../contexts/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";

interface ChartDataPoint {
  name: number;
  revenue: number;
}

const RevenueStats = () => {
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [percentageChange, setPercentageChange] = useState<number>(0);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
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
          setTotalRevenue(0);
          setChartData([]);
          setIsLoading(false);
          return;
        }

        // Filter orders to include only those with the user's storeId
        const filteredOrders = orders.filter((order: any) =>
          order.products?.some(
            (product: any) => product.storeId === user.storeId
          )
        );

        // Calculate total revenue from filtered orders
        const revenue = filteredOrders.reduce((acc: number, order: any) => {
          const orderRevenue =
            order.products
              ?.filter((product: any) => product.storeId === user.storeId)
              .reduce((orderAcc: number, product: any) => {
                return (
                  orderAcc +
                  (product.product?.price || 0) * (product.quantity || 1)
                );
              }, 0) || 0;
          return acc + orderRevenue;
        }, 0);

        setTotalRevenue(revenue);

        // Calculate percentage change
        const currentMonth = new Date().getMonth();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

        const currentMonthRevenue = filteredOrders.reduce(
          (acc: number, order: any) => {
            if (new Date(order.orderDate).getMonth() === currentMonth) {
              const orderRevenue =
                order.products
                  ?.filter((product: any) => product.storeId === user.storeId)
                  .reduce((orderAcc: number, product: any) => {
                    return (
                      orderAcc +
                      (product.product?.price || 0) * (product.quantity || 1)
                    );
                  }, 0) || 0;
              return acc + orderRevenue;
            }
            return acc;
          },
          0
        );

        const lastMonthRevenue = filteredOrders.reduce(
          (acc: number, order: any) => {
            if (new Date(order.orderDate).getMonth() === lastMonth) {
              const orderRevenue =
                order.products
                  ?.filter((product: any) => product.storeId === user.storeId)
                  .reduce((orderAcc: number, product: any) => {
                    return (
                      orderAcc +
                      (product.product?.price || 0) * (product.quantity || 1)
                    );
                  }, 0) || 0;
              return acc + orderRevenue;
            }
            return acc;
          },
          0
        );

        const revenueChange = lastMonthRevenue
          ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
          : currentMonthRevenue > 0
            ? 100
            : 0;

        setPercentageChange(Number(revenueChange.toFixed(2)));

        // Prepare chart data - Monthly revenue
        const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
          const monthRevenue = filteredOrders.reduce(
            (acc: number, order: any) => {
              if (new Date(order.orderDate).getMonth() === i) {
                const orderRevenue =
                  order.products
                    ?.filter((product: any) => product.storeId === user.storeId)
                    .reduce((orderAcc: number, product: any) => {
                      return (
                        orderAcc +
                        (product.product?.price || 0) * (product.quantity || 1)
                      );
                    }, 0) || 0;
                return acc + orderRevenue;
              }
              return acc;
            },
            0
          );
          return { name: i + 1, revenue: monthRevenue };
        });

        setChartData(monthlyRevenue);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load revenue data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
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

  // Error state - show chart with zero data
  if (error) {
    return (
      <ChartBox
        color="#ffc658"
        icon="/revenueIcon.svg"
        title="Total Revenue"
        number="$0.00"
        percentage={0}
        chartData={[]}
        dataKey="revenue"
      />
    );
  }

  const chartBoxRevenue = {
    color: "#ffc658",
    icon: "/revenueIcon.svg",
    title: "Total Revenue",
    number: `$${totalRevenue.toFixed(2)}`,
    percentage: percentageChange,
    chartData: chartData,
    dataKey: "revenue",
  };

  return <ChartBox {...chartBoxRevenue} />;
};

export default RevenueStats;

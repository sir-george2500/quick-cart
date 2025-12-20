/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ordersApiRequests } from "../../../api/api";
import ChartBox from "../ChartBox";
import { useAuth } from "../../../contexts/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";

interface ChartDataPoint {
  name: number;
  products: number;
}

const ProductSalesStats = () => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [totalProductsSold, setTotalProductsSold] = useState<number>(0);
  const [percentageChange, setPercentageChange] = useState<number>(0);
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
          setTotalProductsSold(0);
          setChartData([]);
          setIsLoading(false);
          return;
        }

        // Filter orders to include only products from the user's store
        const filteredOrders = orders.filter((order: any) =>
          order.products?.some(
            (product: any) => product.storeId === user.storeId
          )
        );

        // Calculate total products sold by the user
        const totalProducts = filteredOrders.reduce(
          (acc: number, order: any) => {
            return (
              acc +
              (order.products?.reduce((accProduct: number, product: any) => {
                if (product.storeId === user.storeId) {
                  return accProduct + (product.quantity || 1);
                }
                return accProduct;
              }, 0) || 0)
            );
          },
          0
        );
        setTotalProductsSold(totalProducts);

        // Calculate percentage change
        const currentMonth = new Date().getMonth();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

        const currentMonthProducts = filteredOrders.reduce(
          (acc: number, order: any) => {
            if (new Date(order.orderDate).getMonth() === currentMonth) {
              return (
                acc +
                (order.products?.reduce((accProduct: number, product: any) => {
                  if (product.storeId === user.storeId) {
                    return accProduct + (product.quantity || 1);
                  }
                  return accProduct;
                }, 0) || 0)
              );
            }
            return acc;
          },
          0
        );

        const lastMonthProducts = filteredOrders.reduce(
          (acc: number, order: any) => {
            if (new Date(order.orderDate).getMonth() === lastMonth) {
              return (
                acc +
                (order.products?.reduce((accProduct: number, product: any) => {
                  if (product.storeId === user.storeId) {
                    return accProduct + (product.quantity || 1);
                  }
                  return accProduct;
                }, 0) || 0)
              );
            }
            return acc;
          },
          0
        );

        const change = lastMonthProducts
          ? ((currentMonthProducts - lastMonthProducts) / lastMonthProducts) *
            100
          : currentMonthProducts > 0
            ? 100
            : 0;
        setPercentageChange(Number(change.toFixed(2)));

        // Prepare chart data - Monthly product sales count
        const monthlyProductSales = Array.from({ length: 12 }, (_, i) => {
          const monthProducts = filteredOrders.reduce(
            (acc: number, order: any) => {
              if (new Date(order.orderDate).getMonth() === i) {
                return (
                  acc +
                  (order.products?.reduce(
                    (accProduct: number, product: any) => {
                      if (product.storeId === user.storeId) {
                        return accProduct + (product.quantity || 1);
                      }
                      return accProduct;
                    },
                    0
                  ) || 0)
                );
              }
              return acc;
            },
            0
          );
          return { name: i + 1, products: monthProducts };
        });

        setChartData(monthlyProductSales);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load sales data");
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

  // Error state
  if (error) {
    return (
      <ChartBox
        color="#8884d8"
        icon="/product.svg"
        title="Total Products Sold"
        number={0}
        percentage={0}
        chartData={[]}
        dataKey="products"
      />
    );
  }

  const chartBoxProductSales = {
    color: "#8884d8",
    icon: "/product.svg",
    title: "Total Products Sold",
    number: totalProductsSold,
    percentage: percentageChange,
    chartData: chartData,
    dataKey: "products",
  };

  return <ChartBox {...chartBoxProductSales} />;
};

export default ProductSalesStats;

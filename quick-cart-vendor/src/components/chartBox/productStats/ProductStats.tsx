/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { productApiRequests } from "../../../api/api";
import ChartBox from "../ChartBox";
import { useAuth } from "../../../contexts/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";

interface ChartDataPoint {
  name: number;
  products: number;
}

const ProductStats = () => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [percentageChange, setPercentageChange] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      // Guard clause: Don't fetch if no storeId
      if (!user?.storeId) {
        setIsLoading(false);
        setError("Store not configured");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await productApiRequests.getProducts();
        const products = response.data as any[];

        if (!products || !Array.isArray(products)) {
          setTotalProducts(0);
          setChartData([]);
          setIsLoading(false);
          return;
        }

        // Filter products to include only those with the user's storeId
        const filteredProducts = products.filter(
          (product: any) => product.storeId === user.storeId
        );

        // Calculate total products
        const totalProductsCount = filteredProducts.length;
        setTotalProducts(totalProductsCount);

        // Calculate percentage change
        const currentMonth = new Date().getMonth();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

        const currentMonthProducts = filteredProducts.filter(
          (product: any) =>
            new Date(product.createdAt).getMonth() === currentMonth
        ).length;
        const lastMonthProducts = filteredProducts.filter(
          (product: any) => new Date(product.createdAt).getMonth() === lastMonth
        ).length;

        let change = 0;
        if (lastMonthProducts !== 0) {
          change =
            ((currentMonthProducts - lastMonthProducts) / lastMonthProducts) *
            100;
        } else if (currentMonthProducts !== 0) {
          change = 100;
        }
        setPercentageChange(Number(change.toFixed(2)));

        // Prepare chart data - Monthly product count
        const monthlyProductCount = Array.from({ length: 12 }, (_, i) => {
          const monthProducts = filteredProducts.filter(
            (product: any) => new Date(product.createdAt).getMonth() === i
          ).length;
          return { name: i + 1, products: monthProducts };
        });

        setChartData(monthlyProductCount);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
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
        color="#82ca9d"
        icon="/calendar.svg"
        title="Total Products"
        number={0}
        percentage={0}
        chartData={[]}
        dataKey="products"
      />
    );
  }

  const chartBoxProduct = {
    color: "#82ca9d",
    icon: "/calendar.svg",
    title: "Total Products",
    number: totalProducts,
    percentage: percentageChange,
    chartData: chartData,
    dataKey: "products",
  };

  return <ChartBox {...chartBoxProduct} />;
};

export default ProductStats;

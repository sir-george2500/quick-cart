/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import "./topBox.scss";
import { ordersApiRequests, userApiRequest } from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";

interface RecentCustomer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  totalAmount: number;
}

const TopBox = () => {
  const [recentUsersWithOrders, setRecentUsersWithOrders] = useState<
    RecentCustomer[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecentUsersWithOrders = async () => {
      // Guard clause: Don't fetch if no storeId
      if (!user?.storeId) {
        setIsLoading(false);
        setError("Store not configured");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch recent orders
        const ordersResponse = await ordersApiRequests.getOrders();
        const orders = ordersResponse.data as any[];

        if (!orders || !Array.isArray(orders)) {
          setRecentUsersWithOrders([]);
          setIsLoading(false);
          return;
        }

        // Filter orders to include only those with products from the user's store
        const filteredOrders = orders.filter((order: any) =>
          order.products?.some(
            (product: any) => product.storeId === user.storeId
          )
        );

        // Extract unique user IDs from filtered orders
        const userIds = Array.from(
          new Set(filteredOrders.map((order: any) => order.userId))
        );

        // Initialize array to hold users
        const users: RecentCustomer[] = [];

        // Fetch each user and calculate total amount from their filtered orders
        for (const userId of userIds as string[]) {
          try {
            const userResponse = await userApiRequest.getUserById(userId);
            const fetchedUser = userResponse.data?.data;

            if (!fetchedUser) continue;

            // Filter orders for the current user and seller's store
            const userOrders = filteredOrders.filter(
              (order: any) => order.userId === userId
            );

            // Calculate the total amount spent in the seller's store
            const totalAmount = userOrders.reduce((acc: number, order: any) => {
              const storeTotal =
                order.products
                  ?.filter((product: any) => product.storeId === user.storeId)
                  .reduce(
                    (sum: number, product: any) =>
                      sum +
                      (product.product?.price || 0) * (product.quantity || 1),
                    0
                  ) || 0;
              return acc + storeTotal;
            }, 0);

            users.push({
              id: fetchedUser.id,
              name: fetchedUser.name || "Unknown",
              email: fetchedUser.email || "",
              avatar: fetchedUser.avatar ?? undefined,
              totalAmount,
            });
          } catch (userError) {
            console.error(`Error fetching user ${userId}:`, userError);
          }
        }

        // Sort users by their order timestamp (assuming order array is sorted by date)
        const sortedUsers = users.sort((a, b) => {
          const orderDateA = filteredOrders.find(
            (order: any) => order.userId === a.id
          )?.createdAt;
          const orderDateB = filteredOrders.find(
            (order: any) => order.userId === b.id
          )?.createdAt;
          return (
            new Date(orderDateB || 0).getTime() -
            new Date(orderDateA || 0).getTime()
          );
        });

        // Get the 7 most recent users
        const recentUsers = sortedUsers.slice(0, 7);

        setRecentUsersWithOrders(recentUsers);
      } catch (err) {
        console.error("Error fetching recent users with orders:", err);
        setError("Failed to load recent customers");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentUsersWithOrders();
  }, [user?.storeId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="topBox">
        <h1>Recent Customers</h1>
        <div
          className="loading-container"
          style={{ display: "flex", justifyContent: "center", padding: "40px" }}
        >
          <CircularProgress size={32} />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="topBox">
        <h1>Recent Customers</h1>
        <div
          className="empty-state"
          style={{ padding: "20px", textAlign: "center", color: "#888" }}
        >
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (recentUsersWithOrders.length === 0) {
    return (
      <div className="topBox">
        <h1>Recent Customers</h1>
        <div
          className="empty-state"
          style={{ padding: "20px", textAlign: "center", color: "#888" }}
        >
          <p>No customers yet</p>
          <p style={{ fontSize: "12px" }}>
            Customers will appear here when they place orders
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="topBox">
      <h1>Recent Customers</h1>
      <div className="list">
        {recentUsersWithOrders.map((customer, index) => (
          <div className="listItem" key={customer.id || index}>
            <div className="user">
              <img
                src={customer.avatar ?? "/noavatar.png"}
                alt={customer.name}
              />
              <div className="userTexts">
                <span className="username">{customer.name}</span>
                <span className="email">{customer.email}</span>
              </div>
            </div>
            <span className="amount">${customer.totalAmount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBox;

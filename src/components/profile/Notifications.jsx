import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import {
  getNotifications,
  
} from "../../services/userServices";
import NavBar from "../common/NavBar";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error("Error loading notifications:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
    try {
      await markNotificationRead(id);
    } catch (err) {
      console.error("Error marking notification read:", err);
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read: false } : item))
      );
    }
  };

  const handleMarkAllRead = async () => {
    const previous = notifications;
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    try {
      await markAllNotificationsRead();
    } catch (err) {
      console.error("Error marking all notifications read:", err);
      setNotifications(previous);
    }
  };

  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
              <p className="mt-2 text-gray-600">
                {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up."}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="rounded-full bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-700"
              >
                Mark all as read
              </button>
            )}
          </div>

          {error && (
            <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-4">
            {isLoading ? (
              <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow">
                Loading notifications...
              </div>
            ) : notifications.length === 0 && !error ? (
              <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow">
                No notifications yet.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-4 rounded-lg p-5 shadow transition ${
                    item.read
                      ? "bg-gray-50 text-gray-600 border border-gray-200"
                      : "bg-white text-gray-800 border-l-4 border-l-cyan-600 border-y border-r border-gray-200"
                  }`}
                >
                  <div
                    className={`mt-0.5 rounded-full p-2.5 ${
                      item.read ? "bg-gray-200 text-gray-500" : "bg-cyan-100 text-cyan-600"
                    }`}
                  >
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${item.read ? "font-normal" : "font-semibold text-gray-900"}`}>
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{item.message}</p>
                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {!item.read && (
                    <button
                      type="button"
                      onClick={() => handleMarkRead(item.id)}
                      className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-cyan-600"
                      title="Mark as read"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Notifications;
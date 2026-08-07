import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
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
    <NavBar/>
    <div className="min-h-screen px-4 py-12 text-slate-50 bg-slate-900 profile-shell">
      <div className="mx-auto max-w-3xl ">
        <div className="profile-card p-6 sm:p-8">
          <div className="flex flex-col gap-4 border-b border-slate-800/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Notifications</h1>
              <p className="mt-1 text-sm text-slate-400">
                {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up."}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
              >
                Mark all as read
              </button>
            )}
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-600/40 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-3">
            {isLoading ? (
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-8 text-center text-slate-400">
                Loading notifications...
              </div>
            ) : notifications.length === 0 && !error ? (
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-8 text-center text-slate-400">
                No notifications yet.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 rounded-2xl border p-4 transition ${
                    item.read
                      ? "border-slate-800/80 bg-slate-900/70"
                      : "border-cyan-500/40 bg-slate-900/80"
                  }`}
                >
                  <div className={`mt-0.5 rounded-full p-2 ${item.read ? "bg-slate-800" : "bg-cyan-500/15"}`}>
                    <Bell className={`h-4 w-4 ${item.read ? "text-slate-500" : "text-cyan-400"}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-100">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{item.message}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {!item.read && (
                    <button
                      type="button"
                      onClick={() => handleMarkRead(item.id)}
                      className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-cyan-400"
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Notifications;

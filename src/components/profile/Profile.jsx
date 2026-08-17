import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  Mail,
  Bell,
  Check,
  User as UserIcon,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  LayoutDashboard,
  Sliders,
  Sparkles,
  ExternalLink,
  X,
  Tag,
  Plus
} from "lucide-react";
import {
  getProfile,
  updateProfile,
  getPreferences,
  updatePreferences,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../services/userServices";
import { CATEGORY_OPTIONS } from "../common/categories";
import NavBar from "../common/NavBar";
import ProtectedInstance from "../../instances/ProtectedInstance";

const TABS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "profile", label: "Profile", icon: UserIcon },
  { key: "preferences", label: "Preferences", icon: Sliders },
  { key: "notifications", label: "Notifications", icon: Bell },
];

const EMPTY_PROFILE = { name: "", email: "", role: "user" };

const EMPTY_PREFERENCES = {
  darkMode: true,
  preferredCategories: [],
  notificationChannel: "email",
  notificationFrequency: "immediate",
};

const NOTIFICATION_CHANNELS = [
  { key: "email", label: "Email", icon: Mail },
  { key: "push", label: "Push Notifications", icon: Bell },
];

const NOTIFICATION_FREQUENCIES = [
  { key: "immediate", label: "Immediate" },
  { key: "hourly", label: "Hourly" },
  { key: "daily", label: "Daily" },
];

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  // ---- Dashboard state ----
  const [subscribedCategories, setSubscribedCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  // ---- Profile info state ----
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");

  // ---- Password state ----
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ---- Preferences state ----
  const [preferences, setPreferences] = useState(EMPTY_PREFERENCES);
  const [isPrefsLoading, setIsPrefsLoading] = useState(true);
  const [isPrefsSaving, setIsPrefsSaving] = useState(false);
  const [prefsError, setPrefsError] = useState("");

  // ---- Notifications state ----
  const [notifications, setNotifications] = useState([]);
  const [isNotifsLoading, setIsNotifsLoading] = useState(true);
  const [notifsError, setNotifsError] = useState("");

  const loadDashboardArticles = async (categories) => {
    setIsDashboardLoading(true);
    setDashboardError("");
    try {
      if (!categories.length) {
        setArticles([]);
        return;
      }

      const results = await Promise.all(
        categories.map((catKey) =>
          ProtectedInstance.get(`/news/category/${catKey}`)
            .then((res) => {
              const list = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data?.data)
                ? res.data.data
                : Array.isArray(res.data?.articles)
                ? res.data.articles
                : [];
              return list.map((a) => ({ ...a, _category: catKey }));
            })
            .catch((err) => {
              console.error(`Failed to load news for category ${catKey}:`, err);
              return [];
            })
        )
      );

      const merged = results
        .flat()
        .filter((article) => article && (article.title || article.heading))
        .sort(
          (a, b) =>
            new Date(b.createdAt || b.publishedAt || 0) -
            new Date(a.createdAt || a.publishedAt || 0)
        );

      setArticles(merged);
    } catch (err) {
      console.error("Error loading dashboard articles:", err);
      setDashboardError(err.message || "Failed to load your dashboard.");
    } finally {
      setIsDashboardLoading(false);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      setIsProfileLoading(true);
      setProfileError("");
      try {
        const response = await getProfile();
        
        // Unwrap nested response objects (e.g. { data: { ... } } or { user: { ... } })
        const userData = response?.data || response?.user || response || {};
        
        setProfile({
          name: userData.name || userData.Name || "",
          email: userData.email || userData.Email || "",
          role: userData.role || userData.Role || "user",
        });
      } catch (err) {
        console.error("Error loading profile:", err);
        setProfileError(err.message || "Failed to load profile.");
      } finally {
        setIsProfileLoading(false);
      }
    };

    const loadPreferences = async () => {
      setIsPrefsLoading(true);
      setPrefsError("");
      try {
        const data = await getPreferences();
        const prefsData = data?.data || data || {};
        setPreferences({ ...EMPTY_PREFERENCES, ...prefsData });
        const categories = prefsData?.preferredCategories || [];
        setSubscribedCategories(categories);
        await loadDashboardArticles(categories);
      } catch (err) {
        console.error("Error loading preferences:", err);
        setPrefsError(err.message || "Failed to load preferences.");
        setIsDashboardLoading(false);
      } finally {
        setIsPrefsLoading(false);
      }
    };

    const loadNotifications = async () => {
      setIsNotifsLoading(true);
      setNotifsError("");
      try {
        const data = await getNotifications();
        const notifList = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
        setNotifications(notifList);
      } catch (err) {
        console.error("Error loading notifications:", err);
        setNotifsError(err.response?.data?.message || err.message || "Failed to load notifications.");
      } finally {
        setIsNotifsLoading(false);
      }
    };

    loadProfile();
    loadPreferences();
    loadNotifications();
  }, []);

  // ---- Handlers ----
  const handleProfileField = (field) => (e) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSaveProfile = async () => {
    setProfileError("");
    setPasswordError("");

    if (isChangingPassword) {
      if (!newPassword || !confirmPassword) {
        setPasswordError("Please fill in both password fields.");
        return;
      }
      if (newPassword.length < 6) {
        setPasswordError("Password must be at least 6 characters.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError("Passwords don't match.");
        return;
      }
    }

    setIsProfileSaving(true);
    try {
      const payload = { ...profile };
      if (isChangingPassword) {
        payload.password = newPassword;
      }

      const updated = await updateProfile(payload);
      const updatedData = updated?.data || updated?.user || updated || {};
      
      setProfile((prev) => ({
        ...prev,
        name: updatedData.name || prev.name,
        email: updatedData.email || prev.email,
        role: updatedData.role || prev.role,
      }));

      toast.success(isChangingPassword ? "Profile and password updated!" : "Profile updated!");

      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
      setShowPasswordFields(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      setProfileError(err.message);
      toast.error("Couldn't update profile.");
    } finally {
      setIsProfileSaving(false);
    }
  };

  const setNotificationChannel = (key) => {
    setPreferences((prev) => ({ ...prev, notificationChannel: key }));
  };

  const setNotificationFrequency = (key) => {
    setPreferences((prev) => ({ ...prev, notificationFrequency: key }));
  };

  const toggleCategory = (key) => {
    setPreferences((prev) => ({
      ...prev,
      preferredCategories: prev.preferredCategories.includes(key)
        ? prev.preferredCategories.filter((item) => item !== key)
        : [...prev.preferredCategories, key],
    }));
  };

  const handleSavePreferences = async () => {
    setIsPrefsSaving(true);
    setPrefsError("");
    try {
      await updatePreferences(preferences);
      toast.success("Preferences saved!");
      setSubscribedCategories(preferences.preferredCategories);
      await loadDashboardArticles(preferences.preferredCategories);
    } catch (err) {
      console.error("Error saving preferences:", err);
      setPrefsError(err.message);
      toast.error("Couldn't save preferences.");
    } finally {
      setIsPrefsSaving(false);
    }
  };

  const categoryLabel = (key) =>
    CATEGORY_OPTIONS.find((option) => option.key === key)?.label || key;

  const handleUnsubscribe = async (key) => {
    const updatedCategories = subscribedCategories.filter((item) => item !== key);
    const previous = subscribedCategories;
    setSubscribedCategories(updatedCategories);
    setPreferences((prev) => ({ ...prev, preferredCategories: updatedCategories }));
    setArticles((prev) => prev.filter((article) => article._category !== key));

    try {
      await updatePreferences({ preferredCategories: updatedCategories });
      toast.success("Unsubscribed.");
    } catch (err) {
      console.error("Error unsubscribing:", err);
      toast.error(err.message || "Couldn't update preferences.");
      setSubscribedCategories(previous);
      setPreferences((prev) => ({ ...prev, preferredCategories: previous }));
    }
  };

  const handleSubscribe = async (key) => {
    const updatedCategories = [...subscribedCategories, key];
    const previous = subscribedCategories;
    setSubscribedCategories(updatedCategories);
    setPreferences((prev) => ({ ...prev, preferredCategories: updatedCategories }));

    try {
      await updatePreferences({ preferredCategories: updatedCategories });
      toast.success("Subscribed!");
      await loadDashboardArticles(updatedCategories);
    } catch (err) {
      console.error("Error subscribing:", err);
      toast.error(err.message || "Couldn't update preferences.");
      setSubscribedCategories(previous);
      setPreferences((prev) => ({ ...prev, preferredCategories: previous }));
    }
  };

  const handleMarkRead = async (id) => {
    setNotifications((prev) =>
      prev.map((item) => ((item._id || item.id) === id ? { ...item, read: true } : item))
    );
    try {
      await markNotificationRead(id);
    } catch (err) {
      console.error("Error marking notification read:", err);
      setNotifications((prev) =>
        prev.map((item) => ((item._id || item.id) === id ? { ...item, read: false } : item))
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
  const unsubscribedCategories = CATEGORY_OPTIONS.filter(
    (option) => !subscribedCategories.includes(option.key)
  );

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <NavBar />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        
        {/* Back Link & Header */}
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-400 transition hover:text-red-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to feed
        </button>

        {/* User Banner Header */}
        <div className="mb-8 rounded-2xl border border-stone-800 bg-gradient-to-r from-stone-900 via-stone-900 to-stone-950 p-6 shadow-xl">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-red-600 to-amber-600 font-bold text-2xl text-white shadow-lg shadow-red-600/20">
                {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-white">
                    {profile.name || "User Account"}
                  </h1>
                </div>
                <p className="mt-1 text-sm text-stone-400">{profile.email || "Manage your preferences & feed"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="mb-8 flex overflow-x-auto rounded-xl border border-stone-800 bg-stone-900/60 p-1.5 backdrop-blur-md">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex flex-1 items-center justify-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-stone-800 text-white shadow-md shadow-black/40"
                    : "text-stone-400 hover:bg-stone-800/40 hover:text-stone-200"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-red-500" : "text-stone-400"}`} />
                <span>{tab.label}</span>
                {tab.key === "notifications" && unreadCount > 0 && (
                  <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-bold text-white shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {dashboardError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                {dashboardError}
              </div>
            )}

            {isDashboardLoading ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-800 bg-stone-900/50 p-16 text-stone-400">
                <Loader2 className="mb-3 h-8 w-8 animate-spin text-red-500" />
                <p className="text-sm font-medium">Curating your personalized dashboard...</p>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 backdrop-blur-md">
                    <p className="text-xs font-medium uppercase tracking-wider text-stone-400">Subscribed Topics</p>
                    <p className="mt-2 text-3xl font-black text-white">{subscribedCategories.length}</p>
                  </div>
                  <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 backdrop-blur-md">
                    <p className="text-xs font-medium uppercase tracking-wider text-stone-400">Feed Articles Loaded</p>
                    <p className="mt-2 text-3xl font-black text-red-500">{articles.length}</p>
                  </div>
                </div>

                {/* Subscribed Category Badges */}
                {subscribedCategories.length > 0 && (
                  <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5 backdrop-blur-md">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-400">Active Subscriptions</p>
                    <div className="flex flex-wrap gap-2">
                      {subscribedCategories.map((key) => (
                        <span
                          key={key}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400"
                        >
                          {categoryLabel(key)}
                          <button
                            type="button"
                            onClick={() => handleUnsubscribe(key)}
                            className="text-stone-400 transition hover:text-red-400"
                            title="Unsubscribe"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Unsubscribed Categories */}
                {unsubscribedCategories.length > 0 && (
                  <div className="rounded-2xl border border-stone-800/80 bg-stone-900/40 p-5 backdrop-blur-md">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Explore & Subscribe</p>
                    <div className="flex flex-wrap gap-2">
                      {unsubscribedCategories.map((option) => (
                        <button
                          key={option.key}
                          type="button"
                          onClick={() => handleSubscribe(option.key)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-800 bg-stone-950 px-3 py-1.5 text-xs font-medium text-stone-400 transition hover:border-stone-700 hover:text-stone-200"
                        >
                          <Plus className="h-3 w-3 text-stone-500" />
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Articles Table / Cards */}
                <div className="overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/60 shadow-xl backdrop-blur-md">
                  {subscribedCategories.length === 0 ? (
                    <div className="py-16 text-center">
                      <Sparkles className="mx-auto mb-3 h-10 w-10 text-stone-600" />
                      <h3 className="text-lg font-bold text-white">No Category Subscriptions</h3>
                      <p className="mt-1 text-sm text-stone-400">Subscribe to topics above or choose from preferences to unlock your news stream.</p>
                      <button
                        onClick={() => setActiveTab("preferences")}
                        className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
                      >
                        Choose Categories
                      </button>
                    </div>
                  ) : articles.length === 0 ? (
                    <div className="py-16 text-center text-stone-400">
                      <p className="text-base">No articles found for your topics.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-stone-300">
                        <thead className="border-b border-stone-800 bg-stone-900 text-xs font-semibold uppercase text-stone-400">
                          <tr>
                            <th className="px-6 py-4">Article</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Published</th>
                            <th className="px-6 py-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-800/60">
                          {articles.map((article, index) => (
                            <tr key={article._id || article.url || index} className="transition hover:bg-stone-800/40">
                              <td className="max-w-md px-6 py-4 font-medium text-white">
                                <p className="line-clamp-1">{article.title || "Untitled Article"}</p>
                              </td>
                              <td className="px-6 py-4">
                                <span className="rounded-md border border-stone-700 bg-stone-800 px-2.5 py-1 text-xs font-medium text-stone-300">
                                  {categoryLabel(article._category)}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-xs text-stone-400">
                                {new Date(article.createdAt || article.publishedAt || Date.now()).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <a
                                  href={article.url || "#"}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 font-semibold text-red-500 hover:text-red-400"
                                >
                                  Read <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: Profile Info */}
        {activeTab === "profile" && (
          <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 shadow-xl backdrop-blur-md">
            {profileError && (
              <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                {profileError}
              </div>
            )}

            {isProfileLoading ? (
              <div className="flex items-center justify-center p-12 text-stone-400">
                <Loader2 className="h-6 w-6 animate-spin text-red-500" />
              </div>
            ) : (
              <div className="max-w-xl space-y-6">
                <div>
                  <label htmlFor="profile-name" className="block text-xs font-semibold uppercase tracking-wider text-stone-400">Name</label>
                  <input
                    id="profile-name"
                    type="text"
                    value={profile.name}
                    onChange={handleProfileField("name")}
                    className="mt-2 w-full rounded-xl border border-stone-800 bg-stone-950 px-4 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label htmlFor="profile-email" className="block text-xs font-semibold uppercase tracking-wider text-stone-400">Email Address</label>
                  <input
                    id="profile-email"
                    type="email"
                    value={profile.email}
                    onChange={handleProfileField("email")}
                    className="mt-2 w-full rounded-xl border border-stone-800 bg-stone-950 px-4 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                {/* Subscribed Categories Block */}
                <div className="border-t border-stone-800 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">Subscribed Topics</p>
                      <p className="text-xs text-stone-400">Categories you follow for feed updates</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("preferences")}
                      className="rounded-lg border border-stone-700 bg-stone-800 px-3 py-1.5 text-xs font-semibold text-stone-200 transition hover:bg-stone-700"
                    >
                      Manage Topics
                    </button>
                  </div>

                  <div className="mt-4">
                    {subscribedCategories.length === 0 ? (
                      <p className="text-xs text-stone-500 italic">No topic subscriptions selected yet.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {subscribedCategories.map((key) => (
                          <span
                            key={key}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400"
                          >
                            <Tag className="h-3 w-3" />
                            {categoryLabel(key)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Password Change Block */}
                <div className="border-t border-stone-800 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">Security & Password</p>
                      <p className="text-xs text-stone-400">Update your account credentials</p>
                    </div>
                    {!isChangingPassword && (
                      <button
                        type="button"
                        onClick={() => setIsChangingPassword(true)}
                        className="rounded-lg border border-stone-700 bg-stone-800 px-3 py-1.5 text-xs font-semibold text-stone-200 transition hover:bg-stone-700"
                      >
                        Change Password
                      </button>
                    )}
                  </div>

                  {isChangingPassword && (
                    <div className="mt-4 space-y-4 rounded-xl border border-stone-800 bg-stone-950 p-4">
                      <div>
                        <label className="block text-xs text-stone-400" htmlFor="new-password">New Password</label>
                        <div className="relative mt-1">
                          <input
                            id="new-password"
                            type={showPasswordFields ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3.5 py-2 pr-10 text-sm text-white focus:border-red-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswordFields((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500"
                          >
                            {showPasswordFields ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-stone-400" htmlFor="confirm-password">Confirm Password</label>
                        <input
                          id="confirm-password"
                          type={showPasswordFields ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-stone-800 bg-stone-900 px-3.5 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                        />
                      </div>

                      {passwordError && <p className="text-xs text-red-400">{passwordError}</p>}

                      <button
                        type="button"
                        onClick={() => {
                          setIsChangingPassword(false);
                          setNewPassword("");
                          setConfirmPassword("");
                          setPasswordError("");
                        }}
                        className="text-xs font-medium text-stone-400 hover:text-stone-200"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isProfileSaving}
                  className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:opacity-50"
                >
                  {isProfileSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Preferences */}
        {activeTab === "preferences" && (
          <div className="space-y-6">
            {prefsError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                {prefsError}
              </div>
            )}

            {isPrefsLoading ? (
              <div className="flex items-center justify-center p-12 text-stone-400">
                <Loader2 className="h-6 w-6 animate-spin text-red-500" />
              </div>
            ) : (
              <div className="space-y-6 rounded-2xl border border-stone-800 bg-stone-900/60 p-6 shadow-xl backdrop-blur-md">
                
                {/* Categories Selection */}
                <div>
                  <h3 className="text-sm font-semibold text-white">Preferred Topics</h3>
                  <p className="text-xs text-stone-400">Select topics you wish to receive updates for.</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {CATEGORY_OPTIONS.map((option) => {
                      const isSelected = preferences.preferredCategories.includes(option.key);
                      return (
                        <button
                          key={option.key}
                          type="button"
                          onClick={() => toggleCategory(option.key)}
                          className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                            isSelected
                              ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                              : "border border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700 hover:text-stone-200"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Channel Radio Options */}
                <div className="border-t border-stone-800 pt-6">
                  <h3 className="text-sm font-semibold text-white">Notification Channel</h3>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {NOTIFICATION_CHANNELS.map(({ key, label, icon: Icon }) => {
                      const isSelected = preferences.notificationChannel === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setNotificationChannel(key)}
                          className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition ${
                            isSelected
                              ? "border-red-500/40 bg-red-500/10 text-red-400"
                              : "border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Frequency Radio Options */}
                <div className="border-t border-stone-800 pt-6">
                  <h3 className="text-sm font-semibold text-white">Notification Frequency</h3>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {NOTIFICATION_FREQUENCIES.map((option) => {
                      const isSelected = preferences.notificationFrequency === option.key;
                      return (
                        <button
                          key={option.key}
                          type="button"
                          onClick={() => setNotificationFrequency(option.key)}
                          className={`rounded-xl border px-4 py-2.5 text-xs font-semibold transition ${
                            isSelected
                              ? "border-red-500/40 bg-red-500/10 text-red-400"
                              : "border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-stone-800 pt-6">
                  <button
                    type="button"
                    onClick={handleSavePreferences}
                    disabled={isPrefsSaving}
                    className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:opacity-50"
                  >
                    {isPrefsSaving ? "Saving..." : "Save Preferences"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Notifications */}
        {activeTab === "notifications" && (
          <div className="space-y-4">
            {unreadCount > 0 && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="rounded-xl border border-stone-800 bg-stone-900 px-4 py-2 text-xs font-semibold text-stone-300 transition hover:bg-stone-800"
                >
                  Mark all as read
                </button>
              </div>
            )}

            {notifsError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                {notifsError}
              </div>
            )}

            {isNotifsLoading ? (
              <div className="flex items-center justify-center p-12 text-stone-400">
                <Loader2 className="h-6 w-6 animate-spin text-red-500" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-12 text-center text-stone-400 backdrop-blur-md">
                <Bell className="mx-auto mb-2 h-8 w-8 text-stone-600" />
                <p className="text-sm font-medium">No notifications right now.</p>
              </div>
            ) : (
              notifications.map((item) => {
                const notifId = item._id || item.id;
                return (
                  <div
                    key={notifId}
                    className={`flex items-start justify-between gap-4 rounded-2xl border p-5 transition ${
                      item.read
                        ? "border-stone-800/80 bg-stone-900/40 text-stone-400"
                        : "border-red-500/30 bg-stone-900 text-stone-100 shadow-lg"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`mt-0.5 rounded-xl p-2 ${item.read ? "bg-stone-800 text-stone-500" : "bg-red-500/10 text-red-400"}`}>
                        <Bell className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="mt-1 text-xs text-stone-400">{item.message}</p>
                        {item.articleUrl && (
                          <a
                            href={item.articleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-red-400 hover:underline"
                          >
                            Read Article <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        <p className="mt-2 text-[10px] text-stone-500">
                          {new Date(item.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {!item.read && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(notifId)}
                        className="rounded-lg border border-stone-800 p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white"
                        title="Mark read"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
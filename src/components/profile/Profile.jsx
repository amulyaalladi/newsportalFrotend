import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Mail, Bell, Check, User as UserIcon, LayoutDashboard } from "lucide-react";
import {
  getProfile,
  updateProfile,
  getPreferences,
  updatePreferences,
  getNotifications,
 
} from "../../services/userServices";
import { CATEGORY_OPTIONS } from "../common/categories";
import NavBar from "../common/NavBar";

const TABS = [
  { key: "profile", label: "Profile Info" },
  { key: "preferences", label: "Preferences" },
  { key: "notifications", label: "Notifications" },
];

const EMPTY_PROFILE = { name: "", email: "", bio: "", avatarUrl: "", role: "user" };

const EMPTY_PREFERENCES = {
  darkMode: false,
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
  const [activeTab, setActiveTab] = useState("profile");

  // ---- Profile info state ----
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");

  // ---- Preferences state ----
  const [preferences, setPreferences] = useState(EMPTY_PREFERENCES);
  const [isPrefsLoading, setIsPrefsLoading] = useState(true);
  const [isPrefsSaving, setIsPrefsSaving] = useState(false);
  const [prefsError, setPrefsError] = useState("");

  // ---- Notifications state ----
  const [notifications, setNotifications] = useState([]);
  const [isNotifsLoading, setIsNotifsLoading] = useState(true);
  const [notifsError, setNotifsError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      setIsProfileLoading(true);
      setProfileError("");
      try {
        const data = await getProfile();
        setProfile({ ...EMPTY_PROFILE, ...data });
      } catch (err) {
        console.error("Error loading profile:", err);
        setProfileError(err.message);
      } finally {
        setIsProfileLoading(false);
      }
    };

    const loadPreferences = async () => {
      setIsPrefsLoading(true);
      setPrefsError("");
      try {
        const data = await getPreferences();
        setPreferences({ ...EMPTY_PREFERENCES, ...data });
      } catch (err) {
        console.error("Error loading preferences:", err);
        setPrefsError(err.message);
      } finally {
        setIsPrefsLoading(false);
      }
    };

    const loadNotifications = async () => {
      setIsNotifsLoading(true);
      setNotifsError("");
      try {
        const data = await getNotifications();
        setNotifications(data || []);
      } catch (err) {
        console.error("Error loading notifications:", err);
        setNotifsError(err.message);
      } finally {
        setIsNotifsLoading(false);
      }
    };

    loadProfile();
    loadPreferences();
    loadNotifications();
  }, []);

  // ---- Profile handlers ----
  const handleProfileField = (field) => (e) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSaveProfile = async () => {
    setIsProfileSaving(true);
    setProfileError("");
    try {
      const updated = await updateProfile(profile);
      setProfile((prev) => ({ ...prev, ...updated }));
      toast.success("Profile updated!");
    } catch (err) {
      console.error("Error saving profile:", err);
      setProfileError(err.message);
      toast.error("Couldn't update profile.");
    } finally {
      setIsProfileSaving(false);
    }
  };

  // ---- Preferences handlers ----
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
    } catch (err) {
      console.error("Error saving preferences:", err);
      setPrefsError(err.message);
      toast.error("Couldn't save preferences.");
    } finally {
      setIsPrefsSaving(false);
    }
  };

  // ---- Notifications handlers ----
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
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Your Account</h1>
              <p className="mt-2 text-gray-600">
                Manage your profile, news preferences, and notifications in one place.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="inline-flex flex-shrink-0 items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-cyan-700"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-2 border-b border-gray-200">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition ${
                  activeTab === tab.key
                    ? "text-cyan-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {tab.key === "notifications" && unreadCount > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-600 px-1 text-xs font-semibold text-white">
                    {unreadCount}
                  </span>
                )}
                {activeTab === tab.key && (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-cyan-600" />
                )}
              </button>
            ))}
          </div>

          {/* ---- Profile Info tab ---- */}
          {activeTab === "profile" && (
            <div className="mt-6">
              {profileError && (
                <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                  {profileError}
                </div>
              )}

              {isProfileLoading ? (
                <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow">
                  Loading profile...
                </div>
              ) : (
                <div className="space-y-6 rounded-lg bg-white p-5 shadow">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                      <UserIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{profile.name || "Unnamed user"}</p>
                      <p className="text-xs capitalize text-gray-500">{profile.role}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700" htmlFor="profile-name">
                      Name
                    </label>
                    <input
                      id="profile-name"
                      type="text"
                      value={profile.name}
                      onChange={handleProfileField("name")}
                      className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700" htmlFor="profile-email">
                      Email
                    </label>
                    <input
                      id="profile-email"
                      type="email"
                      value={profile.email}
                      onChange={handleProfileField("email")}
                      className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700" htmlFor="profile-bio">
                      Bio
                    </label>
                    <textarea
                      id="profile-bio"
                      value={profile.bio}
                      onChange={handleProfileField("bio")}
                      rows={3}
                      className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="A little about you"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={isProfileSaving}
                    className="rounded-lg bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isProfileSaving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ---- Preferences tab ---- */}
          {activeTab === "preferences" && (
            <div className="mt-6">
              {prefsError && (
                <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                  {prefsError}
                </div>
              )}

              {isPrefsLoading ? (
                <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow">
                  Loading preferences...
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="rounded-lg bg-white p-5 shadow">
                    <h2 className="text-sm font-semibold text-gray-700">Preferred categories</h2>
                    <p className="mt-1 text-xs text-gray-500">
                      Used to personalize your subscribed news feed.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {CATEGORY_OPTIONS.map((option) => {
                        const isSelected = preferences.preferredCategories.includes(option.key);
                        return (
                          <button
                            key={option.key}
                            type="button"
                            onClick={() => toggleCategory(option.key)}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                              isSelected
                                ? "bg-cyan-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-lg bg-white p-5 shadow">
                    <h2 className="text-sm font-semibold text-gray-700">Notification channel</h2>
                    <p className="mt-1 text-xs text-gray-500">
                      How you want to be notified about your subscribed news.
                    </p>
                    <div
                      role="radiogroup"
                      aria-label="Notification channel"
                      className="mt-3 flex flex-wrap gap-2"
                    >
                      {NOTIFICATION_CHANNELS.map(({ key, label, icon: Icon }) => {
                        const isSelected = preferences.notificationChannel === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => setNotificationChannel(key)}
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                              isSelected
                                ? "bg-cyan-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-lg bg-white p-5 shadow">
                    <h2 className="text-sm font-semibold text-gray-700">Notification frequency</h2>
                    <p className="mt-1 text-xs text-gray-500">
                      How often you want to be notified about new articles in your subscribed
                      categories.
                    </p>
                    <div
                      role="radiogroup"
                      aria-label="Notification frequency"
                      className="mt-3 flex flex-wrap gap-2"
                    >
                      {NOTIFICATION_FREQUENCIES.map((option) => {
                        const isSelected = preferences.notificationFrequency === option.key;
                        return (
                          <button
                            key={option.key}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => setNotificationFrequency(option.key)}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                              isSelected
                                ? "bg-cyan-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSavePreferences}
                    disabled={isPrefsSaving}
                    className="rounded-lg bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPrefsSaving ? "Saving..." : "Save preferences"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ---- Notifications tab ---- */}
          {activeTab === "notifications" && (
            <div className="mt-6">
              <div className="flex items-center justify-end">
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

              {notifsError && (
                <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                  {notifsError}
                </div>
              )}

              <div className="mt-4 space-y-4">
                {isNotifsLoading ? (
                  <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow">
                    Loading notifications...
                  </div>
                ) : notifications.length === 0 && !notifsError ? (
                  <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-4 rounded-lg p-5 shadow transition ${
                        item.read
                          ? "border border-gray-200 bg-gray-50 text-gray-600"
                          : "border-y border-r border-gray-200 border-l-4 border-l-cyan-600 bg-white text-gray-800"
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
                        <p
                          className={`text-sm ${
                            item.read ? "font-normal" : "font-semibold text-gray-900"
                          }`}
                        >
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
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
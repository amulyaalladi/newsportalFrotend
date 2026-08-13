import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Mail, Bell } from "lucide-react";
import { getPreferences, updatePreferences } from "../../services/userServices";
import { CATEGORY_OPTIONS } from "../../components/common/categories";
import NavBar from "../common/NavBar";

const NOTIFICATION_CHANNELS = [
  { key: "email", label: "Email", icon: Mail },
  { key: "push", label: "Push Notifications", icon: Bell },
];

const NOTIFICATION_FREQUENCIES = [
  { key: "immediate", label: "Immediate" },
  { key: "hourly", label: "Hourly" },
  { key: "daily", label: "Daily" },
];

const EMPTY_PREFERENCES = {
  darkMode: false,
  preferredCategories: [],
  notificationChannel: "email",
  notificationFrequency: "immediate",
};

const Preferences = () => {
  const [preferences, setPreferences] = useState(EMPTY_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPreferences = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await getPreferences();
        setPreferences({ ...EMPTY_PREFERENCES, ...data });
      } catch (err) {
        console.error("Error loading preferences:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const toggleBoolean = (field) => {
    setPreferences((prev) => ({ ...prev, [field]: !prev[field] }));
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

  const handleSave = async () => {
    setIsSaving(true);
    setError("");

    try {
      await updatePreferences(preferences);
      toast.success("Preferences saved!");
    } catch (err) {
      console.error("Error saving preferences:", err);
      setError(err.message);
      toast.error("Couldn't save preferences.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
        <NavBar/>
        <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800">Preferences</h1>
        <p className="mt-2 text-gray-600">Control how DailyPulse works for you.</p>

        {error && (
          <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="mt-6 rounded-lg bg-white p-8 text-center text-gray-500 shadow">
            Loading preferences...
          </div>
        ) : (
          <div className="mt-6 space-y-8">
            

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
                How often you want to be notified about new articles in your subscribed categories.
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
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-lg bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save preferences"}
            </button>

          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Preferences;

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getPreferences, updatePreferences } from "../../services/userServices";
import { CATEGORY_OPTIONS } from "../../components/common/categories";
import NavBar from "../common/NavBar";

const NOTIFICATION_FREQUENCIES = [
  { key: "immediate", label: "Immediate" },
  { key: "hourly", label: "Hourly" },
  { key: "daily", label: "Daily" },
  { key: "off", label: "Off" },
];

const EMPTY_PREFERENCES = {
  emailNewsletter: false,
  preferredCategories: [],
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
    <div className="min-h-screen px-4 py-12 bg-slate-900 text-slate-50 profile-shell">
      <div className="mx-auto max-w-3xl">
        <div className="profile-card p-6 sm:p-8">
          <div className="flex flex-col gap-3 border-b border-slate-800/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Preferences</h1>
              <p className="mt-1 text-sm text-slate-400">
                Control how DailyPulse works for you.
              </p>
            </div>
            <div className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-300">
              Personalized experience
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-600/40 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-8 text-center text-slate-400">
              Loading preferences...
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                <label className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-200">
                  <span>Email newsletter</span>
                  <input
                    type="checkbox"
                    checked={preferences.emailNewsletter}
                    onChange={() => toggleBoolean("emailNewsletter")}
                    className="h-5 w-5 accent-cyan-500"
                  />
                </label>
              </div>

              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                <h2 className="text-sm font-semibold text-slate-300">Preferred categories</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Pick the topics you want to see more often.
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
                            ? "bg-cyan-500 text-slate-950"
                            : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                <h2 className="text-sm font-semibold text-slate-300">Notification frequency</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Choose how often you want to be notified about new articles.
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
                            ? "bg-cyan-500 text-slate-950"
                            : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-6">
                <p className="text-sm text-slate-500">
                  Preferences update instantly once you save them.
                </p>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save preferences"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Preferences;

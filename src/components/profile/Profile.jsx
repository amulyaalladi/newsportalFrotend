import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getProfile, updateProfile } from "../../services/userServices";
import NavBar from "../common/NavBar";

const EMPTY_PROFILE = { name: "", email: "", bio: "", avatarUrl: "" };

const Profile = () => {
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await getProfile();
        setProfile({ ...EMPTY_PROFILE, ...data });
      } catch (err) {
        console.error("Error loading profile:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (field) => (event) => {
    setProfile((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      await updateProfile(profile);
      toast.success("Profile updated!");
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(err.message);
      toast.error("Couldn't save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const avatarSrc = profile.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.name || "U"}`;

  return (
    <>
    <NavBar/>
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_28%),linear-gradient(135deg,_#020617_0%,_#0f172a_100%)] px-4 py-12 text-slate-50">
      
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="rounded-[1.5rem] border border-slate-700/60 bg-slate-900/80 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <img
                  src={avatarSrc}
                  alt="Profile preview"
                  className="h-16 w-16 rounded-full border border-cyan-400/40 object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-100">Your profile</p>
                  <p className="text-sm text-slate-400">Looks great so far.</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Status</span>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300">
                    Active
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
                  <span>Last update</span>
                  <span className="text-slate-400">Just now</span>
                </div>
              </div>
            </div>

            
          </div>

          <div className="rounded-[1.5rem] border border-slate-700/60 bg-slate-900/80 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-5 border-b border-slate-800/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Profile</h1>
                <p className="mt-1 text-sm text-slate-400">
                  Keep your account details polished and up to date.
                </p>
              </div>
              <div className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-300">
                Personal info
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-600/40 bg-red-500/10 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-8 text-center text-slate-400">
                Loading profile...
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div className="grid gap-4 lg:grid-cols-[auto_1fr] lg:items-start">
                  

                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm text-slate-400" htmlFor="name">
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={profile.name}
                          onChange={handleChange("name")}
                          required
                          className="mt-2 w-full rounded-xl border border-slate-700/70 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-slate-400" htmlFor="email">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={handleChange("email")}
                          required
                          className="mt-2 w-full rounded-xl border border-slate-700/70 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20"
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                      <label className="block text-sm text-slate-400" htmlFor="bio">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        rows={5}
                        value={profile.bio}
                        onChange={handleChange("bio")}
                        className="mt-2 min-h-[120px] w-full resize-y rounded-xl border border-slate-700/70 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-6">
                  <p className="text-sm text-slate-500">
                    Your details are saved securely when you click update.
                  </p>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(6,182,212,0.24)] transition hover:-translate-y-0.5 hover:bg-cyan-700 hover:shadow-[0_14px_28px_rgba(6,182,212,0.32)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSaving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;

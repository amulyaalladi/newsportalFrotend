import { X, Mail, Calendar, ShieldCheck, UserRound } from "lucide-react";

const UserDetails = ({ user, onClose }) => {
  if (!user) return null;

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              User Details
            </h2>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Profile */}
        <div className="p-6">
          <div className="flex flex-col items-center">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}

            <h3 className="mt-4 text-xl font-bold text-gray-900">
              {user.name}
            </h3>

            <span
              className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                user.isBlocked
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {user.isBlocked ? "Blocked" : "Active"}
            </span>
          </div>

          {/* Details */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <Mail size={19} />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Email
                </p>

                <p className="text-sm font-medium text-gray-800 break-all">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <UserRound size={19} />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Role
                </p>

                <p className="text-sm font-medium text-gray-800 capitalize">
                  {user.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                <ShieldCheck size={19} />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Verification
                </p>

                <p className="text-sm font-medium text-gray-800">
                  {user.isVerified
                    ? "Verified"
                    : "Not Verified"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                <Calendar size={19} />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Joined
                </p>

                <p className="text-sm font-medium text-gray-800">
                  {joinedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="mt-5">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Bio
              </p>

              <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
                {user.bio}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
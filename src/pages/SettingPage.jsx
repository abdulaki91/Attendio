import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useCurrentUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import userAvatar from "../assets/images/user.png";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
export default function SettingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch current user
  const { data: user, isLoading: userLoading } = useUser();
  const { logout } = useAuth();
  // Local profile state synced with user
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);

  // Password state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Sync profile state with fetched user
  useEffect(() => {
    if (user) setProfile({ name: user.name, email: user.email });
  }, [user]);

  const handleEditToggle = () => setIsEditing(!isEditing);

  // ==============================
  // Profile Update Mutation (React Query v5)
  // ==============================
  const updateUserMutation = useMutation({
    mutationFn: async (updatedData) => {
      const { data } = await api.put(`/users/update-user`, updatedData);
      return data;
    },
    onSuccess: (data) => {
      // Update the cache for the current user
      queryClient.setQueryData(["user", user.id], data);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update profile");
    },
  });

  const handleSaveProfile = () => {
    if (!profile.name || !profile.email) {
      toast.error("Name and email cannot be empty");
      return;
    }
    updateUserMutation.mutate(profile);
  };

  // ==============================
  // Password Change Mutation (React Query v5)
  // ==============================
  const changePasswordMutation = useMutation({
    mutationFn: async (passwordData) => {
      await api.put(`/users/change-password`, passwordData);
    },
    onSuccess: () => {
      toast.success("Password updated successfully");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update password");
    },
  });

  const handleChangePassword = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (userLoading) return <p className="text-center mt-20">Loading user...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">
            Settings
          </h1>
          <div className="flex items-center gap-4">
            <button
              className="btn btn-error btn-outline"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="card bg-base-100 shadow-xl border border-base-300/40">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <h2 className="card-title">Profile</h2>
                {!isEditing ? (
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={handleEditToggle}
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="btn btn-primary btn-sm"
                      disabled={updateUserMutation.isLoading}
                    >
                      {updateUserMutation.isLoading ? (
                        <span className="loading loading-spinner loading-sm text-base-100"></span>
                      ) : (
                        "Save"
                      )}
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={handleEditToggle}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 mt-2 p-3 rounded-xl bg-base-200/60">
                <div className="avatar">
                  <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={userAvatar} alt="User Avatar" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-base-content/90">
                    {profile.name}
                  </p>
                  <p className="text-sm text-base-content/70">
                    {profile.email}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Name</span>
                  </div>
                  <input
                    type="text"
                    value={profile.name}
                    disabled={!isEditing}
                    className={`input input-bordered w-full ${
                      !isEditing ? "opacity-80" : ""
                    }`}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                  />
                </label>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Email</span>
                  </div>
                  <input
                    type="email"
                    value={profile.email}
                    disabled={!isEditing}
                    className={`input input-bordered w-full ${
                      !isEditing ? "opacity-80" : ""
                    }`}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="card bg-base-100 shadow-xl border border-base-300/40">
            <div className="card-body">
              <h2 className="card-title">Account Security</h2>
              <p className="text-sm text-base-content/70">
                Update your password to keep your account safe.
              </p>

              <div className="mt-4 grid gap-3">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="input input-bordered w-full"
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      currentPassword: e.target.value,
                    })
                  }
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="input input-bordered w-full"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="input input-bordered w-full"
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>

              <div className="card-actions mt-4">
                <button
                  className="btn btn-primary w-44"
                  onClick={handleChangePassword}
                  disabled={changePasswordMutation.isLoading}
                >
                  {changePasswordMutation.isLoading ? (
                    <span className="loading loading-spinner loading-sm text-base-100"></span>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

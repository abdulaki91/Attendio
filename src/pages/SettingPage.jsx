import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useCurrentUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import baseUri from "../baseURI/BaseUri";
import toast from "react-hot-toast";
import userAvatar from "../assets/images/user.png";
import { useAuth } from "../context/AuthContext";

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
      const { data } = await axios.put(
        `${baseUri}/users/update-user`,
        updatedData
      );
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
      await axios.put(`${baseUri}/users/change-password`, passwordData);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
      <h1 className="text-3xl font-bold mb-8 text-primary">Settings</h1>

      {/* Profile Card */}
      <div className="card w-full max-w-2xl bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">Profile Settings</h2>
          <div className="flex items-center space-x-4 mb-4">
            <div className="avatar">
              <div className="w-16 rounded-full h-16 ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={userAvatar} alt="User Avatar" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-bold">{profile.name}</p>
              <p className="text-sm">{profile.email}</p>
            </div>
          </div>

          <div className="form-control flex gap-3 items-center">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              value={profile.name}
              disabled={!isEditing}
              className="input input-bordered"
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div className="form-control mt-4 flex gap-3 items-center">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              value={profile.email}
              disabled={!isEditing}
              className="input input-bordered"
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
          </div>

          <div className="card-actions justify-end mt-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveProfile}
                  className="btn btn-primary"
                  disabled={updateUserMutation.isLoading}
                >
                  {updateUserMutation.isLoading ? (
                    <span className="loading loading-spinner loading-sm text-base-100"></span>
                  ) : (
                    "Save"
                  )}
                </button>
                <button className="btn btn-ghost" onClick={handleEditToggle}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-outline" onClick={handleEditToggle}>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Password Card */}
      <div className="card w-full max-w-2xl shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">Account Security</h2>

          <div className="mt-4 grid gap-3">
            <input
              type="password"
              placeholder="Current Password"
              className="input input-bordered w-full"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, currentPassword: e.target.value })
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
                setPasswords({ ...passwords, confirmPassword: e.target.value })
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

      <button className="btn btn-wide btn-primary mt-4" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}

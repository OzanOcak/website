"use client";
import { useUserName } from "@/hooks/roles/user/useProfile";
import Layout from "@/components/custom/layout";
import { Pending } from "@/components/custom/isPending";
import { Erroring } from "@/components/custom/isError";
import { useStore } from "@/stores/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelfDeleteUser } from "@/hooks/roles/user/useSelfDeleteUser";
import { useUpdateUserName } from "@/hooks/roles/user/useUpdateName";
import { useState, useEffect } from "react";
import CustomAlertDialog from "@/components/custom/alertBox";
import { useQueryClient } from "@tanstack/react-query";
import { FaUser } from "react-icons/fa";

export default function ProfilePage() {
  const { data: profile, isPending, isError, error } = useUserName();
  const accessToken = useStore((state) => state.accessToken);
  const deleteMutation = useSelfDeleteUser();
  const updateNameMutation = useUpdateUserName();
  const queryClient = useQueryClient();

  const setUsername = useStore((state) => state.setName);
  const picture = useStore((state) => state.profilePicture);

  const [newName, setNewName] = useState<string>("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [actionType, setActionType] = useState<"update" | "delete" | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false); // State for editing mode

  useEffect(() => {
    if (profile) {
      setNewName(profile.username); // Initialize with the current username
    }
  }, [profile]);

  const handleUpdateUsername = () => {
    setAlertMessage("Are you sure you want to update your username?");
    setActionType("update");
    setShowAlert(true);
  };

  const handleDeleteUser = () => {
    setAlertMessage("Are you sure you want to delete your account?");
    setActionType("delete");
    setShowAlert(true);
  };

  const handleConfirmAction = () => {
    if (actionType === "update" && profile?.id) {
      updateNameMutation.mutate(
        { userId: profile.id, newName },
        {
          onSuccess: () => {
            // Invalidate the query to refetch the updated data
            queryClient.invalidateQueries({ queryKey: ["user"] });
            setUsername(newName); // Update global state
            setIsEditing(false); // Exit editing mode
          },
          onError: (error) => {
            // Revert the profile object to the previous state
            queryClient.setQueryData(["user"], profile);
            console.error("Error updating username:", error);
          },
        }
      );
    } else if (actionType === "delete" && profile?.id) {
      deleteMutation.mutate(profile.id, {
        onSuccess: () => {
          useStore.getState().setUserDeleted(true);
        },
        onError: (error) => {
          console.error("Error deleting account:", error);
        },
      });
    }
    setShowAlert(false);
  };

  const handleCancelAction = () => {
    setShowAlert(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false); // Exit editing mode
    setNewName(profile?.username || ""); // Reset the input to the current username
  };

  if (isPending) return <Pending />;
  if (isError) return <Erroring />;
  if (!profile) return <div>No profile found, {error}</div>;

  return (
    <Layout>
      {accessToken ? (
        <div className="bg-white dark:bg-gray-800 mt-8 w-full md:w-4/5 lg:w-3/5 mx-auto relative">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200">
              Profile
            </h1>
          </div>

          {/* User Information Card */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-4 flex flex-col md:flex-row">
            <div className="w-full md:w-1/4 flex justify-center mb-4 md:mb-0">
              <Avatar className="w-24 h-24 mb-8">
                <AvatarImage
                  src={profile.profilePicture || picture}
                  className="w-full h-full object-cover"
                />
                <AvatarFallback className="w-16 h-16">
                  {/* Fallback if no image is available */}
                  <FaUser className="w-[60%] h-[60%] text-gray-400 dark:text-gray-500" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="w-full md:w-3/4 flex flex-col justify-center px-4">
              <div className="block sm:flex sm:justify-between text-lg">
                <div className="font-bold w-28 dark:text-gray-200">
                  <p>Username:</p>
                </div>
                {isEditing ? (
                  <div className="flex justify-between items-start gap-2 mb-4">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 rounded-md p-1 text-sm dark:bg-gray-700 dark:text-gray-200"
                    />
                    <button
                      onClick={handleUpdateUsername}
                      className="text-sm text-blue-500 hover:text-blue-700"
                    >
                      Update
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <p className="w-48 dark:text-gray-200">
                      {profile.username}
                    </p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm text-blue-500 hover:text-blue-700 ml-8 sm:ml-0"
                    >
                      <p>Change</p>
                    </button>
                  </div>
                )}
              </div>
              <div className="flex justify-between text-lg">
                <div className="font-bold dark:text-gray-200">
                  <p>Role:</p>
                </div>
                <div className="dark:text-gray-200">{profile.role}</div>
              </div>
              <div className="flex justify-between text-lg">
                <div className="font-bold dark:text-gray-200">
                  <p>Email:</p>
                </div>
                <div className="dark:text-gray-200">{profile.email}</div>
              </div>
              <div className="flex justify-center mt-16">
                <button
                  onClick={handleDeleteUser}
                  className="text-red-500 hover:underline transition w-full max-w-xs text-left"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Alert Dialog */}
          <CustomAlertDialog
            message={alertMessage}
            onConfirm={handleConfirmAction}
            onCancel={handleCancelAction}
            isOpen={showAlert}
            close={() => setShowAlert(false)}
          />
        </div>
      ) : (
        <div className="text-center mt-8 text-red-500 font-semibold">
          Not authorized access
        </div>
      )}
    </Layout>
  );
}

"use client";
import { Erroring } from "@/components/custom/isError";
import { Pending } from "@/components/custom/isPending";
import Layout from "@/components/custom/layout";
import { useAdminUserEdit } from "@/hooks/roles/admin/useAdminUserEdit";
import { useDeleteUser } from "@/hooks/roles/admin/useDeleteUser";
import { useUpdateUserRole } from "@/hooks/roles/admin/useUpdateRole";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/stores/useAuthStore";
import CustomAlertDialog from "@/components/custom/alertBox";
import { useParams, useRouter } from "next/navigation";

const AdminEditPage: React.FC = () => {
  //const userId = params.id;
  const { userId } = useParams<{ userId: string }>();
  const { data: user, isLoading, isError } = useAdminUserEdit(userId || "");
  const deleteMutation = useDeleteUser();
  const updateRoleMutation = useUpdateUserRole();
  const [newRole, setNewRole] = useState<string>("");
  const queryClient = useQueryClient();
  const router = useRouter();

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [actionType, setActionType] = useState<"update" | "delete" | null>(
    null
  );

  useEffect(() => {
    if (user) {
      setNewRole(user.role);
    }
  }, [user]);

  const handleUpdateUserRole = () => {
    setAlertMessage("Are you sure you want to update this user's role?");
    setActionType("update");
    setShowAlert(true);
  };

  const handleDeleteUser = () => {
    setAlertMessage("Are you sure you want to delete this user?");
    setActionType("delete");
    setShowAlert(true);
  };

  const handleConfirmAction = () => {
    if (actionType === "update") {
      if (!userId || !["user", "admin", "editor"].includes(newRole)) {
        return;
      }
      updateRoleMutation.mutate(
        { userId, newRole: newRole },
        {
          onSuccess: () => {
            // alert("User role updated successfully");
            queryClient.invalidateQueries({ queryKey: ["adminUser", userId] });
            useStore.getState().setUserDeleted(true);
          },
          onError: (error) => {
            console.error("Error updating user role:", error);
            // alert("Failed to update user role. Please try again.");
          },
        }
      );
    } else if (actionType === "delete") {
      deleteMutation.mutate(userId as string, {
        onSuccess: () => {
          // alert("User deleted successfully");
          useStore.getState().setUserDeleted(true);
          router.push("/admin");
        },
        onError: (error) => {
          console.error("Error deleting user:", error);
          //  alert("Failed to delete user. Please try again.");
        },
      });
    }
    setShowAlert(false);
  };

  const handleCancelAction = () => {
    setShowAlert(false);
  };

  if (isLoading) return <Pending />;
  if (isError) return <Erroring />;

  if (!user) {
    return <p>User not found.</p>;
  }

  return (
    <Layout>
      <div className="mt-8 w-full md:w-4/5 lg:w-3.5/5">
        {/* Go Back Icon (Top Left) */}
        <div
          className="absolute top-4 left-4 flex items-center cursor-pointer hover:text-blue-700 hover:scale-105 transition-transform duration-200"
          onClick={() => window.history.back()} // Handle go back
        >
          <FaArrowLeft className="text-blue-500 text-2xl" />
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center">Edit User Profile</h1>
        </div>

        {/* User Information */}
        <div className="mb-4">
          <p>ID: {user.id}</p>
          <p>Name: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Current Role: {user.role}</p>
        </div>

        {/* Update Role */}
        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-8"
          >
            Update Role:
          </label>
          <select
            id="role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className=" block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 mt-8 mb-16"
          >
            <option value="" disabled>
              Select role
            </option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
          </select>
          <button
            onClick={handleUpdateUserRole}
            className="mt-2 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
          >
            Update Role
          </button>
        </div>

        {/* Delete User Button */}
        <button
          onClick={handleDeleteUser}
          className="mt-4 w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
        >
          Delete User
        </button>

        {/* Alert Dialog */}
        <CustomAlertDialog
          message={alertMessage}
          onConfirm={handleConfirmAction}
          onCancel={handleCancelAction}
          isOpen={showAlert}
          close={() => setShowAlert(false)}
        />
      </div>
    </Layout>
  );
};

export default AdminEditPage;

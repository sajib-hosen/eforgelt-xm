import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllUsers, UserResponse } from "../../api/admin/get-users";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import UserDetailsDialog from "./UserDetails";

type UserListProps = {
  darkMode: boolean;
};

const UserList = ({ darkMode }: UserListProps) => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // On mount or when users/searchParams change: open dialog if ?user=userid exists
  useEffect(() => {
    const userId = searchParams.get("user");
    if (!userId) {
      setIsDialogOpen(false);
      setSelectedUser(null);
      return;
    }

    // Find user by id from users array
    const user = users.find((u) => u._id === userId);
    if (user) {
      setSelectedUser(user);
      setIsDialogOpen(true);
    } else {
      // User not found - close dialog & remove query param
      setIsDialogOpen(false);
      setSelectedUser(null);
      setSearchParams((prev) => {
        prev.delete("user");
        return prev;
      });
    }
  }, [searchParams, users, setSearchParams]);

  const handleDelete = async (id: string) => {
    try {
      setUsers((prev) => prev.filter((user) => user._id !== id));
      toast.success("User deleted successfully");

      // If deleted user is selected, close dialog and remove query param
      if (selectedUser?._id === id) {
        setIsDialogOpen(false);
        setSelectedUser(null);
        setSearchParams((prev) => {
          prev.delete("user");
          return prev;
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  const openUserDialog = (user: UserResponse) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
    setSearchParams({ user: user._id });
  };

  const closeUserDialog = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
    setSearchParams((prev) => {
      prev.delete("user");
      return prev;
    });
  };

  if (loading) return <p className="text-center mt-6">Loading users...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">User List</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="capitalize">{user.role}</TableCell>
              <TableCell>{user.isVerified ? "Yes" : "No"}</TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => openUserDialog(user)}
                >
                  View
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <UserDetailsDialog
        darkMode={darkMode}
        closeDialog={() => setSearchParams({})}
      />
    </div>
  );
};

export default UserList;

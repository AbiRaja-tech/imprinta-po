"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { collection, getDocs, doc, setDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Loader2 } from "lucide-react";
import { UserRole } from "@/lib/access-control";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Timestamp;
  lastLogin?: Timestamp;
}

// Helper function to format dates safely
const formatDate = (date: Timestamp | undefined) => {
  if (!date) return "Never";
  try {
    return new Date(date.seconds * 1000).toLocaleDateString();
  } catch (error) {
    return "Invalid Date";
  }
};

export default function UsersPage() {
  const { permissions } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    role: "user" as UserRole,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  useEffect(() => {
    if (permissions && !permissions.canManageUsers) {
      router.push('/dashboard');
      return;
    }
    loadUsers();
  }, [permissions, router]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      const fetchedUsers = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as User[];
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Failed to load users:", error);
      setError("Failed to load users. Please try again.");
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      setIsCreatingUser(true);
      const userRef = doc(collection(db, "users"));
      await setDoc(userRef, {
        ...newUser,
        createdAt: Timestamp.now(),
      });
      setIsAddUserOpen(false);
      setNewUser({ email: "", name: "", role: "user" });
      toast.success("User created successfully");
      loadUsers();
    } catch (error) {
      console.error("Failed to create user:", error);
      toast.error("Failed to create user");
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, { role: newRole }, { merge: true });
      toast.success("Role updated successfully");
      loadUsers();
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error("Failed to update role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const userRef = doc(db, "users", userId);
      await deleteDoc(userRef);
      toast.success("User deleted successfully");
      loadUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    }
  };

  if (!permissions?.canManageUsers) {
    return null;
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <Button onClick={loadUsers} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>Add User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
              <Input
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
              <Select
                value={newUser.role}
                onValueChange={(value: UserRole) =>
                  setNewUser({ ...newUser, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleCreateUser} 
                disabled={isCreatingUser}
              >
                {isCreatingUser ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create User'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onValueChange={(value: UserRole) =>
                      handleUpdateRole(user.id, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell>
                  {formatDate(user.lastLogin)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 
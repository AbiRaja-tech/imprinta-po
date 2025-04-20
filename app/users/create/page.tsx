"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function CreateUserPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createUser(formData.email, formData.password, formData.name, "user");
      toast.success("User account created successfully");
      router.push("/users");
    } catch (error: any) {
      console.error("User creation error:", error);
      // Handle specific Firebase errors
      const errorMessage = error.code === 'auth/email-already-in-use'
        ? "This email is already registered. Please use a different email."
        : "Failed to create user account";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create New User</h1>
        <p className="text-gray-600">Create a new user account with regular user permissions</p>
      </div>

      <div className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              minLength={6}
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create User"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 
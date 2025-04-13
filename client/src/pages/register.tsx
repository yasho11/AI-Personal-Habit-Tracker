// src/components/Register/Register.tsx
import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStores";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    UserName: "",
    UserEmail: "",
    UserPassword: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.UserName.trim()) return toast.error("Name is required");
    if (!formData.UserEmail.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.UserEmail))
      return toast.error("Invalid email format");
    if (!formData.UserPassword) return toast.error("Password is required");
    if (formData.UserPassword.length < 4)
      return toast.error("Password must be at least 4 characters");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      signup(formData);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="w-full max-w-md bg-base-100 p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-6 text-base-content">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4 ">
          {/* Full Name */}
          <label className="form-control w-full mt-7">
            <div className="label">
              <span className="label-text text-base-content">Full Name</span>
            </div>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-base-content/60" />
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered w-full pl-10"
                value={formData.UserName}
                onChange={(e) =>
                  setFormData({ ...formData, UserName: e.target.value })
                }
              />
            </div>
          </label>

          {/* Email */}
          <label className="form-control w-full mt-7">
            <div className="label">
              <span className="label-text text-base-content">Email</span>
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-base-content/60" />
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full pl-10"
                value={formData.UserEmail}
                onChange={(e) =>
                  setFormData({ ...formData, UserEmail: e.target.value })
                }
              />
            </div>
          </label>

          {/* Password */}
          <label className="form-control w-full mt-7">
            <div className="label">
              <span className="label-text text-base-content">Password</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-base-content/60" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="input input-bordered w-full pl-10 pr-10"
                value={formData.UserPassword}
                onChange={(e) =>
                  setFormData({ ...formData, UserPassword: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute right-3 top-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          {/* Register Button */}
          <button type="submit" className="btn btn-primary w-full mt-7">
            {isSigningUp ? "Registering..." : "Register"}
          </button>

          {/* Redirect to Login */}
          <div className="text-center text-sm text-base-content/80 mt-4">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

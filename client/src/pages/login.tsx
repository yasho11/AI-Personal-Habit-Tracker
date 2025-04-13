// src/components/Login/Login.tsx
import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStores";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    UserEmail: "",
    UserPassword: "",
  });

  const { signin, isSigningIn } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signin(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="w-full max-w-md bg-base-100 p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-6 text-base-content">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <label className="form-control w-full">
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
                required
              />
            </div>
          </label>

          {/* Password */}
          <label className="form-control w-full">
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
                required
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

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-full mt-7">
            {isSigningIn ? "Logging In..." : "Login"}
          </button>

          <div className="text-center text-sm text-base-content/80 mt-4">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

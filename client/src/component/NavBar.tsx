import { Link } from "react-router-dom";
import { Settings, User, LogOut, CalendarCheck, HeartHandshake, ListChecks } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStores";

function Navbar() {
  // Accessing authUser and logout from the auth store
  const { authUser, logout } = useAuthStore();

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* === Left Section: Branding === */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <CalendarCheck className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">HabitStreak</h1>
            </Link>

            {/* === Extra Links: Habits & Recommend === */}
            <nav className="flex gap-4">
              <Link
                to="/habits"
                className="btn btn-sm gap-2 btn-ghost hover:bg-base-200 transition"
              >
                <ListChecks className="w-4 h-4" />
                <span className="hidden sm:inline">Habits</span>
              </Link>

              <Link
                to="/recommend"
                className="btn btn-sm gap-2 btn-ghost hover:bg-base-200 transition"
              >
                <HeartHandshake className="w-4 h-4" />
                <span className="hidden sm:inline">Recommend</span>
              </Link>
            </nav>
          </div>

          {/* === Right Section: User Actions === */}
          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className="btn btn-sm gap-2 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {/* Show if user is authenticated */}
            {authUser && (
              <>
                <Link to="/profile" className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  onClick={logout}
                  className="flex gap-2 items-center btn btn-sm btn-ghost hover:bg-base-200"
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

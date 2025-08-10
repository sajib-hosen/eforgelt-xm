import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { Moon, Sun, User, LogOut } from "lucide-react";
import { useEffect } from "react";
import { getMe } from "../../api/user/get-me";
import { loginSuccess, logoutSuccess } from "../../redux/slices/authSlice";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { logoutUser } from "../../api/user/logout";
import { toast } from "react-toastify";
import { useAuthContext } from "../../context/auth.provider";

type Props = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const Navbar = ({ darkMode, toggleDarkMode }: Props) => {
  const dispatch = useDispatch();
  const { isLoading } = useAuthContext();
  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!token) return;
    if (user) return;

    const getCurrentUser = async () => {
      try {
        const res = await getMe();
        dispatch(
          loginSuccess({
            token,
            user: res,
          })
        );
      } catch (e: any) {
        console.error("Failed to fetch user info:", e.message || e);
      }
    };

    getCurrentUser();
  }, [token, user, dispatch]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logoutSuccess());
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.message || "Logout failed. Please try again.");
    }
  };

  // Helper to render role badge for admin or supervisor
  const renderRoleBadge = () => {
    if (!user) return null;
    if (user.role === "admin") {
      return (
        <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded bg-red-600 text-white">
          Admin
        </span>
      );
    }
    if (user.role === "supervisor") {
      return (
        <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded bg-green-600 text-white">
          Supervisor
        </span>
      );
    }
    return null;
  };

  return (
    <nav
      className={`${
        darkMode
          ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-r from-gray-600 via-violet-800 to-blue-900"
      } p-4 shadow mb-0`}
    >
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-yellow-400 dark:via-orange-400 dark:to-red-500 bg-clip-text text-transparent">
          <Link to="/">SkillCertify</Link>
        </div>

        <div className="flex items-center gap-3">
          {!user && (
            <div className="flex items-center gap-2 border border-gray-500 dark:border-gray-600 p-1.5 px-4 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium select-none transition">
              <ul className="flex space-x-4">
                <li>
                  <Link
                    to="/register"
                    className="text-white font-bold text-lg hover:underline"
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-white font-bold text-lg hover:underline"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {user?.name && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="flex items-center gap-2 border border-gray-500 dark:border-gray-600 p-1.5 px-4 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium select-none hover:brightness-90 transition"
                  aria-label="User menu"
                >
                  {isLoading ? (
                    "Loading..."
                  ) : (
                    <>
                      <User size={20} />
                      <span>{user.name.split(" ")[0]}</span>
                      {renderRoleBadge()}
                    </>
                  )}
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-40 p-2 bg-gray-600 text-white border-none flex flex-col gap-2">
                <Link
                  to="/profile"
                  className="px-2 py-1 rounded hover:bg-gray-800 dark:hover:bg-gray-700 transition"
                >
                  Profile
                </Link>

                <Link
                  to="/quiz"
                  className="px-2 py-1 rounded hover:bg-gray-800 dark:hover:bg-gray-700 transition"
                >
                  Quiz
                </Link>

                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="px-2 py-1 rounded hover:bg-gray-800 dark:hover:bg-gray-700 transition font-semibold text-red-400"
                  >
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-2 py-1 rounded bg-red-600 text-white transition hover:bg-red-700"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </PopoverContent>
            </Popover>
          )}

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 text-black dark:text-white hover:scale-110 transition"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

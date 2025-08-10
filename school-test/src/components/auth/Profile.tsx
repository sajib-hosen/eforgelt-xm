import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store/store";
import { logoutSuccess, loginSuccess } from "../../redux/slices/authSlice";
import { getMe } from "../../api/user/get-me";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type Props = {
  darkMode: boolean;
};

const Profile = ({ darkMode }: Props) => {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMe();
        dispatch(loginSuccess({ token: token!, user: res }));
      } catch (error: any) {
        toast.error("Failed to load profile.");
      }
    };

    if (token && !user) {
      fetchProfile();
    }
  }, [token, user, dispatch]);

  if (!token) {
    return <p>Please login to see your profile.</p>;
  }

  return (
    <div
      className={`max-w-md mx-auto p-6 rounded mt-10
        ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}
        shadow-md
      `}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Hi, {user?.name || "User"}</h2>
      </div>

      <p>Email: {user?.email}</p>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => {
            toast.info("Certificate download coming soon!");
          }}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Download Certificate
        </button>
      </div>
    </div>
  );
};

export default Profile;

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/auth.provider";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";

interface Props {
  component: React.JSX.Element;
  path?: string;
}

const AdminGuard: React.FC<Props> = ({ component: RouteComponent, path }) => {
  const { isLoading } = useAuthContext();
  const { user, token } = useSelector((state: RootState) => state.auth);

  if (isLoading)
    return (
      <div className=" py-28">
        <p className=" text-center">Loading...</p>
      </div>
    );

  if (user && token && user.role === "admin") return <>{RouteComponent}</>;

  return <Navigate to={`/`} />;
};

export default AdminGuard;

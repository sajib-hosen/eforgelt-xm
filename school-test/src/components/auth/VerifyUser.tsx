import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { verifyEmail } from "../../api/user/verify-email";
import { Link, useParams } from "react-router-dom";
import { loginSuccess } from "../../redux/slices/authSlice";
// import { loginSuccess } from "../../redux/authSlice"; // Adjust import path

const VerifyUser = () => {
  const dispatch = useDispatch();
  const { tokenId } = useParams<{ tokenId: string }>();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!tokenId) {
      setStatus("error");
      setErrorMessage("Verification token is missing.");
      return;
    }

    const verify = async () => {
      try {
        const res = await verifyEmail(tokenId);

        if (res.accessToken) {
          // If you don't have user info from response,
          // you might want to decode token or fetch user separately
          dispatch(
            loginSuccess({
              token: res.accessToken,
              user: null, // or fetch user data here if possible
            })
          );
        }

        setStatus("success");
      } catch (e: any) {
        setStatus("error");
        setErrorMessage(e.message || "Verification failed.");
      }
    };

    verify();
  }, [tokenId, dispatch]);

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col justify-center items-center px-4 text-center max-w-md mx-auto">
      {status === "loading" && (
        <p className="text-gray-600 text-lg">
          Verifying your email, please wait...
        </p>
      )}

      {status === "success" && (
        <>
          <h2 className="text-2xl font-semibold mb-4 text-green-600">
            Email Verified Successfully!
          </h2>
          <p className="mb-6">
            Thank you for verifying your email. You can now proceed.
          </p>
          <Link
            to="/"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Go Home
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <h2 className="text-2xl font-semibold mb-4 text-red-600">
            Verification Failed
          </h2>
          <p className="mb-6">{errorMessage}</p>
          <Link
            to="/register"
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            Register Instead
          </Link>
        </>
      )}
    </div>
  );
};

export default VerifyUser;

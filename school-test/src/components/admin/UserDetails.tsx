import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  getUserById,
  UserWithQuizResponse,
} from "../../api/admin/get-user-details";
// import { UserWithQuizResponse } from "../../types"; // make sure this points to your interface file

type Props = {
  darkMode: boolean;
  closeDialog: () => void;
};

const UserDetailsDialog = ({ darkMode, closeDialog }: Props) => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user");

  const [user, setUser] = useState<UserWithQuizResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await getUserById(userId);
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  return (
    <Dialog open={!!userId} onOpenChange={closeDialog}>
      <DialogContent
        className={`sm:max-w-lg ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Full details of the selected user.
          </DialogDescription>
        </DialogHeader>

        {loading && <p>Loading...</p>}

        {!loading && user && (
          <div className="space-y-3 mt-4 text-sm">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            <p>
              <strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(user.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated At:</strong>{" "}
              {new Date(user.updatedAt).toLocaleString()}
            </p>

            {/* Quiz Results */}
            {user.quizResult ? (
              <div className="mt-4 border-t pt-3">
                <h4 className="font-semibold mb-2">Quiz Result</h4>
                <p>
                  <strong>Step:</strong> {user.quizResult.step}
                </p>
                <p>
                  <strong>Score:</strong> {user.quizResult.scorePercent}%
                </p>
                <p>
                  <strong>Passed:</strong>{" "}
                  {user.quizResult.proceedToNextStep ? "Yes" : "No"}
                </p>
                {user.quizResult.certification && (
                  <p>
                    <strong>Certificate:</strong>{" "}
                    {user.quizResult.certification}
                  </p>
                )}
                <p>
                  <strong>Completed At:</strong>{" "}
                  {new Date(user.quizResult.createdAt).toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="mt-4 italic">No quiz results available.</p>
            )}
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={closeDialog}>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;

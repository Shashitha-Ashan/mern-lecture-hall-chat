import { useNavigate } from "react-router-dom";
import { useUserData } from "../Context/UserRoleContext";
import { useEffect } from "react";

export default function LecturerProtectedRoute({ children }) {
  const userData = useUserData();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData.role != "lecturer") {
      navigate("/login", { replace: true });
    }
  }, [navigate, userData]);

  return children;
}

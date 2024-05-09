import { useNavigate } from "react-router-dom";
import { useUserData } from "../Context/UserRoleContext";
import { useEffect } from "react";

export default function AdminRoute({ children }) {
  const userData = useUserData();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData.role != "admin") {
      navigate("/", { replace: true });
    }
  }, [navigate, userData]);

  return children;
}

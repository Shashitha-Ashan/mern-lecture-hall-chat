import { useNavigate } from "react-router-dom";
import { useUserData } from "../Context/UserRoleContext";
import { useEffect } from "react";

export default function ProtetedRoute({ children }) {
  const userData = useUserData();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData && userData.role === "admin") {
      navigate("/cpanel", { replace: true });
    }
    if (!userData) {
      navigate("/login", { replace: true });
    }
  }, [navigate, userData]);

  return children;
}

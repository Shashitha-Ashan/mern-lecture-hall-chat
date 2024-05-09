/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

async function fetchUserData() {
  try {
    const response = await api.get("api/user/getrole");
    return response.data;
  } catch (error) {
    return null;
  }
}
// context for update and get context
export const UserRoleContext = createContext();
export const UpdateRoleContext = createContext();

// custom hooks for get and update user role
export function useUserData() {
  return useContext(UserRoleContext);
}
export function useUpdateUserData() {
  return useContext(UpdateRoleContext);
}

// wrapper for user role
export function UserRoleProvider({ children }) {
  const [role, setRole] = useState({});
  const [loading, setLoading] = useState(true);

  function updateUserData(data) {
    setRole(data);
  }
  useEffect(() => {
    fetchData();
    async function fetchData() {
      const user = await fetchUserData();
      setRole(user);

      setLoading(false);
    }
  }, []);
  useEffect(() => {}, [role]);

  return loading ? null : (
    <UpdateRoleContext.Provider value={updateUserData}>
      <UserRoleContext.Provider value={role}>
        {children}
      </UserRoleContext.Provider>
    </UpdateRoleContext.Provider>
  );
}

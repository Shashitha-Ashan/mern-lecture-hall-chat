/* eslint-disable no-unused-vars */
import "./profile.css";
import { IoIosPerson } from "react-icons/io";
import { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
function Profile() {
  const [user, setUser] = useState({});

  const getProfileData = async () => {
    try {
      const res = await api.get("api/user/getrole");
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  // const test = async () => {
  //   try {
  //     const res = await api.get("api/rooms/my/all");
  //     console.log(res.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  useEffect(() => {
    getProfileData();
    // test();
  }, []);
  return (
    <div className="profile-container">
      <div className="profile-picture">
        <IoIosPerson size="100px" />
      </div>
      <div className="profile-details">
        <h2>Name: {user.username}</h2>
        <p>ID: {user.id}</p>
        <p>Role: {user.role}</p>
      </div>
    </div>
  );
}

export default Profile;

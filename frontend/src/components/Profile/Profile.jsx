/* eslint-disable no-unused-vars */
import "./profile.css";
import { BsPersonCircle } from "react-icons/bs";
import { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
function Profile() {
  const [user, setUser] = useState({});
  // Capitalize the first letter of each word in the username
  const capitalizeFun = (username) => {
    if (typeof username !== "string" || username.trim() === "") {
      return ""; // Return an empty string if username is not a string or empty
    }
    return username
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

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
        <BsPersonCircle size="100px" />
      </div>
      <div>
        <h2>{capitalizeFun(user.username)}</h2>

        <div className="profile-details">
          <p>ID: {user.id}</p>
          <p>Role: {capitalizeFun(user.role)}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;

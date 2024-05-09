/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import "./nav.css";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useUserData } from "../../Context/UserRoleContext";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const [navDropDownMenu, setNavDropDownMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [chatToggle, setChatToggle] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate;
  function logout() {
    try {
      Cookies.remove("credentials");
      window.location.href = "/login";
    } catch (error) {
      console.log(error);
    }
  }
  const user = useUserData();

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setDarkMode(theme === "dark" ? true : false);
    setChatToggle(false);
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setNavDropDownMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  return (
    <header className="nav-bar">
      <nav>
        <img src="logo.svg" alt="" />
        <button
          className="chat-rooms-togggle"
          onClick={() => {
            setChatToggle((prev) => {
              const toggleVal = prev ? "show" : "hide";
              document.querySelector("body").setAttribute("res", toggleVal);
              return !prev;
            });
          }}
        >
          <GiHamburgerMenu size="35px" color="white" className="nav-icon" />
        </button>
        <h1>LH Chat</h1>
        <div className="user-container">
          <div className="nav-btns">
            <div
              className="user-profile"
              onClick={() => {
                setNavDropDownMenu((prev) => !prev);
              }}
            >
              <p>{user === null ? "" : user.username[0]}</p>
            </div>
            <button
              className="theme-btn"
              onClick={() => {
                setDarkMode((prev) => {
                  const themeVal = prev ? "light" : "dark";
                  localStorage.setItem("theme", themeVal);
                  document
                    .querySelector("body")
                    .setAttribute("data-theme", themeVal);
                  return !prev;
                });
              }}
            >
              {darkMode ? (
                <MdLightMode size="40px" />
              ) : (
                <MdDarkMode size="40px" />
              )}
            </button>
          </div>
        </div>
        {navDropDownMenu ? (
          <div className="nav-drop-down-menu" ref={dropdownRef}>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li onClick={logout}>Log out</li>
          </div>
        ) : (
          ""
        )}
      </nav>
    </header>
  );
}

export default NavBar;

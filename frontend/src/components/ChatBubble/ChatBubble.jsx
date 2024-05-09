/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import "./chat-bubble.css";
import { CiMenuKebab } from "react-icons/ci";
import { LuArrowBigUpDash } from "react-icons/lu";
import UserInfoModel from "../UserInfoModel/UserInfoModel";
import ReportModal from "../RoportModal/ReportModal";
import axios from "axios";
import { useUserData } from "../../Context/UserRoleContext";
import { useAddQuestion } from "../../Context/qustionQueue";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

function ChatBubble({
  isCurrent,
  message,
  name,
  votes,
  timestamp,
  reference,
  messageId,
}) {
  const [dropDownMenu, setDropDownMenu] = useState(false);
  const [userInfoModel, setUerInfoModel] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [messageVotes, setMessageVotes] = useState(votes);
  const userData = useUserData();
  const addQuestion = useAddQuestion();

  const getTime = () => {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const min = date.getMinutes();
    return hour + ":" + min;
  };

  const openCloseModel = () => {
    setUerInfoModel((prev) => !prev);
  };
  const openCloseReportModal = () => {
    setReportModal((prev) => !prev);
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropDownMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // vote a message
  async function voteMessage() {
    try {
      const res = await api.get("/api/c/vote", {
        params: { userId: userData.id, messageId: messageId },
      });
      setMessageVotes(res.data.voteCount);
      alert("Voted");
    } catch (error) {
      alert(error.response.data.error);
    }
  }
  // end vote a message
  return (
    <div
      className={
        isCurrent ? "chat-bubble-container current" : "chat-bubble-container"
      }
      ref={reference}
    >
      <div className={isCurrent ? "chat-bubble current-bubble" : "chat-bubble"}>
        <div className="chat-bubble-about">
          <p className="person-name">{isCurrent ? "Me" : name}</p>
          <button
            className="chat-bubble-menu"
            onClick={() => {
              setDropDownMenu((prev) => !prev);
            }}
          >
            <CiMenuKebab color="white" />
          </button>
          {dropDownMenu ? (
            <div className="drop-down-menu" ref={dropdownRef}>
              <li onClick={openCloseModel}>About</li>
              <li onClick={voteMessage}>Vote</li>
              <li onClick={openCloseReportModal}>Report</li>
              <li
                onClick={() => {
                  const messageContent = {
                    messageId,
                    message,
                    timestamp,
                    name,
                  };
                  addQuestion(messageContent);
                }}
              >
                Add
              </li>
            </div>
          ) : (
            ""
          )}
        </div>
        <p className="chat-bubble-message">{message}</p>
        <div className="bubble-bottom">
          <p className="votes">
            {messageVotes}
            <span>
              <LuArrowBigUpDash size="18px" />
            </span>
          </p>
          <p className="msg-bubble-time">{getTime()}</p>
        </div>
      </div>
      {userInfoModel ? (
        <UserInfoModel
          name={name}
          onClose={openCloseModel}
          time={getTime()}
          votes={votes}
          Id={messageId}
        />
      ) : (
        <></>
      )}
      {reportModal ? (
        <ReportModal
          name={name}
          onClose={openCloseReportModal}
          message={message}
          messageId={messageId}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default ChatBubble;

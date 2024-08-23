/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import "./chat-area.css";
import ChatBubble from "../ChatBubble/ChatBubble";
import { IoSendSharp, IoAttach } from "react-icons/io5";
import { CiMenuKebab } from "react-icons/ci";
import { FaLock } from "react-icons/fa";
import { useUserData } from "../../Context/UserRoleContext";
import { BsArrowDownCircleFill } from "react-icons/bs";
import { RxLapTimer } from "react-icons/rx";
import io from "socket.io-client";
import axios from "axios";
import { useChatId, useUpdateChatId } from "../../Context/ChatRoomContext";
import { useDeleteQuestion, useGetQuestion } from "../../Context/qustionQueue";

const socket = io(import.meta.env.VITE_API_BASE_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

function ChatsArea() {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [dropMenu, setDropMenu] = useState();
  const [timer, setTimer] = useState(false);
  const [queueVisible, setQueueVisible] = useState(false);
  const lastElement = useRef(null);

  const updateChatId = useUpdateChatId();
  const chatRoomData = useChatId();
  const user = useUserData();
  const getQuestions = useGetQuestion();

  function leaveChatRoom() {
    updateChatId(null);
  }
  async function postMessage() {
    try {
      const res = await api.post("api/c/", {
        sender: user.id,
        content: message,
        chatRoom: chatRoomData.id,
      });
    } catch (error) {
      console.log(error);
    }
  }
  function addChats() {
    socket.emit("sendMessage", {
      roomId: chatRoomData.id,
      content: message,
      sender: user.username,
      timestamp: Date.now(),
      votes: 0,
    });
    postMessage();
  }
  async function getChats() {
    if (chatRoomData != null) {
      try {
        const res = await api.get("api/c/", {
          params: { id: chatRoomData.id },
        });
        setChats(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  }
  useEffect(() => {
    getChats();
    socket.emit("joinRoom", chatRoomData.id);

    socket.on("receiveMessage", (message) => {
      setChats((prev) => {
        return [
          ...prev,
          {
            sender: { username: message.sender },
            isCurrent: true,
            content: message.content,
            votes: message.votes,
            timestamp: message.timestamp,
          },
        ];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    getChats();
    socket.emit("joinRoom", chatRoomData.id);
  }, [chatRoomData]);

  useEffect(() => {
    if (lastElement.current) {
      lastElement.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);
  const chatScrollDown = () => {
    if (lastElement.current) {
      lastElement.current.scrollIntoView({ behavior: "smooth" });
    }
  }; // chats down button
  return (
    <section className="chatroom">
      <div className="chat-room-nav">
        <h3>{chatRoomData.subject}</h3>
        <button
          className="chat-room-menu"
          onClick={() => {
            setDropMenu((prev) => {
              return !prev;
            });
          }}
        >
          <CiMenuKebab size="20px" />
        </button>
        {dropMenu ? (
          <div className="chat-drop-down-menu">
            <li onClick={leaveChatRoom}>Leave</li>
            <li
              onClick={() => {
                setQueueVisible(true);
              }}
            >
              Q-Queue
            </li>
          </div>
        ) : (
          ""
        )}
      </div>
      <button className="chat-down-btn" onClick={chatScrollDown}>
        <BsArrowDownCircleFill size="30px" />
      </button>
      <div className="chats-area">
        {chats.map((data, index) => {
          return (
            <ChatBubble
              messageId={data._id}
              isCurrent={data.sender.username === user.username ? true : false}
              key={index}
              name={data.sender.username}
              message={data.content}
              votes={data.votes.length === null ? 0 : data.votes.length}
              reference={index === chats.length - 1 ? lastElement : null}
              timestamp={data.timestamp}
            />
          );
        })}
      </div>

      <div className="type-area-container">
        <div className="type-area">
          {user.role === "student" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!timer) {
                  addChats();
                  setMessage("");
                } else {
                  alert("wait");
                }

                setTimer(true);
                setTimeout(() => {
                  setTimer(false);
                }, 5000);
              }}
            >
              <input
                type="text"
                placeholder="type here..."
                className="type-area-text-field"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
              <div className="send-container">
                <button
                  type="submit"
                  value="send"
                  className="submit-btn"
                  disabled={message === "" ? true : false}
                >
                  <button type="submit" value="send" className="submit-btn">
                    <IoAttach size="30px" />
                  </button>
                  {timer ? (
                    <RxLapTimer size="30px"  />
                  ) : (
                    <IoSendSharp size="30px"  />
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="block-chat">
              <p className="block-chat-desc">
                <span>
                  <FaLock />
                </span>
                You cannot message as a Lecturer
              </p>
            </div>
          )}
        </div>
      </div>
      {queueVisible ? (
        <div className="messages-queue">
          <div className="modal-content">
            <h3>
              Messages Queue
              <span
                className="close"
                onClick={() => {
                  setQueueVisible(false);
                }}
              >
                &times;
              </span>
            </h3>

            {getQuestions.map((data, index) => {
              return (
                <QueueMesageComp
                  key={index}
                  id={data.messageId}
                  message={data.message}
                  timestamp={data.timestamp}
                  name={data.name}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <></>
      )}
    </section>
  );
}

function QueueMesageComp({ id, message, timestamp, name }) {
  const deleteQuestion = useDeleteQuestion();
  const getTime = () => {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const min = date.getMinutes();
    return hour + ":" + min;
  };
  return (
    <div className="message-container">
      <p>{name}</p>
      <p>{message}</p>
      <p>{getTime()}</p>
      <span
        className="close"
        onClick={() => {
          deleteQuestion(id);
        }}
      >
        &times;
      </span>
    </div>
  );
}
export default ChatsArea;

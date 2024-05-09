/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import "./chat-rooms.css";
import { useState, useEffect } from "react";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { CgAddR } from "react-icons/cg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUpdateChatId } from "../../Context/ChatRoomContext";
import { useUserData } from "../../Context/UserRoleContext";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

function ChatRooms() {
  const [chatRooms, setChatRooms] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [searchWord, setSearchWord] = useState("");

  const userData = useUserData();
  const navigate = useNavigate();
  const fetchChatRooms = async () => {
    try {
      const res = await api.get("/api/rooms/my/all");
      setChatRooms(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const createNewChatRoom = () => {
    navigate("/chatroom/createnew");
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  useEffect(() => {
    setFilterData(filteredData);
  }, [searchWord, chatRooms]);

  const filteredData = chatRooms.filter((item) => {
    if (searchWord === "") {
      return item;
    } else {
      return item.subject.toLowerCase().includes(searchWord);
    }
  });

  return (
    <section className="chatrooms-section">
      <div className="chat-room-head">
        <input
          type="text"
          placeholder="search chat rooms here"
          className="chat-box-search"
          onChange={(e) => {
            setSearchWord(e.target.value);
          }}
        />

        {userData != null ? (
          userData.role === "lecturer" ? (
            <button
              className="create-new-chat-room"
              onClick={createNewChatRoom}
            >
              <CgAddR size="25px" />
            </button>
          ) : (
            <></>
          )
        ) : (
          ""
        )}
      </div>
      <div className="chat-rooms">
        {filterData.map((data, index) => {
          return (
            <ChatRoomComponent
              key={index}
              subject={data.subject}
              _id={data._id}
              creator={data.creator.username}
            />
          );
        })}
      </div>
    </section>
  );
}

function ChatRoomComponent({ subject, _id, creator }) {
  const updateChatId = useUpdateChatId();
  const [selectedRoom, setSelectedRoom] = useState(false);
  const [deleteChatRoom, setdeleteChatRoom] = useState(false);

  const chatRoomLoad = () => {
    updateChatId({ id: _id, subject });
    setSelectedRoom((prev) => !prev);
  };
  function deleteRoom() {
    setdeleteChatRoom((prev) => !prev);
  }
  return (
    <div
      className={
        selectedRoom
          ? "selected-component chat-room-container"
          : "chat-room-container"
      }
    >
      <div className="chatroom-header">
        <p className="title">Subject - {subject}</p>
        <button className="toggle-btn" onClick={chatRoomLoad}>
          <FaArrowRightFromBracket size="20px" />
        </button>
      </div>
      <div className="chatroom-body">
        <div>
          <p className="lec-name">
            Lecturer - {creator === undefined ? "You" : creator}
          </p>
          <p className="id">ID - {_id}</p>
        </div>
        {creator === undefined ? (
          <button className="toggle-btn" onClick={deleteRoom}>
            <MdDelete size="20px" />
          </button>
        ) : (
          <></>
        )}
      </div>
      {deleteChatRoom ? (
        <DeleteModal onClose={deleteRoom} roomName={subject} id={_id} />
      ) : (
        <></>
      )}
    </div>
  );
}
function DeleteModal({ onClose, roomName, id }) {
  const [confirmation, setconfirmation] = useState(null);

  async function deleteFormSubmit() {
    if (confirmation.toLowerCase() == "confirm") {
      try {
        const res = await api.delete(`/api/rooms/${id}`);
        alert(res.data.message);
        onClose;
      } catch (error) {
        console.log(error.response.data);
      }
    } else {
      alert("cannot delete chat room type confirm correctly");
    }
  }
  return (
    <div className="delete-modal-container">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Chat room Delete</h2>
        <div className="user-details">
          <p>Chat room name: {roomName}</p>
          <p>ID: {id}</p>
        </div>
        <form
          className="delete-form"
          onSubmit={(e) => {
            e.preventDefault();
            deleteFormSubmit();
          }}
        >
          <input
            type="text"
            placeholder="type 'confirm' here"
            className="confirm-delete"
            onChange={(e) => {
              setconfirmation(e.target.value);
            }}
          />
          <button type="submit" className="delete-btn">
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}
export default ChatRooms;

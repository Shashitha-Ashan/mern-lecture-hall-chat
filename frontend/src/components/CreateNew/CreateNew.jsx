import { useState } from "react";
import "../Login/login.css";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
function CreateNew() {
  const [name, setName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [error, setError] = useState("");

  const createNewChatRoom = async () => {
    try {
      const res = await api.post("api/rooms/createnew", {
        name,
        passcode,
        year: selectedYear,
      });
      console.log(res.data);
      setError("Chat room created");
      setName("");
      setPasscode("");
      setSelectedYear("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="main-conatiner">
      <h1>Create a new Chat room</h1>
      {error !== null ? <div className="error">{error}</div> : ""}
      <div className="login-page-container">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            createNewChatRoom();
          }}
        >
          <input
            type="text"
            placeholder="Subject name"
            onChange={(event) => {
              setName(event.target.value);
            }}
            required
            value={name}
          />
          <input
            type="text"
            placeholder="Enter passcode"
            onChange={(event) => {
              setPasscode(event.target.value);
            }}
            required
            value={passcode}
          />
          <select
            name="year"
            id="year"
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
            }}
          >
            <option value="">--- Select year ---</option>
            <option value="19/20">19/20</option>
            <option value="20/21">20/21</option>
            <option value="21/22">21/22</option>
            <option value="22/23">22/23</option>
          </select>
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );
}

export default CreateNew;

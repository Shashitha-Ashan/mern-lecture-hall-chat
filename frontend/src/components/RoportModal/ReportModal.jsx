/* eslint-disable react/prop-types */
import { useState } from "react";
import "../UserInfoModel/user-info-model.css";
import axios from "axios";

// api/user/reportuser
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
function ReportModal({ onClose, name, message, messageId }) {
  const [result, setresult] = useState(null);
  const [reason, setreason] = useState("");
  async function reportSubmit() {
    try {
      const res = await api.post("/api/user/reportuser", {
        messageid: messageId,
        reason,
      });
      console.log(res);
      setresult(res.data.message);
    } catch (error) {
      setresult(error.message);
      console.log(error);
    }
  }
  const resonOnClick = (e) => {
    setreason(e.target.value);
  };
  return (
    <div className="modal">
      <div className="modal-content">
        {result === null ? <></> : <p>{result}</p>}
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Report user</h2>
        <div className="user-details">
          <p>Name: {name}</p>
          <p>Message: {message}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              reportSubmit();
            }}
          >
            <input
              value="This is spam"
              type="radio"
              id="spam"
              name="issue"
              onClick={resonOnClick}
            />
            <label htmlFor="spam"> This is spam</label>
            <br />

            <input
              value="This is abusive or harmful"
              type="radio"
              id="abusive"
              name="issue"
              onChange={resonOnClick}
            />
            <label htmlFor="abusive"> This is abusive or harmful</label>
            <br />

            <input
              value="Hate speech"
              type="radio"
              id="hate"
              name="issue"
              onClick={resonOnClick}
            />
            <label htmlFor="hate">Hate speech</label>
            <br />

            <input
              value="Other issues"
              type="radio"
              id="other"
              name="issue"
              onClick={resonOnClick}
            />
            <label htmlFor="other"> Other issues</label>
            <br />

            <button type="submit" className="button">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReportModal;

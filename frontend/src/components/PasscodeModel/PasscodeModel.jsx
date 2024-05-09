/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import "./passcode-model.css";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

function PasscodeModel({}) {
  const [passcode, setPasscode] = useState("");

  return (
    <div className="model-container">
      <div className="passcode-header">
        <h2>Enter passcode</h2>
      </div>
      <form>
        <input
          type="text"
          className="passcode-box"
          value={passcode}
          onChange={(e) => {
            setPasscode(e.target.value);
          }}
        />
        <button disabled={passcode !== "" ? false : true} type="submit">
          OK
        </button>
      </form>
    </div>
  );
}

export default PasscodeModel;

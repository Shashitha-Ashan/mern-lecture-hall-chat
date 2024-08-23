/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import "./adminpanel.css";
import { MdDelete, MdModeEdit, MdDisabledByDefault } from "react-icons/md";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
function AdminPanel() {
  const [users, setusers] = useState([]);
  const [reports, setReports] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [searchWord, setSearchWord] = useState("");

  async function getAllUsers() {
    try {
      const res = await api.get("api/admin/allusers");
      setusers(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  async function getAllReports() {
    try {
      const res = await api.get("api/admin/allreports");
      setReports(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getAllUsers();
    getAllReports();
  }, []);
  useEffect(() => {
    setFilterData(filteredData);
  }, [searchWord, users]);
  const filteredData = users.filter((item) => {
    if (searchWord === "") {
      return item;
    } else {
      return item.username.toLowerCase().includes(searchWord);
    }
  });
  return (
    <div className="main-container">
      <div className="users-panel">
        <input
          type="text"
          placeholder="Search here"
          onChange={(e) => {
            setSearchWord(e.target.value);
          }}
        />
        {filterData.map((data, index) => {
          return (
            <UserComponent
              name={data.username}
              timeStamp={data.lastLogin}
              Id={data._id}
              role={data.role}
              email={data.email}
              key={index}
            />
          );
        })}
      </div>
      <div className="right-side-container">
        <div className="report-container">
          <table>
            <caption>Message Reports</caption>
            <tr>
              <th>Reporter name</th>
              <th>Respondent name</th>
              <th>Message</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Resolve/Not</th>
            </tr>
            {reports.map((data, index) => {
              return (
                <ReportComponent
                  reporterName={data.reporterid.username}
                  timeStamp={data.created_at}
                  Id={data.messageid.content}
                  reason={data.reason}
                  respodant={data.messageid.sender.username}
                  key={index}
                  resolve={data.resolve}
                />
              );
            })}
          </table>
        </div>
        <div className="lecturer-reg-container">
          <LecturerRegister />
        </div>
      </div>
    </div>
  );
}

function UserComponent({ name, timeStamp, Id, role, email }) {
  function displayTime() {
    const date = new Date(timeStamp);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    const formattedDateTime = `${formattedDate} ${formattedTime}`;
    return formattedDateTime;
  }
  return (
    <div className="user-main-container">
      <div className="user-info">
        <h4>Name - {name}</h4>
        <p>Role - {role}</p>
        <p>ID - {Id}</p>
        <p>Email - {email}</p>
        <p>Last login - {displayTime()}</p>
      </div>
      <div className="actions">
        <button>
          <MdDisabledByDefault size="25px" />
        </button>
        <button>
          <MdDelete size="25px" />
        </button>
        <button>
          <MdModeEdit size="25px" />
        </button>
      </div>
    </div>
  );
}
function ReportComponent({
  reporterName,
  timeStamp,
  Id,
  reason,
  respodant,
  resolve,
}) {
  return (
    <tr>
      <td>
        <p>{reporterName} </p>
      </td>
      <td>
        <p>{respodant} </p>
      </td>
      <td>
        <p>{Id} </p>
      </td>
      <td>
        <p>{timeStamp} </p>
      </td>
      <td>
        <p>{reason} </p>
      </td>
      <td>
        <p>{resolve ? "Yes" : "No"} </p>
      </td>
      <td>{resolve ? <></> : <button>Resolve</button>}</td>
    </tr>
  );
}

function LecturerRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const handleLogin = async () => {
    try {
      const res = await api.post("/api/user/register", {
        username,
        email,
        password,
        role: "lecturer",
      });
      setError(res.data.message);
      setEmail("");
      setPassword("");
      setUsername("");
    } catch (error) {
      setError("error");
      console.log(error);
    }
  };
  return (
    <div className="main-reg-container">
      <div className="reg-page-container">
        <h1>Lecturer Register</h1>
        {error !== null ? <div className="error">{error}</div> : ""}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleLogin();
          }}
        >
          <input
            type="email"
            placeholder="Email or index No"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            required
            value={email}
          />
          <input
            type="text"
            placeholder="User name"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            required
            value={username}
          />
          <input
            type="text"
            placeholder="Password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            value={password}
            required
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}
export default AdminPanel;

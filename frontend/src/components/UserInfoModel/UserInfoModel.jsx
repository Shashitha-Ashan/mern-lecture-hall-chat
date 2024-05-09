/* eslint-disable react/prop-types */
import "./user-info-model.css";

function UserInfoModel({ onClose, name, time, votes, Id }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Member Details</h2>
        <div className="user-details">
          <p>Name: {name}</p>
          <p>Id: {Id}</p>
          <p>Time: {time}</p>
          <p>Votes: {votes}</p>
        </div>
      </div>
    </div>
  );
}

export default UserInfoModel;

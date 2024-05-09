import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserRoleProvider } from "./Context/UserRoleContext";
import { ChatIdProvider } from "./Context/ChatRoomContext.jsx";
import { QuestionQueueProvider } from "./Context/qustionQueue.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <UserRoleProvider>
    <ChatIdProvider>
      <QuestionQueueProvider>
        <App />
      </QuestionQueueProvider>
    </ChatIdProvider>
  </UserRoleProvider>

  // </React.StrictMode>,
);

/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";

export const ChatIdContext = createContext();
export const UpdateChatIdContext = createContext();

export function useChatId() {
  return useContext(ChatIdContext);
}
export function useUpdateChatId() {
  return useContext(UpdateChatIdContext);
}

export function ChatIdProvider({ children }) {
  const [chatId, setChatId] = useState(null);

  function updateChatId(id) {
    setChatId(id);
  }
  useEffect(() => {}, [chatId]);
  return (
    <ChatIdContext.Provider value={chatId}>
      <UpdateChatIdContext.Provider value={updateChatId}>
        {children}
      </UpdateChatIdContext.Provider>
    </ChatIdContext.Provider>
  );
}

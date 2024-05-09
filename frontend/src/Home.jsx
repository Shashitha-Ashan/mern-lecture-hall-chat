import NavBar from "./components/NavBar/NavBar";
import ChatRooms from "./components/ChatRooms/ChatRooms";
import IntroPage from "./pages/IntroPage";
import ChatsArea from "./components/ChatsArea/ChatsArea";
import { useChatId } from "./Context/ChatRoomContext";

function Home() {
  const chatId = useChatId();
  return (
    <>
      <NavBar />
      <main>
        <ChatRooms />
        <hr />
        {chatId === null ? <IntroPage /> : <ChatsArea />}
      </main>
    </>
  );
}

export default Home;

import { Button, Input, User } from "@nextui-org/react";
import {
  collection,
  doc,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { appStore } from "../../AppStore";

interface Chat {
  id: string;
  userId: string;
}

interface Message {
  text: string;
  createdAt: Date;
  sender: string;
}

const AdminChat = observer(() => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    const chatsRef = collection(appStore.db, "adminChat");
    onSnapshot(chatsRef, (snapshot) => {
      const loadedChats = snapshot.docs.map((doc) => ({
        id: doc.id,
        userId: doc.id,
      }));
      setChats(loadedChats);
    });
  }, []);

  const selectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };
  useEffect(() => {
    if (selectedChatId) {
      const chatRef = doc(appStore.db, "adminChat", selectedChatId);
      onSnapshot(chatRef, (doc) => {
        if (doc.exists()) {
          setCurrentMessages(doc.data().messages || []);
        } else {
          setCurrentMessages([]);
        }
      });
    }
  }, [selectedChatId]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);
  const handleSendMessage = async () => {
    if (newMessage.trim() !== "" && selectedChatId) {
      const chatRef = doc(appStore.db, "adminChat", selectedChatId);
      await runTransaction(appStore.db, async (transaction) => {
        const chatDoc = await transaction.get(chatRef);
        const newMessageObj = {
          text: newMessage,
          createdAt: new Date(),
          sender: "admin",
        };

        let currentMessages = [];
        if (chatDoc.exists()) {
          currentMessages = chatDoc.data().messages || [];
        }

        transaction.set(
          chatRef,
          {
            currentUserEmail: appStore.currentUserEmail,
            messages: [...currentMessages, newMessageObj],
          },
          { merge: true },
        );
      });
      setNewMessage("");
    }
  };

  return (
    <div className="mx-20 flex justify-between rounded-md border p-4 pb-40 pt-28">
      <div className="w-1/3">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => selectChat(chat.id)}
            className="mb-4 flex content-center rounded-md border p-2"
          >
            <User
              name={chat.userId}
              avatarProps={{
                src: "https://avatars.githubusercontent.com/u/30373425?v=4",
              }}
            />
          </button>
        ))}
      </div>
      <div className="h-[650px] w-2/3 overflow-scroll rounded-md border p-4">
        {currentMessages.map((message, index) => (
          <p
            className={`mb-4 w-fit rounded-md border p-2 ${
              message.sender === "admin"
                ? "ml-auto bg-white text-stone-800"
                : "mr-auto bg-gray-600 text-white"
            }`}
            key={index}
          >
            {message.text}
          </p>
        ))}
        <div ref={messagesEndRef} />
        <div className="my-6 flex  items-center gap-4 md:mb-0 md:flex-nowrap">
          <Input
            type="email"
            variant="bordered"
            placeholder="輸入訊息"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />

          <Button
            className=" bg-stone-800 text-white"
            onClick={handleSendMessage}
          >
            傳送
          </Button>
        </div>
      </div>
    </div>
  );
});

export default AdminChat;

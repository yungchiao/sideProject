import { Button, Input } from "@nextui-org/react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { appStore } from "../../AppStore";

interface Chat {
  id: string;
  userId: string;
  avatar: string;
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
    onSnapshot(chatsRef, async (snapshot) => {
      const chatsWithAvatars = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const userId = doc.id;
          const avatarUrl = await getUserAvatar(userId);
          return {
            id: userId,
            userId: userId,
            avatar: avatarUrl,
          };
        }),
      );
      setChats(chatsWithAvatars);
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
  const getUserAvatar = async (email: any) => {
    const userRef = doc(appStore.db, "user", email);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data().avatar;
    }
    return "/bear.jpg";
  };
  return (
    <div className="h-screen-bg mx-20 flex justify-between  p-4 pb-10 pt-28">
      <div className="w-1/3">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => selectChat(chat.id)}
            className="mb-4 flex w-[300px] content-center items-center gap-4 rounded-md border-1 bg-white p-2"
          >
            <div className="flex  ">
              <div className="h-[40px] w-[40px] overflow-hidden rounded-full">
                <img src={chat.avatar} className="h-full w-full object-cover" />
              </div>
            </div>
            <p>{chat.userId}</p>
          </button>
        ))}
      </div>
      <div className=" w-2/3   ">
        <div className="h-[650px] overflow-scroll rounded-md border p-4">
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
        </div>

        <div className="my-6   flex items-center gap-4 md:mb-0 md:flex-nowrap">
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

import { Button, Input } from "@nextui-org/react";
import { doc, onSnapshot, runTransaction } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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
const Chat = observer(() => {
  const [message, setMessage] = useState("");

  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  useEffect(() => {
    if (!appStore.currentUserEmail) return;
    const chatRef = doc(appStore.db, "adminChat", appStore.currentUserEmail);
    onSnapshot(chatRef, (doc) => {
      if (doc.exists()) {
        setCurrentMessages(doc.data().messages || []);
      } else {
        setCurrentMessages([]);
      }
    });
  }, []);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);
  const sendMessage = async () => {
    if (message.trim() && appStore.currentUserEmail) {
      try {
        const userRef = doc(
          appStore.db,
          "adminChat",
          appStore.currentUserEmail,
        );
        const newMessage = {
          text: message,
          createdAt: new Date(),
          sender: "client",
        };

        await runTransaction(appStore.db, async (transaction) => {
          const chatDoc = await transaction.get(userRef);
          let currentMessages = chatDoc.data()?.messages || [];

          transaction.set(
            userRef,
            {
              messages: [...currentMessages, newMessage],
            },
            { merge: true },
          );
        });

        setMessage("");
      } catch (error) {
        console.error("傳送訊息失敗", error);
      }
    }
  };

  return (
    <>
      {appStore.currentUserEmail ? (
        <div className="  mx-20 p-10 pt-28">
          <div className="h-[650px] overflow-scroll rounded-md border p-4">
            {appStore.chats.map((chat) => (
              <div key={chat.id} className="flex flex-col">
                {chat.messages.map((msg: any, index: any) => (
                  <p
                    key={index}
                    className={`mb-4 w-fit rounded-md border p-2 ${
                      msg.sender === "client"
                        ? "ml-auto bg-white text-stone-800"
                        : "mr-auto bg-gray-600 text-white"
                    }`}
                  >
                    {msg.text}
                  </p>
                ))}
              </div>
            ))}
            {currentMessages.map((message, index) => (
              <p
                key={index}
                className={`mb-4 w-fit rounded-md border p-2 ${
                  message.sender === "client"
                    ? "ml-auto bg-white text-stone-800"
                    : "mr-auto bg-gray-600 text-white"
                }`}
              >
                {message.text}
              </p>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="my-8 flex w-full flex-wrap items-center gap-4 md:mb-0 md:flex-nowrap">
            <Input
              type="email"
              variant="bordered"
              placeholder="輸入訊息"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.repeat) {
                  e.preventDefault();
                  sendMessage();
                  setMessage("");
                }
              }}
            />
            <Button className="bg-stone-800 text-white" onClick={sendMessage}>
              傳送
            </Button>
          </div>
        </div>
      ) : (
        <div className="h-screen-bg  mx-40   flex items-center justify-center   text-center">
          <div className="block rounded-md border px-40 py-6">
            <h1 className="mb-4 text-3xl">登入後開始聊聊</h1>
            <Button>
              <Link to="/profile">登入</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
});

export default Chat;

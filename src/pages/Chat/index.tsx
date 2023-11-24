import { Button, Input } from "@nextui-org/react";
import { doc, onSnapshot, runTransaction } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
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
    <div className="mx-20 mt-28   rounded-md border p-4">
      <div>
        {appStore.chats.map((chat) => (
          <div key={chat.id}>
            {chat.messages.map((msg: any, index: any) => (
              <p key={index}>{msg.text}</p>
            ))}
          </div>
        ))}
        {currentMessages.map((message, index) => (
          <p
            className={`mb-4 w-fit rounded-md border p-2 ${
              message.sender === "client"
                ? "bg-gray-100 text-stone-800 "
                : "bg-gray-600 text-white"
            }`}
            key={index}
          >
            {message.text}
          </p>
        ))}
        <div className="my-6 flex w-full flex-wrap items-center gap-4 md:mb-0 md:flex-nowrap">
          <Input
            type="email"
            variant="bordered"
            placeholder="輸入訊息"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button className=" bg-stone-800 text-white" onClick={sendMessage}>
            傳送
          </Button>
        </div>
      </div>
    </div>
  );
});

export default Chat;

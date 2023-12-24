import { Button, Input } from "@nextui-org/react";
import { Timestamp, doc, onSnapshot, runTransaction } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { appStore } from "../../AppStore";
import { Message } from "../../type";

const Chat = observer(() => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (isSubmitting || !message.trim()) return;

    setIsSubmitting(true);
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
          avatar: appStore.newUser?.avatar,
        };

        await runTransaction(appStore.db, async (transaction) => {
          const chatDoc = await transaction.get(userRef);
          let currentMessages = chatDoc.data()?.messages || [];

          transaction.set(
            userRef,
            {
              currentUserEmail: appStore.currentUserEmail,
              messages: [...currentMessages, newMessage],
            },
            { merge: true },
          );
        });

        setMessage("");
      } catch (error) {
        console.error("傳送訊息失敗", error);
      }
      setIsSubmitting(false);
    }
  };
  const adminAvatar = "/bear.jpg";
  const userAvatar = appStore.newUser?.avatar || "/bear.jpg";

  const formatMessageTime = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter" && !event.isComposing && !isSubmitting) {
      event.preventDefault();
      sendMessage();
      setMessage("");
    }
  };
  return (
    <>
      {appStore.currentUserEmail ? (
        <div className="mx-20 p-10 pt-28">
          <div className="my-8 flex justify-center">
            <h1 className="text-3xl font-bold text-brown">客服聊聊</h1>
          </div>
          <div className="h-[700px] overflow-auto rounded-md border border-stone-700 p-4">
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
              <div
                key={index}
                className={`mb-4 w-fit rounded-md p-2 ${
                  message.sender === "client" ? "ml-auto " : "mr-auto "
                }`}
              >
                {message.sender === "client" ? (
                  <div className="flex items-center gap-2">
                    <div className="mt-7 text-xs text-gray-500">
                      {formatMessageTime(message.createdAt)}
                    </div>
                    <p
                      className={` w-fit rounded-md border p-2 ${
                        message.sender === "client"
                          ? "ml-auto bg-white text-stone-800"
                          : "mr-auto bg-gray-600 text-white"
                      }`}
                    >
                      {message.text}
                    </p>

                    <div>
                      <img
                        src={
                          message.sender === "client" ? userAvatar : adminAvatar
                        }
                        alt="Avatar"
                        className="h-12 w-12 rounded-full border border-stone-300"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div>
                      <img
                        src={
                          message.sender === "client" ? userAvatar : adminAvatar
                        }
                        alt="Avatar"
                        className="h-12 w-12 rounded-full border border-stone-300"
                      />
                    </div>
                    <p
                      className={` w-fit rounded-md border p-2 ${
                        message.sender === "client"
                          ? "ml-auto bg-white text-stone-800"
                          : "mr-auto bg-gray-600 text-white"
                      }`}
                    >
                      {message.text}
                    </p>

                    <div className="mt-7 text-xs text-gray-500">
                      {formatMessageTime(message.createdAt)}
                    </div>
                  </div>
                )}
              </div>
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
              onKeyDown={handleKeyDown}
            />
            <Button className="bg-stone-800 text-white" onClick={sendMessage}>
              傳送
            </Button>
          </div>
        </div>
      ) : (
        <div className="mx-40  flex   h-[100vh] items-center justify-center   text-center">
          <div className="block rounded-md border px-40 py-6">
            <h1 className="mb-4 text-3xl">登入後開始聊聊</h1>
            <Link to="/profile">
              <Button>登入</Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
});

export default Chat;

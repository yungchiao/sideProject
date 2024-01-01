import { Input } from "@nextui-org/react";
import { Timestamp, doc, onSnapshot, runTransaction } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { appStore } from "../../AppStore";
import { GlobalButton } from "../../components/Button";
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
        <div className="mx-8 pb-20 pt-28 sm:mx-4 md:px-4 lg:mx-20 lg:px-10">
          <div className="flex justify-center sm:my-4 md:my-8">
            <h1 className="font-bold text-brown  sm:text-xl md:text-3xl">
              客服聊聊
            </h1>
          </div>
          <div className="h-[700px] overflow-auto border-stone-700 p-4 sm:rounded-none sm:border-t sm:p-4 md:rounded-md md:border lg:border">
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
                      className={` w-fit max-w-[140px] rounded-md border p-2 md:w-auto md:max-w-none ${
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
                      className={` w-fit max-w-[140px] rounded-md border p-2 md:w-auto md:max-w-none ${
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

          <div className="my-8 flex w-full flex-nowrap items-center gap-4 md:mb-0 md:flex-nowrap">
            <Input
              type="email"
              variant="bordered"
              placeholder="輸入訊息"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <GlobalButton variant="gray" content="傳送" onClick={sendMessage} />
          </div>
        </div>
      ) : (
        <div className="flex h-screen w-full items-center justify-center text-center">
          <div className=" rounded-md border px-10 py-6 md:px-40">
            <h1 className="mb-4 text-xl md:text-3xl">登入後開始聊聊</h1>
            <GlobalButton variant="gray" content="登入" to="/profile" />
          </div>
        </div>
      )}
    </>
  );
});

export default Chat;

import { Button, Input } from "@nextui-org/react";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { appStore } from "../../AppStore";

interface Chat {
  id: string;
  userId: string;
  avatar: string;
}

interface Message {
  text: string;
  createdAt: Timestamp;
  sender: string;
  avatar: string;
}

const AdminChat = observer(() => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
    updateMessagesWithAvatars(chatId);
  };
  const updateMessagesWithAvatars = async (currentUserEmail: string) => {
    const chatRef = doc(appStore.db, "adminChat", currentUserEmail);
    const docSnap = await getDoc(chatRef);
    if (docSnap.exists()) {
      const messagesWithAvatars = await Promise.all(
        docSnap.data().messages.map(async (message: any) => {
          const avatarUrl = await getUserAvatar(
            message.sender === "admin" ? "admin email" : currentUserEmail,
          );
          return { ...message, avatar: avatarUrl };
        }),
      );
      setCurrentMessages(messagesWithAvatars);
    }
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
  const adminAvatar = "/bear-logo.png";

  const formatMessageTime = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  return (
    <>
      {appStore.currentUserEmail === "imadmin@gmail.com" ? (
        <>
          <div className=" mx-20 flex justify-between  p-4 pb-10 pt-28">
            <div className="w-1/3">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => selectChat(chat.id)}
                  className="mb-4 flex w-[300px] content-center items-center gap-4 rounded-md border-1 bg-white p-2"
                >
                  <div className="flex  ">
                    <div className="h-[40px] w-[40px] overflow-hidden rounded-full">
                      <img
                        src={chat.avatar}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <p>{chat.userId}</p>
                </button>
              ))}
            </div>
            <div className=" w-2/3   ">
              <div className="h-[750px] overflow-scroll rounded-md border p-4">
                {currentMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 w-fit rounded-md p-2 ${
                      message.sender === "admin" ? "ml-auto " : "mr-auto "
                    }`}
                  >
                    {message.sender === "admin" ? (
                      <div className="flex items-center gap-2">
                        <div className="mt-7 text-xs text-gray-500">
                          {formatMessageTime(message.createdAt)}
                        </div>
                        <p
                          className={` w-fit rounded-md border p-2 ${
                            message.sender === "admin"
                              ? "ml-auto bg-gray-600 text-white"
                              : "mr-auto  bg-white text-stone-800"
                          }`}
                        >
                          {message.text}
                        </p>

                        <div>
                          <img
                            src={
                              message.sender === "admin"
                                ? adminAvatar
                                : message.avatar
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
                              message.sender === "client"
                                ? message.avatar
                                : adminAvatar
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
        </>
      ) : (
        <div className="h-screen-bg  flex items-center justify-center pt-28">
          <div className="  rounded-md border px-40 py-6">
            <p className="text-3xl">
              只有 <span className="text-green">Admin</span> 身份可進入此頁面。
            </p>
            <div className="mt-4 flex justify-center">
              <Button>
                <Link to="/profile">以Admin身份登入</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default AdminChat;

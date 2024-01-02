import { Input } from "@nextui-org/react";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
  setDoc,
} from "firebase/firestore";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { appStore } from "../../AppStore";
import { GlobalButton } from "../../components/Button";
import { ChatRoom, Message } from "../../type";
import UserSearch from "../Post/UserSearch";
interface AdminChatProps {
  isSidebarOpen: boolean;
  isLargeScreen: boolean;
  toggleSidebarAndOverlay: () => void;
  handleClick: (event: any) => void;
}
const AdminChat: React.FC<AdminChatProps> = observer(
  ({ isSidebarOpen, toggleSidebarAndOverlay, isLargeScreen, handleClick }) => {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
    const [chats, setChats] = useState<ChatRoom[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
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
      if (isSubmitting || !newMessage.trim()) return;

      setIsSubmitting(true);
      if (newMessage.trim() !== "" && selectedChatId) {
        const chatRef = doc(appStore.db, "adminChat", selectedChatId);

        let senderAvatar = adminAvatar;
        if (appStore.currentUserEmail && selectedChatId !== "admin email") {
          senderAvatar = await getUserAvatar(appStore.currentUserEmail);
        }

        const newMessageObj = {
          text: newMessage,
          createdAt: new Date(),
          sender: "admin",
          avatar: senderAvatar,
        };

        await runTransaction(appStore.db, async (transaction) => {
          const chatDoc = await transaction.get(chatRef);
          let existingMessages = chatDoc.exists()
            ? chatDoc.data().messages || []
            : [];
          transaction.set(
            chatRef,
            { messages: [...existingMessages, newMessageObj] },
            { merge: true },
          );
        });

        setNewMessage("");
      }
      setIsSubmitting(false);
    };

    const handleKeyDown = (event: any) => {
      if (event.key === "Enter" && !event.shiftKey && !isSubmitting) {
        event.preventDefault();
        handleSendMessage();
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
    const adminAvatar = "/bear.jpg";

    const formatMessageTime = (timestamp: Timestamp) => {
      const date = timestamp.toDate();
      return date.toLocaleString("zh-TW", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };
    async function checkIfChatExists(userEmail: any) {
      const chatRef = doc(appStore.db, "adminChat", userEmail);
      const docSnap = await getDoc(chatRef);
      return docSnap.exists();
    }

    async function createNewChatWithUser(userEmail: any) {
      const chatRef = doc(appStore.db, "adminChat", userEmail);
      await setDoc(chatRef, {
        currentUserEmail: userEmail,
        messages: [],
      });
    }
    const handleSelectUser = async (userEmail: any) => {
      const existingChat = await checkIfChatExists(userEmail);
      if (existingChat) {
        selectChat(userEmail);
      }
      if (!existingChat) {
        await createNewChatWithUser(userEmail);
      }
    };
    return (
      <>
        {appStore.currentUserEmail === "imadmin@gmail.com" ? (
          <>
            <div className="mx-4 flex justify-between gap-4 p-4 pb-10 pt-28 lg:mx-20">
              <div
                className={`fixed left-0 top-0  z-50 h-[1100px] rounded-none bg-stone-200 p-4 transition-transform duration-300 xl:static xl:z-0  xl:h-[1000px] xl:rounded-xl ${
                  isSidebarOpen ? "translate-x-0" : "-translate-x-[500px]"
                } xl:relative xl:translate-x-0`}
                onClick={handleClick}
              >
                <div className="absolute left-[20px] top-[-40px] pb-28 pl-4 pt-28">
                  <UserSearch
                    onSelectUser={handleSelectUser}
                    showFollowButton={false}
                    userProfileClassName="search-client"
                  />
                </div>
                <div className="h-[750px] w-[400px] overflow-auto rounded-lg border p-4 pt-40">
                  {chats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => {
                        selectChat(chat.id);
                        !isLargeScreen ? toggleSidebarAndOverlay : undefined;
                      }}
                      className="trasition mb-4  flex w-[300px] content-center items-center gap-4 rounded-md border bg-white p-2 duration-200 hover:border-2 hover:border-yellow"
                    >
                      <div className="flex  ">
                        <div className="h-[40px] w-[40px] overflow-hidden rounded-full ">
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
              </div>

              <div className=" w-full   ">
                <h1 className="my-10 flex justify-center text-3xl font-bold text-brown">
                  後台聊天室
                </h1>
                <div className="h-[750px] overflow-auto border-stone-700 p-4 sm:rounded-none sm:border-t sm:p-4 md:rounded-md md:border lg:border">
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
                            className={`w-fit max-w-[140px] rounded-md border p-2 md:w-auto md:max-w-none ${
                              message.sender === "admin"
                                ? "ml-auto bg-gray-600 text-white"
                                : "mr-auto  bg-white text-stone-800"
                            }`}
                          >
                            {message.text}
                          </p>

                          <div className="h-12 w-12">
                            <img
                              src={
                                message.sender === "admin"
                                  ? adminAvatar
                                  : message.avatar
                              }
                              alt="Avatar"
                              className="h-full w-full rounded-full border border-stone-300 object-cover "
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="h-12 w-12">
                            <img
                              src={
                                message.sender === "client"
                                  ? message.avatar
                                  : adminAvatar
                              }
                              alt="Avatar"
                              className="h-full w-full rounded-full border border-stone-300 object-cover "
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

                <div className="my-6   flex items-center gap-4 md:mb-0 md:flex-nowrap">
                  <Input
                    type="email"
                    variant="bordered"
                    placeholder="輸入訊息"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <GlobalButton
                    variant="gray"
                    content="傳送"
                    onClick={handleSendMessage}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-screen w-full items-center justify-center text-center">
            <div className=" rounded-md border px-10 py-6 md:px-40">
              <p className="text:xl md:text-3xl">
                只有 <span className="text-green">Admin</span>{" "}
                身份可進入此頁面。
              </p>
              <div className="mt-4 flex justify-center">
                <GlobalButton
                  variant="gray"
                  content="以Admin身份登入"
                  to="/profile"
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  },
);

export default AdminChat;

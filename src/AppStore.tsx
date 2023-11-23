import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Auth,
  User,
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  Firestore,
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  FirebaseStorage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { configure, makeAutoObservable } from "mobx";
import { v4 } from "uuid";
configure({
  enforceActions: "never",
});
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}
interface Admin {
  id: string;
  name: string;
  position: string;
  price: number;
  images: string;
  hashtags: [];
  startTime: Timestamp;
  endTime: Timestamp;
  content: string;
  isLiked?: boolean;
}
interface NewUser {
  avatar: string;
  email: string;
  following: string[];
  followers: string[];
  id: string;
  name: string;
}

export interface UserFollow {
  id: string;
  userName: string;
  userEmail: string;
}

class AppStore {
  config: FirebaseConfig = {
    apiKey: "AIzaSyA69gAsOHrnfSdhKmKQniLUVExD9Kz8QK0",
    authDomain: "gravity-fd062.firebaseapp.com",
    projectId: "gravity-fd062",
    storageBucket: "gravity-fd062.appspot.com",
    messagingSenderId: "835366327544",
    appId: "1:835366327544:web:6b68f2b9e5101c5eb2d70d",
    measurementId: "G-X55F254YTP",
  };

  app: FirebaseApp;
  db: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
  activities: any[] = [];
  userActivities: any[] = [];
  admins: any[] = [];
  cart: any[] = [];
  searchResults: UserFollow[] = [];
  followingList: string[] = [];
  chats: any[] = [];
  currentUserEmail = null;
  currentAdminId = null;
  constructor() {
    this.app = initializeApp(this.config);
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
    this.storage = getStorage(this.app);
    makeAutoObservable(this);
    this.setupAuthListener();
  }

  setupAuthListener(): void {
    onAuthStateChanged(this.auth, async (user: User | null) => {
      if (user) {
        const newUser: NewUser = {
          id: user.uid,
          email: user.email ?? "",
          avatar: "",
          following: [],
          followers: [],
          name: "",
        };
        this.newUser = newUser;
        this.setCurrentUser(user.email);
      } else {
        this.newUser = null;
        this.setCurrentUser(null);
      }
    });
  }
  async newCart(email: string, cartItem: any) {
    const userRef = doc(this.db, "user", email);

    try {
      await runTransaction(this.db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw new Error("用戶不存在");
        }
        const existingCartItems = userDoc.data().cartItems || [];
        transaction.update(userRef, {
          cartItems: [...existingCartItems, cartItem],
        });
      });
    } catch (error) {
      console.error("添加到購物車失敗", error);
    }
  }
  async newLike(email: string, likeItem: any) {
    const userRef = doc(this.db, "user", email);

    try {
      await runTransaction(this.db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw new Error("用戶不存在");
        }
        const existingLikeItems = userDoc.data().likeItems || [];
        transaction.update(userRef, {
          likeItems: [...existingLikeItems, likeItem],
        });
      });
    } catch (error) {
      console.error("收藏失敗", error);
    }
  }
  async deleteFromCart(email: string, cartItemId: string) {
    const userRef = doc(this.db, "user", email);

    try {
      await runTransaction(this.db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw new Error("用戶不存在");
        }
        const existingCartItems = userDoc.data().cartItems || [];
        const updatedCartItems = existingCartItems.filter(
          (item: any) => item.id !== cartItemId,
        );
        transaction.update(userRef, {
          cartItems: updatedCartItems,
        });
      });
    } catch (error) {
      console.error("刪除失敗", error);
    }
  }
  async deleteFromLike(email: string, likeItemId: string) {
    const userRef = doc(this.db, "user", email);

    try {
      await runTransaction(this.db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw new Error("用戶不存在");
        }
        const existingLikeItems = userDoc.data().likeItems || [];
        const updatedLikeItems = existingLikeItems.filter(
          (item: any) => item.id !== likeItemId,
        );
        transaction.update(userRef, {
          likeItems: updatedLikeItems,
        });
      });
    } catch (error) {
      console.error("刪除失敗", error);
    }
  }

  updateCartItemQuantity = async (
    email: any,
    cartItemId: any,
    newQuantity: any,
  ) => {
    const db = getFirestore();
    const userRef = doc(db, "user", email);

    try {
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw new Error("用戶不存在");
        }

        const newCartItems = userDoc
          .data()
          .cartItems.map((item: any) =>
            item.id === cartItemId ? { ...item, quantity: newQuantity } : item,
          );

        transaction.update(userRef, { cartItems: newCartItems });
      });
    } catch (error) {
      console.error("更新購物車失敗", error);
    }
  };

  newUser: NewUser | null = null;
  addUser = async (
    uid: string,
    email: string,
    name: string,
    imageFile: File,
  ) => {
    try {
      const imageUrl = await this.uploadImage(imageFile);

      const newUser: NewUser = {
        avatar: imageUrl,
        email: email,
        following: [],
        followers: [],
        id: uid,
        name: name,
      };

      const docRef = doc(this.db, "user", email);
      await setDoc(docRef, newUser);

      this.newUser = newUser;
    } catch (error) {
      console.error("加入用戶失敗", error);
    }
  };
  uploadImage = async (imageUpload: File): Promise<string> => {
    try {
      if (!imageUpload) throw new Error("未選取圖片");

      const imageRef = ref(this.storage, `images/${imageUpload.name + v4()}`);
      await uploadBytes(imageRef, imageUpload);
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error("上傳圖片失敗", error);
      throw error;
    }
  };
  logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.newUser = null;
    });
    alert("登出成功！");
  }
  fetchActivities = async () => {
    const db = getFirestore();
    const activitiesCollection = collection(db, "activity");

    onSnapshot(activitiesCollection, (snapshot) => {
      const updatedActivities = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      this.activities = updatedActivities;
    });
  };
  fetchUserData = async (userId: string) => {
    const db = getFirestore();
    const userRef = doc(db, "user", userId);

    try {
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        this.newUser = userSnap.data() as NewUser;
      } else {
        console.log("查無此人");
      }
    } catch (error) {
      console.error("獲取用戶數據失敗", error);
    }
  };
  fetchUserActivities = async () => {
    const db = getFirestore();
    const querySnapshot = await getDocs(
      query(
        collection(db, "activity"),
        where("id", "==", appStore.currentUserEmail),
      ),
    );
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    this.userActivities = posts;
  };

  fetchCart = async (email: any) => {
    const db = getFirestore();
    const userRef = doc(db, "user", email);
    try {
      const docSnapshot = await getDoc(userRef);
      if (docSnapshot.exists()) {
        const userCartItems = docSnapshot.data().cartItems || [];
        return userCartItems;
      } else {
        return [];
      }
    } catch (error) {
      console.error("獲取購物車資訊失敗", error);
      return [];
    }
  };
  fetchLike = async (email: any) => {
    const db = getFirestore();
    const userRef = doc(db, "user", email);
    try {
      const docSnapshot = await getDoc(userRef);
      if (docSnapshot.exists()) {
        const userLikeItems = docSnapshot.data().likeItems || [];
        return userLikeItems;
      } else {
        return [];
      }
    } catch (error) {
      console.error("獲取收藏清單資訊失敗", error);
      return [];
    }
  };
  setAdmins = (newAdmins: Admin[]) => {
    this.admins = newAdmins;
  };
  fetchAdmin = async () => {
    const db = getFirestore();
    const adminsCollection = collection(db, "admin");

    onSnapshot(adminsCollection, (snapshot) => {
      const updatedAdmins = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      this.admins = updatedAdmins;
    });
  };

  deleteAdmin = async (id: any) => {
    try {
      await deleteDoc(doc(this.db, "admin", id));

      this.admins = this.admins.filter((admin) => admin.id !== id);
    } catch (error) {
      console.error("刪除失敗", error);
    }
  };
  setSearchResults(users: UserFollow[]) {
    this.searchResults = users;
  }

  async followUser(userToFollow: string) {
    if (!this.newUser) return;
    this.newUser.following.push(userToFollow);

    const userRef = doc(this.db, "user", this.newUser.email);
    await updateDoc(userRef, {
      following: this.newUser.following,
    });
  }
  async addFollowUser(userToFollowEmail: string) {
    if (!this.newUser) return;

    const currentUserRef = doc(this.db, "user", this.newUser.id);

    const userToFollowRef = doc(this.db, "user", userToFollowEmail);

    try {
      const currentUserSnap = await getDoc(currentUserRef);
      if (currentUserSnap.exists()) {
        await updateDoc(currentUserRef, {
          following: [...currentUserSnap.data().following, userToFollowEmail],
        });
      }

      const userToFollowSnap = await getDoc(userToFollowRef);
      if (userToFollowSnap.exists()) {
        await updateDoc(userToFollowRef, {
          followers: [...userToFollowSnap.data().followers, this.newUser.email],
        });
      }
    } catch (error) {
      console.error("追蹤失敗", error);
    }
  }

  async unfollowUser(userToUnfollow: string) {
    if (!this.newUser) return;
    this.newUser.following = this.newUser.following.filter(
      (email) => email !== userToUnfollow,
    );

    const userRef = doc(this.db, "user", this.newUser.email);
    await updateDoc(userRef, {
      following: this.newUser.following,
    });
  }

  async searchUsers(searchTerm: string) {
    const usersCol = collection(this.db, "user");
    const q = query(usersCol, where("email", "==", searchTerm));
    const querySnapshot = await getDocs(q);

    const users: UserFollow[] = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        userName: doc.data().name,
        userEmail: doc.data().email,
      } as UserFollow);
    });

    this.searchResults = users;
  }
  setCurrentUser(userEmail: any) {
    this.currentUserEmail = userEmail;
  }

  setCurrentAdmin(adminId: any) {
    this.currentAdminId = adminId;
  }
  fetchChats() {
    const userEmail = this.currentUserEmail;
    if (!userEmail) {
      this.chats = [];
      return;
    }

    const chatRef = doc(this.db, "adminChat", userEmail);

    onSnapshot(chatRef, (doc) => {
      if (doc.exists()) {
        this.chats = [{ id: doc.id, ...doc.data() }];
      } else {
        this.chats = [];
      }
    });
  }

  async sendMessage(text: string) {
    const userEmail = this.currentUserEmail;
    if (!userEmail) return;
    const chatRef = doc(this.db, "adminChat", userEmail);

    await runTransaction(this.db, async (transaction) => {
      const chatDoc = await transaction.get(chatRef);
      const newMessage = {
        timestamp: new Date().toISOString(),
        text: text,
      };

      let currentMessages = [];
      if (chatDoc.exists()) {
        currentMessages = chatDoc.data().messages || [];
      }

      transaction.set(
        chatRef,
        {
          currentUserEmail: userEmail,
          messages: [...currentMessages, newMessage],
        },
        { merge: true },
      );
    });
  }
}

export const appStore = new AppStore();
export const storage = appStore.storage;

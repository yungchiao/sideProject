import { initializeApp } from "firebase/app";
import { Timestamp, getFirestore } from "firebase/firestore";
const FirebaseConfig = {
  apiKey: "AIzaSyCsbG3z6fvFeIAyFsTwmSSy4jPv_d96SwE",
  authDomain: "gravity-backup.firebaseapp.com",
  projectId: "gravity-backup",
  storageBucket: "gravity-backup.appspot.com",
  messagingSenderId: "768371795119",
  appId: "1:768371795119:web:6c3d74024f70aaf236605a",
  measurementId: "G-KSYGS2KYFY",
};

const app = initializeApp(FirebaseConfig);
const db = getFirestore(app);
export { db };
export interface Admin {
  id: string;
  name: string;
  place: string;
  price: number;
  images: string;
  hashtags: [];
  startTime: Timestamp;
  endTime: Timestamp;
  content: string;
  isLiked?: boolean;
  latitude: string;
  position: string;
  longitude: string;
}

export interface CartItem {
  name: string;
  quantity: number;
  price: number;
  id: string;
  latitude: string;
  longitude: string;
}

export interface CheckoutItem {
  name: string;
  quantity: number;
  price: number;
  latitude: string;
  longitude: string;
}

export interface LikeItem {
  id: string;
  name: string;
  images: string;
  position: string;
  price: number;
  startTime: Timestamp;
  endTime: Timestamp;
}

export interface ActivityType {
  id: string;
  name: string;
  imagesFile: File;
  price: number;
  content: string;
  hashtags: { [key: string]: string };
  latitude: string;
  longitude: string;
  startTime: Timestamp;
  endTime: Timestamp;
  images: string;
  place: string;
  direction: string;
}

export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

export interface ChatRoom {
  id: string;
  userId: string;
  avatar: string;
}

export interface Message {
  text: string;
  createdAt: Timestamp;
  sender: string;
  avatar: string;
}

export interface ActivityCardProps {
  activity: {
    postId: string;
    avatar: string;
    id: string;
    name: string;
    weather: string;
    content: string;
    image: string;
    hashtags: string[];
    createdAt: Timestamp;
    userName: string;
  };
  customAvatar?: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

export interface NewUser {
  avatar: string;
  email: string;
  following: string[];
  followers: string[];
  id: string;
  name: string;
}

export interface About {
  history: string;
  activities: string;
  attendants: string;
  images: string[];
  image: string;
  subsidy: string;
  descriptions: string[];
  description: string;
}

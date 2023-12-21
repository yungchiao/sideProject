import { Timestamp } from "firebase/firestore";

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

export interface Chat {
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

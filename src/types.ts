export interface ProfileData {
  _id: string;
  username: string;
  name: string;
  bio: string;
  profileImage: string | null;
  friends: { _id: string }[];
  blocked: { _id: string }[];
}

export interface Notification {
  _id: string;
  message: string;
  type: 'chatroom_invite' | 'friend_request' | 'new_message';
  chatroomId?: string;
  date: string;
  read: boolean;
  sender?: {
    _id: string;
    username: string;
    email: string;
    profileImage: string;
    name?: string;
  };
}

// Define and export ChatRoom interface
export interface ChatRoom {
  _id: string;
  name: string;
  originator: string;
  members: string[];
  isPublic: boolean;
  latestMessage?: {
    text: string;
    timestamp: string;
    language?: string; // Add this line
  };
  hasUnreadMessages?: boolean;
}

export interface Message {
  _id?: string;
  sender: string;
  text: string;
  language: string;
  chatroomId: string;
  timestamp?: string;
  type?: "system" | "user" | "qr";
  readBy?: string[];
  reactions?: string[];
  repliedTo?: string | null; // Include repliedTo field for message replies
  edited?: boolean; // Add this line
}

export interface Member {
  _id: string;
  username: string;
  profileImage: string;
  name: string;
}

export interface Friend {
  _id: string;
  username: string;
  email: string;
  profileImage: string;
  name?: string;
}

export interface FriendRequest {
  sender: Friend;
  status: 'pending' | 'accepted' | 'rejected';
}

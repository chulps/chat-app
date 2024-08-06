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

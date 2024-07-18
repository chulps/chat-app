export interface ProfileData {
    _id: string;
    username: string;
    name: string;
    bio: string;
    profileImage: string | null;
    friends: { _id: string }[];
    blocked: { _id: string }[];
  }
  
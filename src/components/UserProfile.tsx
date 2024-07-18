import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getEnv } from "../utils/getEnv";
import ProfileView from "./ProfileView";
import { ProfileData } from "../types"; // Import the ProfileData type

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const [profile, setProfile] = useState<ProfileData>({
    _id: "",
    username: "",
    name: "",
    bio: "",
    profileImage: null,
    friends: [],
    blocked: [],
  });
  const [error, setError] = useState<string | null>(null);
  const { getToken, user } = useAuth();
  const { apiUrl } = getEnv();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/profile/${userId}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (response.data) {
          const friendsList = response.data.friends.map((friend: any) =>
            typeof friend === "string" ? { _id: friend } : friend
          );
          setProfile({
            _id: response.data._id,
            username: response.data.username || "",
            name: response.data.name || "",
            bio: response.data.bio || "",
            profileImage: response.data.profileImage || null,
            friends: friendsList,
            blocked: response.data.blocked || [],
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to fetch profile data.");
      }
    };

    if (userId) fetchProfile();
  }, [userId, getToken, apiUrl]);

  useEffect(() => {
    console.log("Profile friends list:", profile.friends);
    console.log("Logged-in user ID:", user?.id);
  }, [profile.friends, user?.id]);

  const isInContacts = profile.friends.some(
    (friend) => friend._id === user?.id
  );
  const isBlocked = profile.blocked.some((blocked) => blocked._id === user?.id);

  console.log("isInContacts:", isInContacts);
  console.log("isBlocked:", isBlocked);

  const handleSendFriendRequest = async () => {
    try {
      await axios.post(
        `${apiUrl}/api/profile/${userId}/add-contact`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      console.log("Friend request sent successfully");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleSendMessage = () => {
    // Handle send message logic
  };

  const handleRemoveContact = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/profile/${userId}/remove-contact`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      const updatedFriends = response.data.userFriends.map((friend: any) =>
        typeof friend === "string" ? { _id: friend } : friend
      );
      setProfile((prevProfile) => ({
        ...prevProfile,
        friends: updatedFriends,
      }));
    } catch (error) {
      console.error("Error removing contact:", error);
    }
  };

  const handleBlockUser = async () => {
    try {
      await axios.post(
        `${apiUrl}/api/profile/${userId}/block`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setProfile((prevProfile) => ({
        ...prevProfile,
        blocked: [...prevProfile.blocked, { _id: user?.id || "" }],
      }));
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handleUnblockUser = async () => {
    try {
      await axios.post(
        `${apiUrl}/api/profile/${userId}/unblock`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setProfile((prevProfile) => ({
        ...prevProfile,
        blocked: prevProfile.blocked.filter(
          (blocked) => blocked._id !== userId
        ),
      }));
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };

  return (
    <div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <ProfileView
        profile={profile}
        isInContacts={isInContacts}
        isBlocked={isBlocked}
        handleSendFriendRequest={handleSendFriendRequest}
        handleSendMessage={handleSendMessage}
        handleRemoveContact={handleRemoveContact}
        handleBlockUser={handleBlockUser}
        handleUnblockUser={handleUnblockUser}
        apiUrl={apiUrl}
      />
    </div>
  );
};

export default UserProfile;

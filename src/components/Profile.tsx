import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getEnv } from "../utils/getEnv";
import ProfileView from "./ProfileView";
import { ProfileData } from "../types"; // Import the ProfileData type

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const [profile, setProfile] = useState<ProfileData>({
    _id: "", // Add _id property
    username: "",
    name: "",
    bio: "",
    profileImage: null,
    friends: [],
    blocked: [],
  });
  const { getToken, user } = useAuth();
  const { apiUrl } = getEnv();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/profile/${userId}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (response.data) {
          setProfile({
            _id: response.data._id,
            username: response.data.username || "",
            name: response.data.name || "",
            bio: response.data.bio || "",
            profileImage: response.data.profileImage || null,
            friends: response.data.friends || [],
            blocked: response.data.blocked || [],
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [userId, getToken, apiUrl]);

  const isInContacts = profile.friends.some(friend => friend._id === user?.id);
  const isBlocked = profile.blocked.some(blocked => blocked._id === user?.id);

  const handleSendFriendRequest = async () => {
    try {
      await axios.post(
        `${apiUrl}/api/profile/${userId}/add-contact`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      // Update profile contacts
      setProfile(prevProfile => ({
        ...prevProfile,
        friends: [...prevProfile.friends, { _id: userId! }]
      }));
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleSendMessage = () => {
    // Handle send message logic
  };

  const handleRemoveContact = async () => {
    try {
      await axios.post(
        `${apiUrl}/api/profile/${userId}/remove-contact`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      // Update profile contacts
      setProfile(prevProfile => ({
        ...prevProfile,
        friends: prevProfile.friends.filter(friend => friend._id !== userId)
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
      // Update profile blocked users
      setProfile(prevProfile => ({
        ...prevProfile,
        blocked: [...prevProfile.blocked, { _id: userId! }]
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
      // Update profile blocked users
      setProfile(prevProfile => ({
        ...prevProfile,
        blocked: prevProfile.blocked.filter(blocked => blocked._id !== userId)
      }));
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };

  return (
    <div>
      <ProfileView
        profile={profile}
        isInContacts={isInContacts}
        isBlocked={isBlocked}
        handleSendFriendRequest={handleSendFriendRequest}
        handleSendMessage={handleSendMessage}
        handleRemoveContact={handleRemoveContact}
        handleBlockUser={handleBlockUser}
        handleUnblockUser={handleUnblockUser}
        apiUrl={apiUrl} // Pass apiUrl prop
      />
    </div>
  );
};

export default Profile;

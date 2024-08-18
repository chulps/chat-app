import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getEnv } from "../utils/getEnv";
import Tabs, { Tab } from "./Tabs";
import {
  faAddressBook,
  faComments,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import ChatroomsTab from "./ChatroomsTab";
import ContactsTab from "./ContactsTab";
import SearchTab from "./SearchTab";
import { io, Socket } from "socket.io-client";
import { Friend, ChatRoom, Notification, FriendRequest } from "../types";
import { useLanguage } from "../contexts/LanguageContext";

const DashboardContainer = styled.div`
  position: relative;
`;

const DashboardProfileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding: var(--space-2);
  border-bottom: 1px solid var(--secondary);
`;

const ProfileImage = styled.img`
  width: calc(var(--space-3) + var(--space-2));
  height: calc(var(--space-3) + var(--space-2));
  border-radius: 50%;
  object-fit: cover;
`;

const ProfilePlaceholder = styled.div`
  width: calc(var(--space-3) + var(--space-2));
  height: calc(var(--space-3) + var(--space-2));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--secondary);
  color: var(--white);
  font-size: var(--font-size-large);
  font-weight: bold;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-size: var(--font-size-lg);
`;

const UserName = styled.p`
  color: var(--white);
`;

const Name = styled.small`
  color: var(--secondary);
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

const Dashboard: React.FC = () => {
  const [chatrooms, setChatrooms] = useState<ChatRoom[]>([]);
  const [filteredChatrooms, setFilteredChatrooms] = useState<ChatRoom[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [searchResults, setSearchResults] = useState<{
    users: Friend[];
    chatrooms: ChatRoom[];
  }>({ users: [], chatrooms: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const { apiUrl } = getEnv();
  const { getToken, user } = useAuth();
  const [newMessage, setNewMessage] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const { content } = useLanguage();
  const socket: Socket = io(apiUrl);

  const fetchChatrooms = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/chatrooms`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setChatrooms(response.data);
      setFilteredChatrooms(response.data);
      const hasUnreadMessages = response.data.some(
        (chatroom: ChatRoom) => chatroom.hasUnreadMessages
      );
      setNewMessage(hasUnreadMessages);
    } catch (error) {
      console.error("Error fetching chatrooms:", error);
    }
  }, [apiUrl, getToken]);

  const fetchFriends = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/friends`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setFriends(response.data.friends);
      setFilteredFriends(response.data.friends);
      setFriendRequests(response.data.friendRequests);
      const unreadFriendRequests = response.data.friendRequests.filter(
        (friendRequest: any) => friendRequest.status === "pending"
      ).length;
      setUnreadNotifications(unreadFriendRequests);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  }, [apiUrl, getToken]);

  const fetchSearchResults = useCallback(
    async (query: string) => {
      try {
        const response = await axios.get(`${apiUrl}/api/search`, {
          params: { query },
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    },
    [apiUrl, getToken]
  );

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const handleChatroomClick = (chatroomId: string) => {
    navigate(`/chatroom/${chatroomId}`);
  };

  const handleAcceptFriendRequest = async (senderId: string) => {
    try {
      await axios.post(
        `${apiUrl}/api/friends/accept-request`,
        { senderId },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      fetchFriends();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleRejectFriendRequest = async (senderId: string) => {
    try {
      await axios.post(
        `${apiUrl}/api/friends/reject-request`,
        { senderId },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      fetchFriends();
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  useEffect(() => {
    fetchChatrooms();
    fetchFriends();

    if (user) {
      socket.emit("joinNotificationsRoom", user.id);

      socket.on("newNotification", (notification: Notification) => {
        if (
          notification.type === "chatroom_invite" ||
          notification.type === "new_message"
        ) {
          fetchChatrooms();
        } else if (notification.type === "friend_request") {
          fetchFriends();
        }
        setUnreadNotifications((prev) => prev + 1);
      });

      socket.on("notificationsRead", () => {
        setUnreadNotifications(0);
      });
    }

    const interval = setInterval(() => {
      fetchChatrooms();
      fetchFriends();
    }, 30000);

    return () => {
      clearInterval(interval);
      socket.off("newNotification");
      socket.off("notificationsRead");
    };
  }, [fetchChatrooms, fetchFriends, user]);

  return (
    <DashboardContainer>
      {user && (
        <DashboardProfileHeader>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-1)",
            }}
          >
            {user.profileImage ? (
              <ProfileImage src={user.profileImage} alt={content["profile"]} />
            ) : (
              <ProfilePlaceholder>
                {user.username.charAt(0).toUpperCase()}
              </ProfilePlaceholder>
            )}
            <UserInfo>
              <UserName>@{user.username}</UserName>
              <Name>{user.name}</Name>
            </UserInfo>
          </div>
          <HeaderRight>
            <Tabs activeTab={activeTab} onTabClick={setActiveTab}>
              <Tab icon={faComments} badge={newMessage ? 1 : null} />
              <Tab
                icon={faAddressBook}
                badge={unreadNotifications > 0 ? unreadNotifications : null}
              />
              <Tab icon={faMagnifyingGlass} />
            </Tabs>
          </HeaderRight>
        </DashboardProfileHeader>
      )}
      <div style={{ marginTop: "var(--space-2)" }}>
        {activeTab === 0 && (
          <ChatroomsTab
            chatrooms={chatrooms}
            setChatrooms={setChatrooms}
            filteredChatrooms={filteredChatrooms}
            setFilteredChatrooms={setFilteredChatrooms}
            fetchChatrooms={fetchChatrooms}
            user={user}
            socket={socket}
          />
        )}
        {activeTab === 1 && (
          <ContactsTab
            friends={friends}
            filteredFriends={filteredFriends}
            setFilteredFriends={setFilteredFriends}
            friendRequests={friendRequests}
            handleAcceptFriendRequest={handleAcceptFriendRequest}
            handleRejectFriendRequest={handleRejectFriendRequest}
            user={user}
            socket={socket}
          />
        )}
        {activeTab === 2 && (
          <SearchTab
            apiUrl={apiUrl}
            searchResults={searchResults}
            handleUserClick={handleUserClick}
            handleChatroomClick={handleChatroomClick}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            fetchSearchResults={fetchSearchResults}
            setSearchResults={setSearchResults}
          />
        )}
      </div>
    </DashboardContainer>
  );
};

export default Dashboard;

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getEnv } from "../utils/getEnv";
import Tabs, { Tab } from "./Tabs";
import {
  faAddressBook,
  faComments,
  faBell,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import UserInfo from "./UserInfo";
import ChatroomsTab from "./ChatroomsTab";
import ContactsTab from "./ContactsTab";
import NotificationsTab from "./NotificationsTab";
import SearchTab from "./SearchTab";

interface ChatRoom {
  _id: string;
  name: string;
  originator: string;
  members: string[];
  isPublic: boolean;
}

interface Friend {
  _id: string;
  username: string;
  email: string;
  profileImage: string;
  name?: string;
}

interface FriendRequest {
  sender: Friend;
  status: string;
}

const DashboardContainer = styled.div`
  padding-top: var(--space-3);
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
  const navigate = useNavigate();

  const fetchChatrooms = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/chatrooms`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setChatrooms(response.data);
      setFilteredChatrooms(response.data);
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
  }, [fetchChatrooms, fetchFriends]);

  return (
    <DashboardContainer className="dashboard-container">
      {user && <UserInfo user={user} />}
      <Tabs>
        <Tab label="Chatrooms" icon={faComments}>
          <ChatroomsTab
            chatrooms={chatrooms}
            setChatrooms={setChatrooms}
            filteredChatrooms={filteredChatrooms}
            setFilteredChatrooms={setFilteredChatrooms}
          />
        </Tab>
        <Tab label="Contacts" icon={faAddressBook}>
          <ContactsTab
            friends={friends}
            filteredFriends={filteredFriends}
            setFilteredFriends={setFilteredFriends}
          />
        </Tab>
        <Tab label="Notifications" icon={faBell}>
          <NotificationsTab
            friendRequests={friendRequests}
            handleAcceptFriendRequest={handleAcceptFriendRequest}
            handleRejectFriendRequest={handleRejectFriendRequest}
          />
        </Tab>
        <Tab label="Search" icon={faMagnifyingGlass}>
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
        </Tab>
      </Tabs>
    </DashboardContainer>
  );
};

export default Dashboard;

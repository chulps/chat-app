import React from "react";
import styled from "styled-components";
import Tabs, { Tab } from "./Tabs";
import { faList, faUsers, faComments } from "@fortawesome/free-solid-svg-icons";

const SearchResults = styled.div`
  background-color: inherit;
  padding-top: var(--space-2);
  position: absolute;
  width: 100%;
  z-index: 1000;
  height: calc(100vh - 354px);
  overflow-y: auto;

  @media (min-width: 420px) {
    height: calc(100vh - 376px);
  }

  @media (min-width: 576px) {
    height: calc(100vh - 398px);
  }
`;

const SearchResultItem = styled.div`
  padding: var(--space-1);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-2);

  &:hover {
    background-color: var(--dark);
  }
`;

const ProfileImage = styled.img`
  width: calc(var(--space-3) + var(--space-2));
  aspect-ratio: 1/1;
  border-radius: 50%;
  object-fit: cover;
`;

const EmptyState = styled.p`
  color: var(--secondary);
`;

interface Friend {
  _id: string;
  username: string;
  email: string;
  profileImage: string;
  name?: string;
}

interface ChatRoom {
  _id: string;
  name: string;
  originator: string;
  members: string[];
  isPublic: boolean;
}

interface SearchTabProps {
  apiUrl: string;
  searchResults: {
    users: Friend[];
    chatrooms: ChatRoom[];
  };
  handleUserClick: (userId: string) => void;
  handleChatroomClick: (chatroomId: string) => void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  fetchSearchResults: (query: string) => void;
  setSearchResults: React.Dispatch<
    React.SetStateAction<{ users: Friend[]; chatrooms: ChatRoom[] }>
  >;
}

const SearchTab: React.FC<SearchTabProps> = ({
  apiUrl,
  searchResults,
  handleUserClick,
  handleChatroomClick,
  searchQuery,
  setSearchQuery,
  fetchSearchResults,
  setSearchResults,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      fetchSearchResults(query);
    } else {
      setSearchResults({ users: [], chatrooms: [] });
    }
  };

  return (
    <div>
      <h2>Search Users and Chatrooms</h2>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search by email, username, name, or chatroom"
      />

      {searchQuery === "" && (
        <EmptyState>Start typing to search users and chatrooms...</EmptyState>
      )}

      {searchQuery !== "" && (
        <SearchResults>
          <Tabs>
            <Tab label="All" icon={faList}>
              <div>
                <label>Users</label>
                {searchResults.users.length === 0 ? (
                  <EmptyState>No users match your search query</EmptyState>
                ) : (
                  searchResults.users.map((user) => (
                    <SearchResultItem
                      key={user._id}
                      onClick={() => handleUserClick(user._id)}
                    >
                      {user.profileImage && (
                        <ProfileImage
                          src={`${apiUrl}/${user.profileImage}`}
                          alt={user.username}
                        />
                      )}
                      <div>
                        @{user.username}
                        <br />
                        <small>
                          ({user.email}) {user.name && `- ${user.name}`}
                        </small>
                      </div>
                    </SearchResultItem>
                  ))
                )}
              </div>
              <div>
                <label>Chatrooms</label>
                {searchResults.chatrooms.length === 0 ? (
                  <EmptyState>No chatrooms match your search query</EmptyState>
                ) : (
                  searchResults.chatrooms.map((chatroom) => (
                    <SearchResultItem
                      key={chatroom._id}
                      onClick={() => handleChatroomClick(chatroom._id)}
                    >
                      {chatroom.name}
                    </SearchResultItem>
                  ))
                )}
              </div>
            </Tab>
            <Tab label="Users" icon={faUsers}>
              <div>
                <label>Users</label>
                {searchResults.users.length === 0 ? (
                  <EmptyState>No users match your search query</EmptyState>
                ) : (
                  searchResults.users.map((user) => (
                    <SearchResultItem
                      key={user._id}
                      onClick={() => handleUserClick(user._id)}
                    >
                      {user.profileImage && (
                        <ProfileImage
                          src={`${apiUrl}/${user.profileImage}`}
                          alt={user.username}
                        />
                      )}
                      <div>
                        @{user.username}
                        <small>
                          ({user.email}) {user.name && `- ${user.name}`}
                        </small>
                      </div>
                    </SearchResultItem>
                  ))
                )}
              </div>
            </Tab>
            <Tab label="Chatrooms" icon={faComments}>
              <div>
                <label>Chatrooms</label>
                {searchResults.chatrooms.length === 0 ? (
                  <EmptyState>No chatrooms match your search query</EmptyState>
                ) : (
                  searchResults.chatrooms.map((chatroom) => (
                    <SearchResultItem
                      key={chatroom._id}
                      onClick={() => handleChatroomClick(chatroom._id)}
                    >
                      {chatroom.name}
                    </SearchResultItem>
                  ))
                )}
              </div>
            </Tab>
          </Tabs>
        </SearchResults>
      )}
    </div>
  );
};

export default SearchTab;

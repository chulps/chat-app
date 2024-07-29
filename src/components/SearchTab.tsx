import React, { useState, useCallback, useEffect } from "react";
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

const EmptyState = styled.p`
  color: var(--secondary);
`;

const ChatroomSearchResults = styled.div`
  margin-top: var(--space-3);
`;

const UserSearchResults = styled.div`
  margin-top: var(--space-3);
`;

const UserName = styled.p`
  color: var(--white);
`;

const Name = styled.small`
  color: var(--secondary);
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BigSearch = styled.input`
  margin-block: var(--space-0);
  border-radius: var(--space-3);
  border: 1px solid var(--secondary);
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
  const [activeTab, setActiveTab] = useState(0);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    console.log('Search input changed:', query); // Log the search input value
    setSearchQuery(query);
    if (query) {
      console.log(`Fetching search results for query: ${query}`); // Debugging log
      fetchSearchResults(query);
    } else {
      console.log("Clearing search results"); // Debugging log
      setSearchResults({ users: [], chatrooms: [] });
    }
  };

  useEffect(() => {
    console.log(`Current search query: ${searchQuery}`); // Debugging log
  }, [searchQuery]);

  return (
    <div>
      <h4>Search Users and Chatrooms</h4>
      <p>Find your friends by email address, username, or their actual name. Only public chatrooms are visible by search.</p>
      <br/>
      <label htmlFor="big-search-input">Search</label>
      <BigSearch
        id="big-search-input"
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
          <Tabs activeTab={activeTab} onTabClick={setActiveTab}>
            <Tab label="All" icon={faList}>
              <UserSearchResults>
                <label>Users</label>
                {searchResults.users.length === 0 ? (
                  <EmptyState>No users match your search query</EmptyState>
                ) : (
                  searchResults.users.map((user) => (
                    <SearchResultItem
                      key={user._id}
                      onClick={() => handleUserClick(user._id)}
                    >
                      {user.profileImage ? (
                        <ProfileImage
                          src={`${apiUrl}/${user.profileImage}`}
                          alt={user.username}
                        />
                      ) : (
                        <ProfilePlaceholder>{user.username.charAt(0).toUpperCase()}</ProfilePlaceholder>
                      )}
                      <UserInfo>
                        <UserName>@{user.username}</UserName>
                        <Name>{user.name && `${user.name}`}</Name>
                      </UserInfo>
                    </SearchResultItem>
                  ))
                )}
              </UserSearchResults>
              <ChatroomSearchResults>
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
              </ChatroomSearchResults>
            </Tab>
            <Tab label="Users" icon={faUsers}>
              <UserSearchResults>
                <label>Users</label>
                {searchResults.users.length === 0 ? (
                  <EmptyState>No users match your search query</EmptyState>
                ) : (
                  searchResults.users.map((user) => (
                    <SearchResultItem
                      key={user._id}
                      onClick={() => handleUserClick(user._id)}
                    >
                      {user.profileImage ? (
                        <ProfileImage
                          src={`${apiUrl}/${user.profileImage}`}
                          alt={user.username}
                        />
                      ) : (
                        <ProfilePlaceholder>{user.username.charAt(0).toUpperCase()}</ProfilePlaceholder>
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
              </UserSearchResults>
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

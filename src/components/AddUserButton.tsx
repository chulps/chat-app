import React, { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext";
import { getEnv } from "../utils/getEnv";
import styled from "styled-components";

const AddFriendContainer = styled.div`
  position: relative;
`;

const AddFriendDropdown = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  right: 0;
  background: var(--dark);
  border: 1px solid var(--secondary);
  padding: 1em;
  width: var(--space-6);
  z-index: 1000;
  border-radius: 1em;
`;

const SearchBar = styled.input`
  width: 100%;
  margin-bottom: 0.5em;
  border: 1px solid var(--secondary);
  background: var(--dark);
  border-radius: 0.5em;
  color: var(--white);
`;

const ContactList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: var(--space-6);
  overflow-y: auto;
`;

const ContactItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.5em 0;
  cursor: pointer;
  background: var(--dark);

  &:hover {
    filter: brightness(1.3);
  }
`;

const ContactAvatar = styled.img`
  width: var(--space-3);
  height: var(--space-3);
  border-radius: 50%;
  margin-right: 0.5em;
  object-fit: cover;
`;

interface Member {
  _id: string;
  username: string;
  name: string;
  profileImage: string;
}

interface Contact extends Member {}

interface AddUserButtonProps {
  chatroomId: string;
  fetchMembers: () => void;
  members: Member[];
}

const AddUserButton: React.FC<AddUserButtonProps> = ({ chatroomId, fetchMembers, members }) => {
  const { apiUrl } = getEnv();
  const { getToken } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchContacts = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/friends/contacts`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setContacts(response.data.contacts);
      console.log("Fetched Contacts: ", response.data.contacts); // Debug log for fetched contacts
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  }, [apiUrl, getToken]);

  useEffect(() => {
    if (isDropdownOpen) {
      fetchContacts();
    }
  }, [isDropdownOpen, fetchContacts]);

  const handleAddContactToChatroom = async (contactId: string) => {
    try {
      await axios.post(
        `${apiUrl}/api/chatrooms/${chatroomId}/add-member`,
        { memberId: contactId },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setIsDropdownOpen(false);
      fetchMembers();
    } catch (error) {
      console.error("Error adding contact to chatroom:", error);
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      (contact.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !members.some((member) => member._id === contact._id)
  );

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, handleClickOutside]);

  return (
    <AddFriendContainer ref={dropdownRef}>
      <FontAwesomeIcon icon={faUserPlus} onClick={() => setIsDropdownOpen(!isDropdownOpen)} />
      <AddFriendDropdown isOpen={isDropdownOpen}>
        <SearchBar
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <ContactList>
          {filteredContacts.map((contact) => (
            <ContactItem key={contact._id} onClick={() => handleAddContactToChatroom(contact._id)}>
              {contact.profileImage && <ContactAvatar src={`${apiUrl}/${contact.profileImage}`} alt={contact.username} />}
              <div>
                <p>@{contact.username}</p>
                <small>{contact.name}</small>
              </div>
            </ContactItem>
          ))}
        </ContactList>
      </AddFriendDropdown>
    </AddFriendContainer>
  );
};

export default AddUserButton;

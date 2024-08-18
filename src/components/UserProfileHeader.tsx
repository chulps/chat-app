import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faPaperPlane, faUserMinus, faBan } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import ProfileSettingsMenu from "./ProfileSettingsMenu";
import { getEnv } from "../utils/getEnv";

const ProfileHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  justify-content: space-between;
  margin-top: var(--space-3);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

const ProfileImage = styled.img`
  width: calc(var(--space-2) + var(--space-3));
  height: calc(var(--space-2) + var(--space-3));
  border-radius: 50%;
  object-fit: cover;
  aspect-ratio: 1/1;
`;

const HeaderRight = styled.div`
  display: flex;
  gap: var(--space-2);
  align-items: center;
  aspect-ratio: 1/1;
  height: var(--space-3);

  & > *:hover {
    transform: scale(1.1);
  }
`;

const UserProfileHeader = ({
  profile,
  isInContacts,
  isBlocked,
  handleSendFriendRequest,
  handleSendMessage,
  handleRemoveContact,
  handleBlockUser,
  handleUnblockUser,
}: {
  profile: any;
  isInContacts: boolean;
  isBlocked: boolean;
  handleSendFriendRequest: () => void;
  handleSendMessage: () => void;
  handleRemoveContact: () => void;
  handleBlockUser: () => void;
  handleUnblockUser: () => void;
}) => {
  const { apiUrl } = getEnv();

  return (
    <ProfileHeaderContainer>
      <HeaderLeft>
        {profile.profileImage && (
          <ProfileImage
            src={`${profile.profileImage}`}
            alt="Profile"
          />
        )}
        <div>
          <h4>@{profile.username}</h4>
          <small>{profile.name}</small>
        </div>
      </HeaderLeft>
      <HeaderRight>
        {!isInContacts && (
          <FontAwesomeIcon icon={faUserPlus} onClick={handleSendFriendRequest} />
        )}
        <FontAwesomeIcon icon={faPaperPlane} onClick={handleSendMessage} />
        <ProfileSettingsMenu
          alignRight
          isInContacts={isInContacts}
          isBlocked={isBlocked}
          handleRemoveContact={handleRemoveContact}
          handleBlockUser={handleBlockUser}
          handleUnblockUser={handleUnblockUser}
        />
      </HeaderRight>
    </ProfileHeaderContainer>
  );
};

export default UserProfileHeader;

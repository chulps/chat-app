import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faPaperPlane, faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import ProfileSettingsMenu from "./ProfileSettingsMenu";
import { ProfileData } from "../types";

const ProfileContainer = styled.div`
  max-width: var(--space-7);
  margin: 0 auto;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

const ProfileBio = styled.div`
  padding-top: var(--space-3);
`;

const HeaderRight = styled.div`
  display: flex;
  gap: var(--space-2);
  align-items: center;
  cursor: pointer;

  & > *:hover {
    transform: scale(1.1);
  }

`;

const ProfileImage = styled.img`
  width: calc(var(--space-2) + var(--space-3));
  height: calc(var(--space-2) + var(--space-3));
  border-radius: 50%;
  object-fit: cover;
  aspect-ratio: 1/1;
`;

const FriendRequestStatus = styled.data`
  font-size: var(--font-size-small);
  color: var(--info);
`;

interface ProfileViewProps {
  profile: ProfileData;
  isInContacts: boolean;
  isBlocked: boolean;
  friendRequestStatus: "none" | "pending" | "accepted";
  handleSendFriendRequest: () => void;
  handleSendMessage: () => void;
  handleRemoveContact: () => void;
  handleBlockUser: () => void;
  handleUnblockUser: () => void;
  apiUrl: string;
}

const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  isInContacts,
  isBlocked,
  friendRequestStatus,
  handleSendFriendRequest,
  handleSendMessage,
  handleRemoveContact,
  handleBlockUser,
  handleUnblockUser,
  apiUrl,
}) => {
  useEffect(() => {
    console.log("Visiting user ID:", profile._id);
    console.log("My friends list:", profile.friends);
    const isFriend = profile.friends.some(friend => {
      console.log("Checking friend ID:", friend._id);
      return friend._id === profile._id;
    });
    console.log("Is friend:", isFriend);
  }, [profile]);

  return (
    <ProfileContainer>
      <ProfileInfo>
        <ProfileHeader>
          <HeaderLeft>
            {profile.profileImage && (
              <ProfileImage
                src={`${apiUrl}/${profile.profileImage}`}
                alt="Profile"
              />
            )}
            <div>
              <h4>@{profile.username}</h4>
              <small>{profile.name}</small>
            </div>
          </HeaderLeft>
          <HeaderRight>
            {friendRequestStatus === "none" && !isInContacts && (
              <FontAwesomeIcon icon={faUserPlus} onClick={handleSendFriendRequest} />
            )}
            {friendRequestStatus === "pending" && (
              <FriendRequestStatus>
                <FontAwesomeIcon icon={faClockRotateLeft} /> Friend request sent
              </FriendRequestStatus>
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
        </ProfileHeader>
        <ProfileBio>
          <label>Bio</label>
          <div>{profile.bio}</div>
        </ProfileBio>
      </ProfileInfo>
    </ProfileContainer>
  );
};

export default ProfileView;

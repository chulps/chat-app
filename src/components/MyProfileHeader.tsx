import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
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

const MyProfileHeader = ({
  profile,
  setIsEditing,
}: {
  profile: any;
  setIsEditing: (isEditing: boolean) => void;
}) => {
  const { apiUrl } = getEnv();

  return (
    <ProfileHeaderContainer>
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
      <button onClick={() => setIsEditing(true)}>Edit</button>
    </ProfileHeaderContainer>
  );
};

export default MyProfileHeader;

import React from "react";
import styled from "styled-components";
import { getEnv } from "../utils/getEnv";

const UserInfoContainer = styled.div`
  display: flex;
  align-items: center;
  padding: var(--space-2) 0;
  border-radius: var(--space-1);
`;

const UserProfileImage = styled.img`
  width: calc(var(--space-3) + var(--space-2));
  aspect-ratio: 1/1;
  border-radius: 50%;
  object-fit: cover;
  margin-right: var(--space-2);
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-size: var(--font-size-4);
  font-weight: bold;
`;

const UserUsername = styled.span`
  font-size: var(--font-size-2);
  color: var(--gray-500);
`;

interface UserInfoProps {
  user: {
    username: string;
    name?: string;
    profileImage?: string;
  };
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const { apiUrl } = getEnv();
  return (
    <UserInfoContainer>
      {user.profileImage && (
        <UserProfileImage
          src={`${apiUrl}/${user.profileImage}`}
          alt={user.username}
        />
      )}
      <UserDetails>
        <UserName>{user.name}</UserName>
        <UserUsername>@{user.username}</UserUsername>
      </UserDetails>
    </UserInfoContainer>
  );
};

export default UserInfo;

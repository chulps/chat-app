import React from "react";
import styled from "styled-components";
import { getEnv } from "../utils/getEnv";

const DashboardList = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;

  li {
    padding: 1em 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--secondary);
    &:first-of-type {
      border-top: none;
    }
  }
`;

const ProfileImage = styled.img`
  width: calc(var(--space-3) + var(--space-2));
  aspect-ratio: 1/1;
  border-radius: 50%;
  object-fit: cover;
`;

interface FriendRequest {
  sender: {
    _id: string;
    username: string;
    email: string;
    profileImage: string;
  };
  status: string;
}

interface NotificationsTabProps {
  friendRequests: FriendRequest[];
  handleAcceptFriendRequest: (senderId: string) => void;
  handleRejectFriendRequest: (senderId: string) => void;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({
  friendRequests,
  handleAcceptFriendRequest,
  handleRejectFriendRequest,
}) => {
  const { apiUrl } = getEnv();

  return (
    <div>
      <h2>Friend Requests</h2>
      <DashboardList>
        {friendRequests.map((request) => (
          <li key={request.sender._id}>
            {request.sender.profileImage && (
              <ProfileImage
                src={`${apiUrl}/${request.sender.profileImage}`}
                alt={`${request.sender.username}'s profile`}
              />
            )}
            {request.sender.username} ({request.sender.email})
            <button
              onClick={() => handleAcceptFriendRequest(request.sender._id)}
            >
              Accept
            </button>
            <button
              onClick={() => handleRejectFriendRequest(request.sender._id)}
            >
              Reject
            </button>
          </li>
        ))}
      </DashboardList>
    </div>
  );
};

export default NotificationsTab;

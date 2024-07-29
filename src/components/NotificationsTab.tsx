import React, { useEffect } from "react";
import styled from "styled-components";
import { getEnv } from "../utils/getEnv";
import { useNavigate } from "react-router-dom";

const NotificationsTabHeader = styled.header`
  font-size: var(--font-size-h4);
  padding-bottom: var(--space-2);
`;

const DashboardList = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;

  li {
    padding: 1em 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--dark);
    cursor: pointer;
    &:hover {
      background-color: var(--dark);
    }
  }
`;

const ProfileImage = styled.img`
  width: calc(var(--space-3) + var(--space-2));
  aspect-ratio: 1/1;
  border-radius: 50%;
  object-fit: cover;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: var(--space-1);

  button {
    font-size: var(--font-size-small);
  }
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-1);
`;

interface Notification {
  _id: string;
  message: string;
  type: string;
  chatroomId?: string;
  date: string;
  read: boolean;
}

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
  notifications: Notification[];
  markNotificationsAsRead: () => void;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({
  friendRequests,
  handleAcceptFriendRequest,
  handleRejectFriendRequest,
  notifications,
  markNotificationsAsRead,
}) => {
  const { apiUrl } = getEnv();
  const navigate = useNavigate();

  const handleNotificationClick = (notification: Notification) => {
    if (notification.chatroomId) {
      navigate(`/chatroom/${notification.chatroomId}`);
    }
  };

  useEffect(() => {
    markNotificationsAsRead();
  }, [markNotificationsAsRead]);

  return (
    <div>
      <NotificationsTabHeader>Notifications</NotificationsTabHeader>
      <DashboardList>
        {notifications.map((notification) => (
          <li key={notification._id} onClick={() => handleNotificationClick(notification)}>
            {notification.message}
          </li>
        ))}
        {friendRequests.map((request) => (
          <li key={request.sender._id}>
            <LeftContainer>
              {request.sender.profileImage && (
                <ProfileImage
                  src={`${apiUrl}/${request.sender.profileImage}`}
                  alt={`${request.sender.username}'s profile`}
                />
              )}
              <span><b>@{request.sender.username}</b> Wants to add you as a friend</span>
            </LeftContainer>
            <ButtonContainer>
              <button
                className="success small"
                onClick={() => handleAcceptFriendRequest(request.sender._id)}
              >
                Accept
              </button>
              <button
                className="secondary small"
                onClick={() => handleRejectFriendRequest(request.sender._id)}
              >
                Reject
              </button>
            </ButtonContainer>
          </li>
        ))}
      </DashboardList>
    </div>
  );
};

export default NotificationsTab;

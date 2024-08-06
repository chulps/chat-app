// Updated ChatRoomHeader.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ChatroomHeaderRightControls from "./ChatroomHeaderRightControls";
import styled from "styled-components";

const ChatroomHeaderContainer = styled.header`
  font-size: var(--font-size-h5);
  padding: 0.5em 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface Member {
  _id: string;
  username: string;
  name: string;
  profileImage: string;
}

interface ChatRoomHeaderProps {
  chatroomId: string;
  chatroomName: string;
  membersCount: number;
  qrCodeIsVisible: boolean;
  urlTooltipText: string;
  idTooltipText: string;
  content: any;
  preferredLanguage: string;
  handleCopyChatroomUrl: () => void;
  handleCopyChatroomId: () => void;
  handleShowQrCode: () => void;
  handleLeaveRoom: () => void;
  isAuthenticated: boolean;
  isOriginator: boolean;
  handleToggleIsPublic: () => void;
  isPublic: boolean;
  handleToggleShowOriginal: () => void;
  showOriginal: boolean;
  fetchChatrooms: () => void;
  members: Member[];
  fetchMembers: () => void;
}

const ChatRoomHeader: React.FC<ChatRoomHeaderProps> = ({
  chatroomId,
  chatroomName,
  membersCount,
  qrCodeIsVisible,
  urlTooltipText,
  idTooltipText,
  content,
  preferredLanguage,
  handleCopyChatroomUrl,
  handleCopyChatroomId,
  handleShowQrCode,
  handleLeaveRoom,
  isAuthenticated,
  isOriginator,
  handleToggleIsPublic,
  isPublic,
  handleToggleShowOriginal,
  showOriginal,
  fetchChatrooms,
  members,
  fetchMembers,
}) => {
  const navigate = useNavigate();

  return (
    <ChatroomHeaderContainer className="chatroom-header">
      <button
        data-tooltip={content["tooltip-exit-chatroom"]}
        className="back-button small tooltip bottom-right"
        style={{
          color: "var(--white)",
          background: "var(--dark)",
        }}
        onClick={() => navigate("/dashboard")}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        &nbsp;{content['back']}
      </button>
      <span>{chatroomName}</span>
      <ChatroomHeaderRightControls
        chatroomId={chatroomId}
        qrCodeIsVisible={qrCodeIsVisible}
        urlTooltipText={urlTooltipText}
        idTooltipText={idTooltipText}
        content={content}
        preferredLanguage={preferredLanguage}
        handleCopyChatroomUrl={handleCopyChatroomUrl}
        handleCopyChatroomId={handleCopyChatroomId}
        handleShowQrCode={handleShowQrCode}
        handleLeaveRoom={handleLeaveRoom}
        isAuthenticated={isAuthenticated}
        isOriginator={isOriginator}
        handleToggleIsPublic={handleToggleIsPublic}
        isPublic={isPublic}
        handleToggleShowOriginal={handleToggleShowOriginal}
        showOriginal={showOriginal}
        fetchChatrooms={fetchChatrooms}
        members={members}
        fetchMembers={fetchMembers}
      />
    </ChatroomHeaderContainer>
  );
};

export default ChatRoomHeader;

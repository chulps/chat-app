import React from "react";
import styled from "styled-components";
import AddUserButton from "./AddUserButton";
import QrCodeButton from "./QrCodeButton";
import CopyLinkButton from "./CopyLinkButton";
import ChatroomSettingsMenu from "./ChatroomSettingsMenu";

const RightControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1em;
`;

interface Member {
  _id: string;
  username: string;
  name: string;
  profileImage: string;
}

interface RightControlsProps {
  chatroomId: string;
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

const ChatroomHeaderRightControls: React.FC<RightControlsProps> = ({
  chatroomId,
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
  return (
    <RightControlsContainer>
      {isAuthenticated && <AddUserButton chatroomId={chatroomId} fetchMembers={fetchMembers} members={members} />}
      <QrCodeButton qrCodeIsVisible={qrCodeIsVisible} handleShowQrCode={handleShowQrCode} content={content} />
      <CopyLinkButton urlTooltipText={urlTooltipText} handleCopyChatroomUrl={handleCopyChatroomUrl} />
      {isAuthenticated && (
        <ChatroomSettingsMenu
          alignRight
          chatroomId={chatroomId}
          content={content}
          preferredLanguage={preferredLanguage}
          handleCopyChatroomId={handleCopyChatroomId}
          handleToggleIsPublic={handleToggleIsPublic}
          handleToggleShowOriginal={handleToggleShowOriginal}
          isPublic={isPublic}
          showOriginal={showOriginal}
          fetchChatrooms={fetchChatrooms}
          isOriginator={isOriginator}
          members={members}
          fetchMembers={fetchMembers}
        />
      )}
    </RightControlsContainer>
  );
};

export default ChatroomHeaderRightControls;

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faHashtag,
  faLink,
  faQrcode,
  faTimes,
  faLanguage,
  faEye,
  faEyeSlash,
  faGlobe,
  faLock,
  faUnlock
} from "@fortawesome/free-solid-svg-icons";
import ChatroomSettingsMenu from "./ChatroomSettingsMenu"; // Renamed DropdownMenu component
import ToggleSwitch from "./ToggleSwitch";
import styled from "styled-components";

const SettingsMenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1em;
  gap: var(--space-4);
`;

const MenuItemLeftContent = styled.div`
  display: flex;
  gap: var(--space-1);
  align-items: center;
`;

const MenuItemIcon = styled.div`
  display: flex;
  flex-shrink: 1;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;
`;

const MenuItemText = styled.div`
  display: flex;
  width: fit-content;
`;

interface ChatRoomHeaderProps {
  chatroomId: string;
  name: string;
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
}

const ChatRoomHeader: React.FC<ChatRoomHeaderProps> = ({
  chatroomId,
  name,
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
}) => {
  return (
    <div className="chatroom-header">
      <button
        data-tooltip={content["tooltip-exit-chatroom"]}
        className="back-button small tooltip bottom-right"
        style={{ color: "var(--danger-300)", background: "var(--dark)" }}
        onClick={handleLeaveRoom}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        &nbsp;{content["exit"]}
      </button>
      <span
        data-tooltip={idTooltipText}
        className="copy-id tooltip bottom"
        onClick={handleCopyChatroomId}
      >
        <FontAwesomeIcon icon={faHashtag} /> {chatroomId}
      </span>
      <span
        data-tooltip={content["tooltip-show-qrcode"]}
        className="show-qr-button small tooltip bottom"
        onClick={handleShowQrCode}
      >
        <FontAwesomeIcon icon={qrCodeIsVisible ? faTimes : faQrcode} />
        &nbsp;
        {content["QRCode"]}
      </span>
      <div className="chatroom-id-container">
        <data
          data-tooltip={urlTooltipText}
          className="copy-chatroom-url tooltip bottom-left"
          onClick={handleCopyChatroomUrl}
        >
          <FontAwesomeIcon icon={faLink} />
          &nbsp;
          {content["URL"]}
        </data>
      </div>
      {isAuthenticated && (
        <ChatroomSettingsMenu alignRight>
          {isOriginator && (
            <SettingsMenuItem>
              <MenuItemLeftContent>
                <MenuItemIcon>
                  <FontAwesomeIcon icon={faGlobe} />
                </MenuItemIcon>
                <MenuItemText>Public?</MenuItemText>
              </MenuItemLeftContent>
              <ToggleSwitch
                id="public-toggle"
                isOn={isPublic}
                handleToggle={handleToggleIsPublic}
                label={content["toggle-public"]}
                targetLanguage={preferredLanguage}
                onIcon={<FontAwesomeIcon icon={faUnlock} />}
                offIcon={<FontAwesomeIcon icon={faLock} />}
                onIconColor="var(--secondary)"
                offIconColor="var(--secondary)"
                onBackgroundColor="var(--dark)"
                offBackgroundColor="var(--dark)"
              />
            </SettingsMenuItem>
          )}
          <SettingsMenuItem>
            <MenuItemLeftContent>
              <MenuItemIcon>
                <FontAwesomeIcon icon={faLanguage} />
              </MenuItemIcon>
              <MenuItemText>Show&nbsp;original?</MenuItemText>
            </MenuItemLeftContent>
            <ToggleSwitch
              id="show-original-toggle"
              isOn={showOriginal}
              handleToggle={handleToggleShowOriginal}
              label={content["toggle-original"]}
              targetLanguage={preferredLanguage}
              onIcon={<FontAwesomeIcon icon={faEye} />}
              offIcon={<FontAwesomeIcon icon={faEyeSlash} />}
              onIconColor="var(--secondary)"
              offIconColor="var(--secondary)"
              onBackgroundColor="var(--dark)"
              offBackgroundColor="var(--dark)"
            />
          </SettingsMenuItem>
        </ChatroomSettingsMenu>
      )}
    </div>
  );
};

export default ChatRoomHeader;

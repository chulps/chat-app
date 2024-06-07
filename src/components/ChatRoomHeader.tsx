import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faHashtag,
  faLink,
  faQrcode,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

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
            {content['URL']}
        </data>
      </div>
    </div>
  );
};

export default ChatRoomHeader;

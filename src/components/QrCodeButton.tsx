import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode, faTimes } from "@fortawesome/free-solid-svg-icons";

interface QrCodeButtonProps {
  qrCodeIsVisible: boolean;
  handleShowQrCode: () => void;
  content: any;
}

const QrCodeButton: React.FC<QrCodeButtonProps> = ({ qrCodeIsVisible, handleShowQrCode, content }) => {
  return (
    <span
      data-tooltip={content["tooltip-show-qrcode"]}
      className="show-qr-button small tooltip bottom"
      onClick={handleShowQrCode}
    >
      <FontAwesomeIcon icon={qrCodeIsVisible ? faTimes : faQrcode} />
    </span>
  );
};

export default QrCodeButton;

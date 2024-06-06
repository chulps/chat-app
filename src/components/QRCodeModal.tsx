import React from "react";
import QRCodeMessage from "./QRCodeMessage";

interface QRCodeModalProps {
  chatroomUrl: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ chatroomUrl }) => {
  return (
    <div className="qr-code-modal">
      <QRCodeMessage url={chatroomUrl} />
    </div>
  );
};

export default QRCodeModal;

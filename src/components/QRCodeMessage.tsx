import React from 'react';
import QRCode from 'qrcode.react';

interface QRCodeMessageProps {
  url: string;
}

const QRCodeMessage: React.FC<QRCodeMessageProps> = ({ url }) => {
  return (
    <div className="qr-code-message">
      <QRCode value={url} />
    </div>
  );
};

export default QRCodeMessage;

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

interface CopyLinkButtonProps {
  urlTooltipText: string;
  handleCopyChatroomUrl: () => void;
}

const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({ urlTooltipText, handleCopyChatroomUrl }) => {
  return (
    <span
      data-tooltip={urlTooltipText}
      className="tooltip bottom-left"
      onClick={handleCopyChatroomUrl}
    >
      <FontAwesomeIcon icon={faLink} />
    </span>
  );
};

export default CopyLinkButton;

import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { getEnv } from "../utils/getEnv";

const FileInputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FileInputLabel = styled.label<{ backgroundImage?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--font-family-default);
  letter-spacing: unset;
  color: white;
  border: 1px solid var(--primary);
  text-transform: unset;
  line-height: var(--line-height-default);
  width: var(--space-5);
  aspect-ratio: 1/1;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  ${({ backgroundImage }) =>
    backgroundImage ? `background-image: url(${backgroundImage});` : ''};
  cursor: pointer;

  &:hover {
    background-color: var(--dark);
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ProfileImageSetup = styled.div<{ backgroundImage?: string }>`
  display: flex;
  align-items: center;
  gap: var(--space-1);
  flex-direction: column;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  ${({ backgroundImage }) =>
    backgroundImage ? `background-image: url(${backgroundImage});` : ''};

  svg {
    font-size: var(--font-size-h3);
  }
`;

interface ProfileImageUploadProps {
  profileImage: string | null;
  setImageFile: (file: File | null) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ profileImage, setImageFile }) => {
  const { apiUrl } = getEnv();

  return (
    <FileInputContainer>
      <FileInputLabel
        htmlFor="profileImage"
        backgroundImage={profileImage ? `${apiUrl}/${profileImage}` : undefined}
      >
        {!profileImage && (
          <ProfileImageSetup backgroundImage={undefined}>
            <FontAwesomeIcon icon={faCamera} />
            Choose photo
          </ProfileImageSetup>
        )}
      </FileInputLabel>
      <HiddenFileInput
        id="profileImage"
        type="file"
        accept="image/*"
        onChange={(e) =>
          setImageFile(e.target.files ? e.target.files[0] : null)
        }
      />
    </FileInputContainer>
  );
};

export default ProfileImageUpload;

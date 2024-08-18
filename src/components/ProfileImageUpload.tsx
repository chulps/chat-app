import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { getEnv } from "../utils/getEnv";

const FileInputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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

const Filename = styled.data`
  margin-top: var(--space-1);
  color: var(--secondary);
`;

interface ProfileImageUploadProps {
  profileImage: string | null;
  setImageFile: (file: File | null) => void;
  imageFile: File | null; // Add this prop to show the filename
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ profileImage, setImageFile, imageFile }) => {
  const { apiUrl } = getEnv();
  const [previewImage, setPreviewImage] = useState<string | null>(profileImage ? `${apiUrl}/${profileImage}` : null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <FileInputContainer>
      <FileInputLabel
        htmlFor="profileImage"
        backgroundImage={previewImage || (profileImage ? `${profileImage}` : undefined)}
      >
        {!previewImage && !profileImage && (
          <ProfileImageSetup>
            <FontAwesomeIcon icon={faCamera} />
            Choose photo
          </ProfileImageSetup>
        )}
      </FileInputLabel>
      <HiddenFileInput
        id="profileImage"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      {imageFile && <Filename>{imageFile.name}</Filename>}
    </FileInputContainer>
  );
};

export default ProfileImageUpload;

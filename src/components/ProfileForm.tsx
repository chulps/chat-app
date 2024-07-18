import React from "react";
import { FormEvent } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { getEnv } from "../utils/getEnv";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  padding-top: var(--space-2);
  align-items: center;
`;

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

const ProfileForm = ({
  profile,
  handleSave,
  setProfile,
  imageFile,
  setImageFile,
}: {
  profile: any;
  handleSave: (event: FormEvent<HTMLFormElement>) => void;
  setProfile: React.Dispatch<React.SetStateAction<any>>;
  imageFile: File | null;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
}) => {
  const { apiUrl } = getEnv();

  return (
    <Form onSubmit={handleSave}>
      <div>
        <FileInputContainer>
          <FileInputLabel
            htmlFor="profileImage"
            backgroundImage={
              profile.profileImage ? `${apiUrl}/${profile.profileImage}` : undefined
            }
          >
            {!profile.profileImage && (
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
      </div>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={profile.username}
          onChange={(e) =>
            setProfile({ ...profile, username: e.target.value })
          }
          placeholder="Username"
        />
      </div>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          placeholder="Name"
        />
      </div>
      <div>
        <label htmlFor="bio">Bio:</label>
        <input
          id="bio"
          type="text"
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          placeholder="Bio"
        />
      </div>
      <ButtonContainer className="button-container">
        <Link to="/dashboard">Skip</Link>
        <button type="submit">Save Profile</button>
      </ButtonContainer>
    </Form>
  );
};

export default ProfileForm;

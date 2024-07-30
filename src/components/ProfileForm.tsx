import React, { FormEvent } from "react";
import { ProfileData } from "../types";
import styled from "styled-components";
import { Link } from "react-router-dom";
import ProfileImageUpload from "./ProfileImageUpload";

const ProfileFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  @media screen and (min-width: 576px) {
    flex-direction: row-reverse;
    justify-content: space-between;
  }
`;

const SkipButton = styled(Link)`
  margin: 0 var(--space-2);
`;

interface ProfileFormProps {
  profile: ProfileData;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
  handleSave: (event: FormEvent<HTMLFormElement>) => void;
  imageFile: File | null;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, setProfile, handleSave, imageFile, setImageFile }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  return (
    <ProfileFormContainer onSubmit={handleSave}>
      <ProfileImageUpload profileImage={profile.profileImage} setImageFile={setImageFile} imageFile={imageFile} />
      <div>
        <label htmlFor="name-input">Name</label>
        <input
          id="name-input"
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
        />
      </div>
      <div>
        <label htmlFor="bio-input">Bio</label>
        <textarea
          id="bio-input"
          rows={3}
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          placeholder="Enter your bio"
        />
      </div>
      <ButtonContainer>
        <button type="submit">Save Profile</button>
        <SkipButton to="/dashboard">Skip</SkipButton>
      </ButtonContainer>
    </ProfileFormContainer>
  );
};

export default ProfileForm;

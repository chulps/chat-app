import React from "react";
import ProfileForm from "./ProfileForm";

const ProfileEdit = ({
  profile,
  handleSave,
  setProfile,
  imageFile,
  setImageFile,
}: {
  profile: any;
  handleSave: (event: React.FormEvent<HTMLFormElement>) => void;
  setProfile: React.Dispatch<React.SetStateAction<any>>;
  imageFile: File | null;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
}) => {
  return (
    <ProfileForm
      profile={profile}
      handleSave={handleSave}
      setProfile={setProfile}
      imageFile={imageFile}
      setImageFile={setImageFile}
    />
  );
};

export default ProfileEdit;

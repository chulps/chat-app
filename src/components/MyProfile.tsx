import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { getEnv } from "../utils/getEnv";
import ProfileForm from "./ProfileForm";
import ProfileImageUpload from "./ProfileImageUpload";
import { ProfileData } from "../types"; // Import the ProfileData type

const MyProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    _id: "", // Add _id property
    username: "",
    name: "",
    bio: "",
    profileImage: null,
    friends: [],
    blocked: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken, user } = useAuth();
  const { apiUrl } = getEnv();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/profile/${user?.id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (response.data) {
          setProfile({
            _id: response.data._id,
            username: response.data.username || "",
            name: response.data.name || "",
            bio: response.data.bio || "",
            profileImage: response.data.profileImage || null,
            friends: response.data.friends || [],
            blocked: response.data.blocked || [],
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to fetch profile data.");
      }
    };

    if (user?.id) {
      fetchProfile();
    }
  }, [user, getToken, apiUrl]);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/profile`, profile, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProfile({
        _id: response.data._id,
        username: response.data.username || "",
        name: response.data.name || "",
        bio: response.data.bio || "",
        profileImage: response.data.profileImage || null,
        friends: response.data.friends || [],
        blocked: response.data.blocked || [],
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Failed to save profile. Please try again.");
    }
  };

  return (
    <div>
      <ProfileImageUpload profileImage={profile.profileImage} setImageFile={setImageFile} />
      {isEditing ? (
        <ProfileForm
          profile={profile}
          setProfile={setProfile}
          handleSave={handleSave}
          imageFile={imageFile} // Pass imageFile here
          setImageFile={setImageFile}
        />
      ) : (
        <div>
          <h1>{profile.username}</h1>
          <p>{profile.bio}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default MyProfile;

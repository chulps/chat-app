import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getEnv } from "../utils/getEnv";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

interface ProfileData {
  username: string;
  name: string;
  bio: string;
  profileImage: string | null;
}

const Container = styled.div`
  max-width: var(--space-7);
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const ProfileImage = styled.img`
  width: var(--space-4);
  border-radius: 50%;
  object-fit: cover;
`;

const ErrorMessage = styled.div`
  color: var(--danger-400);
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

const FileInputLabel = styled.label`
  
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ProfileInfo = styled.div`
  display: flex;
  
`

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const [profile, setProfile] = useState<ProfileData>({
    username: "",
    name: "",
    bio: "",
    profileImage: null,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isInitialSetup, setIsInitialSetup] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();
  const { apiUrl } = getEnv();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/profile/${userId || ""}`,
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
        if (response.data) {
          setProfile({
            username: response.data.username || "",
            name: response.data.name || "",
            bio: response.data.bio || "",
            profileImage: response.data.profileImage || null,
          });
          setIsInitialSetup(
            !response.data.username ||
              !response.data.name ||
              !response.data.bio ||
              !response.data.profileImage
          );
        } else {
          setIsInitialSetup(true);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [userId, getToken, apiUrl]);

  const handleCreateProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/profile`, profile, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProfile({
        username: response.data.username || "",
        name: response.data.name || "",
        bio: response.data.bio || "",
        profileImage: response.data.profileImage || null,
      });
      setIsInitialSetup(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error creating profile:", error);
      setError("Failed to create profile. Please try again.");
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("profileImage", imageFile);

    try {
      const response = await axios.post(
        `${apiUrl}/api/profile/upload-image`,
        formData,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setProfile({
        ...profile,
        profileImage: response.data.profileImage || null,
      });
    } catch (error) {
      console.error("Error uploading profile image:", error);
      setError("Failed to upload image. Please try again.");
    }
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleCreateProfile(event);
    if (imageFile) {
      handleImageUpload();
    }
  };

  return (
    <Container>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {isInitialSetup ? (
        <Form onSubmit={handleSave}>
          <div>
            <FileInputContainer>
              <FileInputLabel htmlFor="profileImage">
                <h1>
                  <FontAwesomeIcon icon={faCamera} />
                </h1>
                Choose photo
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
          <ButtonContainer>
            <Link to="/dashboard">Skip</Link>
            <button type="submit">Save Profile</button>
          </ButtonContainer>
        </Form>
      ) : (
        <ProfileInfo>
          <div>
            {profile.profileImage && (
              <ProfileImage
                src={`${apiUrl}/${profile.profileImage}`}
                alt="Profile"
              />
            )}
            {isEditing ? (
              <Form onSubmit={handleSave}>
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
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    placeholder="Name"
                  />
                </div>
                <div>
                  <label htmlFor="bio">Bio:</label>
                  <input
                    id="bio"
                    type="text"
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    placeholder="Bio"
                  />
                </div>
                <div>
                  <FileInputContainer>
                    <FileInputLabel htmlFor="profileImage">
                      Update Profile Image
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
                <button type="submit">Done</button>
              </Form>
            ) : (
              <>
                <h4>@{profile.username}</h4>
                <small>{profile.name}</small>
                <p>{profile.bio}</p>

                <button onClick={() => setIsEditing(true)}>Edit</button>
              </>
            )}
          </div>
        </ProfileInfo>
      )}
    </Container>
  );
};

export default Profile;

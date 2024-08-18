import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getEnv } from "../utils/getEnv";
import ProfileForm from "./ProfileForm";
import styled from "styled-components";
import { ProfileData } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const MyProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: var(--space-7);
  margin: 0 auto;
`;

const Error = styled.data`
  color: var(--warning);
`;

const MyProfileHeader = styled.header`
  display: flex;
  align-items: start;
  gap: var(--space-2);
  justify-content: space-between;
  margin-top: var(--space-3);
  border-bottom: 1px solid var(--secondary);
  padding-bottom: var(--space-2);
  margin-bottom: var(--space-3);
`;

const MyProfileLeftContent = styled.aside`
  display: flex;
  justify-content: space-between;
`;

const MyProfileImg = styled.img`
  object-fit: cover;
  width: var(--space-4);
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid var(--primary);
  margin-right: var(--space-2);
`;

const MyProfileNameAndUserName = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BackButton = styled.button`
  background: var(--dark);
  color: white;
  font-size: var(--font-size-small);
  padding: 1em;

  &:hover {
    background: var(--dark);
    filter: brightness(1.2);
  }
`;

const MyProfileMain = styled.main`
  display: flex;
`;

const EditButton = styled.button`
  background: var(--site-background);
  padding: 1em;
  font-size: var(--font-size-small);

  &:hover {
    background: var(--dark);
    filter: brightness(1.2);
  }
`;

const MyBio = styled.p`
  margin-top: var(--space-2);
`;

const MyUserName = styled.p`
  &::before {
    content: "@";
  }
`;

const MyName = styled.small`
  color: var(--secondary);
`;

const MyProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    _id: "",
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
          setIsEditing(!response.data.name);
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

      // If an image file is selected, upload it
      if (imageFile) {
        const formData = new FormData();
        formData.append("profileImage", imageFile);

        const imageResponse = await axios.post(
          `${apiUrl}/api/profile/upload-image`,
          formData,
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );

        setProfile((prevProfile) => ({
          ...prevProfile,
          profileImage: imageResponse.data.profileImage, // Update profile image with S3 URL
        }));
      }

      setProfile((prevProfile) => ({
        ...prevProfile,
        name: response.data.name || prevProfile.name,
        bio: response.data.bio || prevProfile.bio,
      }));

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Failed to save profile. Please try again.");
    }
  };

  return (
    <MyProfileContainer>
      {error && <Error>{error}</Error>}
      {isEditing ? (
        <ProfileForm
          profile={profile}
          setProfile={setProfile}
          handleSave={handleSave}
          imageFile={imageFile}
          setImageFile={setImageFile}
        />
      ) : (
        <div>
          <MyProfileHeader>
            <Link to="/dashboard">
              <BackButton>
                <FontAwesomeIcon icon={faChevronLeft} />
                Dashboard
              </BackButton>
            </Link>
            <EditButton onClick={() => setIsEditing(true)}>
              <FontAwesomeIcon icon={faPencil} />
              Edit
            </EditButton>
          </MyProfileHeader>

          <MyProfileMain>
            <MyProfileLeftContent>
              {profile.profileImage && (
                <MyProfileImg
                  loading="lazy"
                  src={profile.profileImage} // Ensure this URL is correct and comes from S3
                  alt={profile.username}
                />
              )}
              <MyProfileNameAndUserName>
                <MyUserName>{profile.username}</MyUserName>
                <MyName>{profile.name}</MyName>
              </MyProfileNameAndUserName>
            </MyProfileLeftContent>
          </MyProfileMain>
          <MyBio>{profile.bio}</MyBio>
        </div>
      )}
    </MyProfileContainer>
  );
};

export default MyProfile;

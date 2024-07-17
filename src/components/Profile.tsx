import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getEnv } from "../utils/getEnv";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faUserPlus, faPaperPlane, faUserMinus, faBan } from "@fortawesome/free-solid-svg-icons";
import ChatroomSettingsMenu from "./ChatroomSettingsMenu"; // Assuming the file is in the same directory

interface ProfileData {
  username: string;
  name: string;
  bio: string;
  profileImage: string | null;
  friends: { _id: string }[];
  blocked: { _id: string }[];
}

const ProfileContainer = styled.div`
  max-width: var(--space-7);
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const ProfileImage = styled.img`
  width: calc(var(--space-2) + var(--space-3));
  height: calc(var(--space-2) + var(--space-3));
  border-radius: 50%;
  object-fit: cover;
  aspect-ratio: 1/1;
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

const ProfileInfo = styled.div`
  display: flex;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  justify-content: space-between;
  margin-top: var(--space-3);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

const ProfileBio = styled.div`
  padding-top: var(--space-3);
`;

const EditProfileImageIcon = styled.svg`
  width: 50%;
  color: rgba(255, 255, 255, 0.33);
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

const HeaderRight = styled.div`
  display: flex;
  gap: var(--space-2);
  align-items: center;
  height: var(--space-3);

  & > *:hover {
    cursor: pointer;
    transform: scale(1.1);
  }
`;

const BlockUser = styled.span`
  display: flex;
  align-items: center;
  padding: 0.5em 1em;
  white-space: nowrap;
  gap: var(--space-1);
  color: var(--danger-300);
  cursor: pointer;
  background: var(--dark);

  &:hover {
    filter: brightness(1.3);
  }
`;

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const [profile, setProfile] = useState<ProfileData>({
    username: "",
    name: "",
    bio: "",
    profileImage: null,
    friends: [],
    blocked: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isInitialSetup, setIsInitialSetup] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken, user } = useAuth();
  const { apiUrl } = getEnv();

  console.log("userId from params:", userId);
  console.log("user.id from auth context:", user?.id);

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
          console.log("Profile data:", response.data); // Log the profile data
          setProfile({
            username: response.data.username || "",
            name: response.data.name || "",
            bio: response.data.bio || "",
            profileImage: response.data.profileImage || null,
            friends: response.data.friends || [],
            blocked: response.data.blocked || [],
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

  useEffect(() => {
    // Add logging for friends array
    console.log("Friends array:", profile.friends);
  }, [profile]);

  const isCurrentUser = user && userId && user.id === userId;
  const isInContacts = profile.friends.some(friend => friend._id === userId);
  const isBlocked = profile.blocked.some(blocked => blocked._id === userId);

  console.log("isInContacts:", isInContacts);
  console.log("isBlocked:", isBlocked);

  const handleSendFriendRequest = async () => {
    try {
      await axios.post(
        `${apiUrl}/api/profile/${userId}/add-contact`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      // Update profile contacts
      setProfile(prevProfile => ({
        ...prevProfile,
        friends: [...prevProfile.friends, { _id: userId! }]
      }));
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleSendMessage = () => {
    // Handle send message logic
  };

  const handleRemoveContact = async () => {
    try {
      await axios.post(
        `${apiUrl}/api/profile/${userId}/remove-contact`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      // Update profile contacts
      setProfile(prevProfile => ({
        ...prevProfile,
        friends: prevProfile.friends.filter(friend => friend._id !== userId)
      }));
    } catch (error) {
      console.error("Error removing contact:", error);
    }
  };

  const handleBlockUser = async () => {
    try {
      await axios.post(
        `${apiUrl}/api/profile/${userId}/block`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      // Update profile blocked users
      setProfile(prevProfile => ({
        ...prevProfile,
        blocked: [...prevProfile.blocked, { _id: userId! }]
      }));
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handleUnblockUser = async () => {
    try {
      await axios.post(
        `${apiUrl}/api/profile/${userId}/unblock`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      // Update profile blocked users
      setProfile(prevProfile => ({
        ...prevProfile,
        blocked: prevProfile.blocked.filter(blocked => blocked._id !== userId)
      }));
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };

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
        friends: response.data.friends || [],
        blocked: response.data.blocked || [],
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
    <ProfileContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {isInitialSetup ? (
        <Form onSubmit={handleSave}>
          <div>
            <FileInputContainer>
              <FileInputLabel
                htmlFor="profileImage"
                backgroundImage={
                  profile.profileImage
                    ? `${apiUrl}/${profile.profileImage}`
                    : undefined
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
      ) : (
        <ProfileInfo className="profile-info">
          <div style={{ width: "100%" }}>
            {isEditing ? (
              <Form onSubmit={handleSave}>
                <div>
                  <FileInputContainer>
                    <FileInputLabel
                      htmlFor="profileImage"
                      backgroundImage={
                        profile.profileImage
                          ? `${apiUrl}/${profile.profileImage}`
                          : undefined
                      }
                    >
                      {!profile.profileImage && (
                        <>
                          <FontAwesomeIcon icon={faCamera} />
                        </>
                      )}
                      <EditProfileImageIcon>
                        <FontAwesomeIcon icon={faCamera} />
                      </EditProfileImageIcon>
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
                <button type="submit">Done</button>
              </Form>
            ) : (
              <>
                <ProfileHeader className="profile-header">
                  <HeaderLeft>
                    {profile.profileImage && (
                      <ProfileImage
                        className="profile-image"
                        src={`${apiUrl}/${profile.profileImage}`}
                        alt="Profile"
                      />
                    )}
                    <div>
                      <h4>@{profile.username}</h4>
                      <small>{profile.name}</small>
                    </div>
                  </HeaderLeft>
                  {isCurrentUser ? (
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                  ) : (
                    <HeaderRight>
                      {!isInContacts && (
                        <FontAwesomeIcon icon={faUserPlus} onClick={handleSendFriendRequest} />
                      )}
                      <FontAwesomeIcon icon={faPaperPlane} onClick={handleSendMessage} />
                      <ChatroomSettingsMenu alignRight>
                        {isInContacts && (
                          <button onClick={handleRemoveContact}>
                            <FontAwesomeIcon icon={faUserMinus} /> Remove Contact
                          </button>
                        )}
                        <BlockUser onClick={isBlocked ? handleUnblockUser : handleBlockUser}>
                          <FontAwesomeIcon icon={faBan} /> {isBlocked ? "Unblock User" : "Block User"}
                        </BlockUser>
                      </ChatroomSettingsMenu>
                    </HeaderRight>
                  )}
                </ProfileHeader>
                <ProfileBio>
                  <label>Your Bio</label>
                  {profile.bio}
                </ProfileBio>
              </>
            )}
          </div>
        </ProfileInfo>
      )}
    </ProfileContainer>
  );
};

export default Profile;

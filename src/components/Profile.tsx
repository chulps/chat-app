import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getEnv } from '../utils/getEnv';
import '../css/profile.css';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    profileImage: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(true); // Default to editing mode for profile creation
  const { getToken } = useAuth();
  const { apiUrl } = getEnv();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/profile/${userId || ''}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setProfile(response.data || { name: "", bio: "", profileImage: "" });
        setIsEditing(!response.data || !response.data.name || !response.data.bio || !response.data.profileImage);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [userId, getToken, apiUrl]);

  const handleCreateProfile = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/profile`, profile, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProfile(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error creating profile:", error);
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
      setProfile(response.data);
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  const handleSave = () => {
    handleCreateProfile();
    if (imageFile) {
      handleImageUpload();
    }
  };

  const createChatroom = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/chatrooms`, { name: `Chat with ${profile.name}`, members: [userId] }, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      navigate(`/chatroom/${response.data._id}`);
    } catch (error) {
      console.error('Error creating chatroom:', error);
    }
  };

  return (
    <div className="profile">
      <h1>Profile</h1>
      {profile.name || profile.bio || profile.profileImage ? (
        <div className="profile-info">
          <div>
            {profile.profileImage && (
              <img className="profile-img" width="100%" src={`${apiUrl}/${profile.profileImage}`} alt="Profile" />
            )}
            {userId ? (
              <>
                <h2>{profile.name}</h2>
                <p>{profile.bio}</p>
                <button onClick={createChatroom}>Start Chat</button>
              </>
            ) : (
              isEditing ? (
                <>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Bio"
                  />
                  <div>
                    <h2>Update Profile Image</h2>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setImageFile(e.target.files ? e.target.files[0] : null)
                      }
                    />
                  </div>
                  <button onClick={handleSave}>Done</button>
                </>
              ) : (
                <>
                  <h2>{profile.name}</h2>
                  <p>{profile.bio}</p>
                  <button onClick={() => setIsEditing(true)}>Edit</button>
                </>
              )
            )}
          </div>
        </div>
      ) : (
        <div className="profile-create">
          <div>
            <h2>Create Profile</h2>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Name"
            />
            <input
              type="text"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Bio"
            />
            <button onClick={handleCreateProfile}>Save Profile</button>
          </div>
          <div>
            <h2>Upload Profile Image</h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImageFile(e.target.files ? e.target.files[0] : null)
              }
            />
            <button onClick={handleImageUpload}>Upload Image</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

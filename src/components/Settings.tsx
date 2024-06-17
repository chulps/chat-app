import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { getEnv } from '../utils/getEnv';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    email: "",
    username: "",
    currentPassword: "",
    newPassword: "",
    fontSize: "default",
  });
  const [isEditing, setIsEditing] = useState(false);
  const { getToken } = useAuth();
  const { apiUrl } = getEnv();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/settings`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setSettings(response.data);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, [getToken, apiUrl]);

  const handleSave = async () => {
    try {
      if (settings.email) {
        await axios.put(
          `${apiUrl}/api/settings/email`,
          { email: settings.email },
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
      }
      if (settings.username) {
        await axios.put(
          `${apiUrl}/api/settings/username`,
          { username: settings.username },
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
      }
      if (settings.currentPassword && settings.newPassword) {
        await axios.put(
          `${apiUrl}/api/settings/password`,
          { currentPassword: settings.currentPassword, newPassword: settings.newPassword },
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
      }
      if (settings.fontSize) {
        await axios.put(
          `${apiUrl}/api/settings/fontSize`,
          { fontSize: settings.fontSize },
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <div className="settings">
      <h1>Settings</h1>
      {isEditing ? (
        <div>
          <div>
            <h2>Update Email</h2>
            <input
              type="email"
              value={settings.email}
              onChange={(e) =>
                setSettings({ ...settings, email: e.target.value })
              }
              placeholder="Email"
            />
          </div>
          <div>
            <h2>Update Username</h2>
            <input
              type="text"
              value={settings.username}
              onChange={(e) =>
                setSettings({ ...settings, username: e.target.value })
              }
              placeholder="Username"
            />
          </div>
          <div>
            <h2>Change Password</h2>
            <input
              type="password"
              value={settings.currentPassword}
              onChange={(e) =>
                setSettings({ ...settings, currentPassword: e.target.value })
              }
              placeholder="Current Password"
            />
            <input
              type="password"
              value={settings.newPassword}
              onChange={(e) =>
                setSettings({ ...settings, newPassword: e.target.value })
              }
              placeholder="New Password"
            />
          </div>
          <div>
            <h2>Change Font Size</h2>
            <select
              value={settings.fontSize}
              onChange={(e) =>
                setSettings({ ...settings, fontSize: e.target.value })
              }
            >
              <option value="var(--font-size-h6)">Small</option>
              <option value="var(--font-size-h5)">Default</option>
              <option value="var(--font-size-h4)">Large</option>
              <option value="var(--font-size-h3)">Extra Large</option>
            </select>
          </div>
          <button onClick={handleSave}>Save Settings</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div className="settings-info">
          <h2>Email: {settings.email}</h2>
          <h2>Username: {settings.username}</h2>
          <h2>Password: ******</h2>
          <h2>Font Size: {settings.fontSize}</h2>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default Settings;

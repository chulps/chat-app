import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { getEnv } from "../utils/getEnv";
import styled from "styled-components";
import SimpleDropdown from "./SimpleDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

const SettingsContainer = styled.div`
  padding-top: var(--space-3);
`;

const SettingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SettingsEdit = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding-top: var(--space-2);
`;

const SettingsEditButtons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  button {
    width: 100%;
  }

  @media screen and (min-width: 576px) {
    flex-direction: row-reverse;
    justify-content: space-between;

    button {
      width: fit-content;
    }
  }
`;

const SettingsInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding-top: var(--space-2);
`;

const EditButton = styled.span`
  cursor: pointer;
`;

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    email: "",
    username: "",
    currentPassword: "",
    newPassword: "",
    fontSize: "var(--font-size-h5)",
  });
  const [isEditing, setIsEditing] = useState(false);
  const { getToken } = useAuth();
  const { apiUrl } = getEnv();

  const fontSizeOptions = [
    { value: "var(--font-size-h5)", label: "Default" },
    { value: "var(--font-size-h6)", label: "Small" },
    { value: "var(--font-size-h4)", label: "Large" },
    { value: "var(--font-size-h3)", label: "Extra Large" },
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/settings`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setSettings((prevSettings) => ({
          ...prevSettings,
          ...response.data,
          fontSize: response.data.fontSize || "var(--font-size-h5)", // Ensure default font size is set
        }));
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, [getToken, apiUrl]);

  useEffect(() => {
    // Set initial font size
    document.documentElement.style.setProperty('--font-size-default', settings.fontSize);
  }, [settings.fontSize]);

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
          {
            currentPassword: settings.currentPassword,
            newPassword: settings.newPassword,
          },
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
        // Update CSS variable for font size
        document.documentElement.style.setProperty('--font-size-default', settings.fontSize);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const getFontSizeLabel = (value: string) => {
    const option = fontSizeOptions.find((option) => option.value === value);
    return option ? option.label : "Default";
  };

  return (
    <SettingsContainer>
      <SettingsHeader>
        <h2>Settings</h2>
        {isEditing ? null : (
          <EditButton onClick={() => setIsEditing(true)}>
            <FontAwesomeIcon icon={faPen} />
          </EditButton>
        )}
      </SettingsHeader>

      {isEditing ? (
        <SettingsEdit>
          <div>
            <label>Font Size</label>
            <SimpleDropdown
              options={fontSizeOptions}
              onChange={(value) =>
                setSettings({ ...settings, fontSize: value })
              }
              defaultOption={settings.fontSize}
            />
          </div>

          <div>
            <label>Update Email</label>
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
            <label>Update Username</label>
            <input
              type="text"
              value={settings.username}
              onChange={(e) =>
                setSettings({ ...settings, username: e.target.value })
              }
              placeholder="@cleverUserName"
            />
          </div>

          <div>
            <label>Change Password</label>
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

          <SettingsEditButtons>
            <button onClick={handleSave}>Save Settings</button>
            <span className="link" onClick={() => setIsEditing(false)}>
              Cancel
            </span>
          </SettingsEditButtons>
        </SettingsEdit>
      ) : (
        <SettingsInfo>
          <div>
            <label>Email:</label>
            {settings.email}
          </div>

          <div>
            <label>Username:</label>@{settings.username}
          </div>

          <div>
            <label>Password:</label>
            ...
          </div>

          <div>
            <label>Font Size:</label>
            {getFontSizeLabel(settings.fontSize)}
          </div>
        </SettingsInfo>
      )}
    </SettingsContainer>
  );
};

export default Settings;

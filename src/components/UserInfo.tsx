import React from 'react';
import { ProfileData } from '../types'; // Import the ProfileData type

interface UserInfoProps {
  user: ProfileData; // Use the correct type for user
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  return (
    <div>
      <h1>{user.username}</h1>
      <p>{user.bio}</p>
      {/* Add other user details as necessary */}
    </div>
  );
};

export default UserInfo;

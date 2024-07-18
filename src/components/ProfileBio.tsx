import React from 'react';
import styled from 'styled-components';

const BioContainer = styled.div`
  padding-top: var(--space-3);
`;

interface ProfileBioProps {
  bio: string;
}

const ProfileBio: React.FC<ProfileBioProps> = ({ bio }) => (
  <BioContainer>
    <label>Your Bio</label>
    {bio}
  </BioContainer>
);

export default ProfileBio;

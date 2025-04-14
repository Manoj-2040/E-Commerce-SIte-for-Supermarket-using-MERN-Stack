import React from 'react';
import { UserProfile } from '@clerk/clerk-react';

const Profile = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Your Profile</h2>
      <UserProfile />
    </div>
  );
};

export default Profile;

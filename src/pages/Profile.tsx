import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";

const Profile: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
      }}
    >
      <Sidebar />
      <h2>Your Profile</h2>
      <p>Manage your personal information and recipes here.</p>
    </div>
  );
};

export default Profile;

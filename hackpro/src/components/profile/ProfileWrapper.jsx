// ProfileWrapper.jsx
import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import Profile from "./Profile";

const ProfileWrapper = () => (
  <ThemeProvider>
    <Profile />
  </ThemeProvider>
);

export default ProfileWrapper;
// src/components/LoadingSpinner.jsx
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        minHeight: "200px",
      }}
    >
      <CircularProgress color="primary" size={60} />
    </Box>
  );
};

export default LoadingSpinner;

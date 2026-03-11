import React from "react";
import { SkeletonCard } from "./styles";

export const ProfileSkeleton = () => (
  <>
    <div style={{ marginBottom: "2rem" }}>
      <SkeletonCard height="120px" />
    </div>
    <div style={{ marginBottom: "2rem" }}>
      <SkeletonCard height="150px" />
      <SkeletonCard height="150px" />
    </div>
    <div style={{ marginBottom: "2rem" }}>
      <SkeletonCard height="100px" />
      <SkeletonCard height="100px" />
      <SkeletonCard height="100px" />
    </div>
  </>
);

export const OrdersSkeleton = () => (
  <div style={{ marginBottom: "2rem" }}>
    <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
      <SkeletonCard height="40px" style={{ width: '80px' }} />
      <SkeletonCard height="40px" style={{ width: '80px' }} />
      <SkeletonCard height="40px" style={{ width: '80px' }} />
      <SkeletonCard height="40px" style={{ width: '80px' }} />
    </div>
    <SkeletonCard height="200px" />
    <SkeletonCard height="200px" />
  </div>
);

export const AdminSkeleton = () => (
  <>
    <div style={{ marginBottom: "2rem" }}>
      <SkeletonCard height="40px" style={{ width: '200px', marginBottom: '1rem' }} />
      <SkeletonCard height="300px" />
    </div>
    <div style={{ marginBottom: "2rem" }}>
      <SkeletonCard height="40px" style={{ width: '200px', marginBottom: '1rem' }} />
      <SkeletonCard height="300px" />
    </div>
  </>
);
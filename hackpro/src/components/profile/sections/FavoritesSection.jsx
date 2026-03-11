import React from "react";
import { FaHeart, FaStar, FaCartPlus, FaTrash } from "react-icons/fa";
import {
  ProfileSection,
  SectionTitle,
  Card,
  InfoValue,
  Button,
} from "../styles";

const FavoritesSection = ({
  localFavorites,
  addToCart,
  handleRemoveFromFavorites,
  theme,
}) => {
  return (
    <ProfileSection>
      <SectionTitle theme={theme}>
        <FaHeart aria-hidden="true" /> Favorite Treats
      </SectionTitle>

      {localFavorites.length === 0 ? (
        <Card theme={theme}>
          <InfoValue theme={theme}>No favorites yet. Explore the menu and add some!</InfoValue>
        </Card>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {localFavorites.map((favorite) => (
            <Card key={favorite.id} theme={theme} style={{ display: "flex", alignItems: "center", padding: "1rem" }}>
              <div style={{ width: "80px", height: "80px", borderRadius: "12px", background: "#eee", marginRight: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {favorite.image ? (
                  <img src={favorite.image} alt={favorite.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }} />
                ) : (
                  <FaHeart style={{ fontSize: "2rem", color: "#ff6666" }} />
                )}
              </div>
              <div style={{ flexGrow: 1 }}>
                <h4 style={{ margin: "0 0 0.5rem 0", color: theme.mode === 'dark' ? '#ff9999' : '#ff6666' }}>
                  {favorite.name}
                </h4>
                <p style={{ margin: "0 0 0.5rem 0", color: theme.mode === 'dark' ? '#cc9999' : '#ffb3b3' }}>
                  <FaStar style={{ color: "#ffd700" }} /> ${favorite.price?.toFixed(2) || "0.00"}
                </p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Button $secondary onClick={() => addToCart(favorite)} theme={theme}>
                    <FaCartPlus /> Add to Cart
                  </Button>
                  <Button $secondary onClick={() => handleRemoveFromFavorites(favorite.itemId)} theme={theme}>
                    <FaTrash /> Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </ProfileSection>
  );
};

export default FavoritesSection;
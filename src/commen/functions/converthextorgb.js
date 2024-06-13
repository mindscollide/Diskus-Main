export const hexToRgb = (hex) => {
  // Remove the leading # if present
  if (hex.startsWith('#')) {
    hex = hex.substring(1);
  }

  // Parse the hex color into RGB components
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 2), 16);
  const b = parseInt(hex.substring(4, 2), 16);

  return { r, g, b };
};

export const rgbToHex = (r, g, b) => {
  // Ensure each component is within the valid range
  if (r > 255 || r < 0 || g > 255 || g < 0 || b > 255 || b < 0) {
    throw new Error("Invalid color component");
  }

  // Convert each component to a two-digit hex string
  const toHex = (component) => component.toString(16).padStart(2, "0");

  // Combine the hex strings for the final hex color code
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// This will return the color of the currently selected user
export const getActorColorByUserID =(userID, userAnnotationsRef) => {
  console.log(`Searching for userID: ${userID}`, userAnnotationsRef);

  for (let i = 0; i < userAnnotationsRef.current.length; i++) {
    if (userAnnotationsRef.current[i].userID === userID) {
      const actorColorHex = userAnnotationsRef.current[i].actorColor;
      const actorColorRgb = hexToRgb(actorColorHex);
      console.log(`Found color for userID ${userID}: ${actorColorHex} -> RGB: ${actorColorRgb.r}, ${actorColorRgb.g}, ${actorColorRgb.b}`);
      return actorColorRgb;
    }
  }
  
  console.log(`userID ${userID} not found.`);
  return null; // Return null if userID is not found
}
import { v2 as cloudinary } from "cloudinary";

// Debug log to check if env variables are available
console.log("Cloudinary Environment Variables Check:");
console.log(
  "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:",
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "Not set"
);
console.log(
  "CLOUDINARY_API_KEY:",
  process.env.CLOUDINARY_API_KEY ? "Set (value hidden)" : "Not set"
);
console.log(
  "CLOUDINARY_API_SECRET:",
  process.env.CLOUDINARY_API_SECRET ? "Set (value hidden)" : "Not set"
);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Helper function to generate URL for images
export function buildImageUrl(publicId, options = {}) {
  return cloudinary.url(publicId, {
    secure: true,
    ...options,
  });
}

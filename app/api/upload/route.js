import { NextResponse } from "next/server";
import cloudinary from "../../lib/cloudinary";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");
    const title = formData.get("title") || "";
    const tagString = formData.get("tags") || "";

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Process the tags from comma-separated string to array
    const tags = tagString
      ? tagString
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      : [];

    // Get the image buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64 data URL format
    const base64Image = `data:${image.type};base64,${buffer.toString(
      "base64"
    )}`;

    // Upload the image to Cloudinary with improved metadata handling
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        base64Image,
        {
          folder: "image_gallery",
          public_id: `${Date.now()}`,
          tags: tags, // Array of tags
          context: `alt=${encodeURIComponent(title)}|title=${encodeURIComponent(
            title
          )}|tags=${encodeURIComponent(tagString)}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    console.log("Upload result:", JSON.stringify(uploadResult, null, 2));

    // Return the Cloudinary response with added metadata
    return NextResponse.json({
      ...uploadResult,
      title,
      tags,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error uploading image" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import cloudinary from "../../lib/cloudinary";

// GET route for fetching images with pagination and search
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const search = searchParams.get("search") || "";
    const nextCursor = searchParams.get("next_cursor") || "";

    // Log Cloudinary configuration for debugging (don't include secret)
    console.log("Cloudinary config check:", {
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        ? "Set"
        : "Missing",
      api_key: process.env.CLOUDINARY_API_KEY ? "Set" : "Missing",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing",
    });

    // Build search expression based on search query
    let searchExpression = "folder:image_gallery";
    if (search) {
      // Fixed: Use Cloudinary compatible search syntax without wildcard characters
      searchExpression = `folder:image_gallery AND (context.title:${search} OR tags:${search})`;
    }

    console.log("Search expression:", searchExpression);

    // Check if the folder exists first
    try {
      console.log("Checking if image_gallery folder exists...");
      const folderCheck = await cloudinary.api
        .sub_folders("image_gallery", {
          max_results: 1,
        })
        .catch((err) => {
          console.log("Folder check error:", err);
          return { folders: [] };
        });

      console.log(
        "Folder check result:",
        folderCheck.folders ? "Folder exists" : "Folder may not exist"
      );
    } catch (folderError) {
      console.error("Error checking folder:", folderError);
      // Continue execution even if folder check fails
    }

    // Start building the search query
    let searchQuery = cloudinary.search
      .expression(searchExpression)
      .max_results(limit)
      .sort_by("created_at", "desc")
      .with_field("context")
      .with_field("tags");

    // Apply cursor if one is provided (except for the first page)
    if (page > 1 && nextCursor) {
      searchQuery = searchQuery.next_cursor(nextCursor);
    }

    // Execute the search
    console.log("Executing Cloudinary search...");
    const result = await searchQuery.execute();
    console.log("Search complete, found", result.total_count, "images");

    // Process and enhance the response
    const images = result.resources.map((resource) => {
      const context = resource.context || {};

      // Extract title from context
      let title = "";

      // Check for title in various locations
      if (context.title) {
        title = decodeURIComponent(context.title);
      } else if (context.alt) {
        title = decodeURIComponent(context.alt);
      } else if (context.caption) {
        title = context.caption;
      }

      // Handle tags from both resource.tags and context.tags
      let tags = [];

      // First use resource.tags if available
      if (Array.isArray(resource.tags) && resource.tags.length > 0) {
        tags = resource.tags;
      }

      // If no tags found yet but we have context.tags, use those
      if (tags.length === 0 && context.tags) {
        const decodedTags = decodeURIComponent(context.tags);
        tags = decodedTags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);
      }

      console.log("Processing image:", resource.public_id);
      console.log("Title found:", title || "No title found");
      console.log("Tags found:", tags.length > 0 ? tags : "No tags found");

      return {
        ...resource,
        title: title || "",
        tags: tags || [],
      };
    });

    // Return both the images and the next cursor in the response
    return NextResponse.json({
      images,
      next_cursor: result.next_cursor,
      total_count: result.total_count,
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);

    // Check if error is related to Cloudinary configuration
    if (error.message && error.message.includes("config")) {
      console.error("Likely a Cloudinary configuration issue");
    }

    // Try to get more details about Cloudinary status
    try {
      const cloudinaryStatus = await cloudinary.api.ping();
      console.log("Cloudinary API status:", cloudinaryStatus);
    } catch (pingError) {
      console.error("Error pinging Cloudinary API:", pingError.message);
    }

    return NextResponse.json(
      { error: "Error fetching images", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE route for removing an image
export async function DELETE(request) {
  try {
    const { public_id } = await request.json();

    if (!public_id) {
      return NextResponse.json(
        { error: "Public ID is required" },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === "ok") {
      return NextResponse.json({
        success: true,
        message: "Image deleted successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to delete image" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Error deleting image" },
      { status: 500 }
    );
  }
}

// Helper to calculate the next cursor based on page and limit
function getNextCursor(page, limit) {
  // This is a simplified approach, in a real app we would store and use actual cursors from Cloudinary
  return `${page}_${limit}`;
}

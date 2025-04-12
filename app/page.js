"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaImages,
  FaSortAmountDown,
  FaSortAmountUpAlt,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import ImageGrid from "./components/ImageGrid";
import ImageModal from "./components/ImageModal";
import ImageUpload from "./components/ImageUpload";

export default function Home() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newestFirst, setNewestFirst] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const router = useRouter();
  const imagesPerPage = 12;
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const fetchImages = async (pageNum = 1, replace = true) => {
    try {
      setLoading(true);

      // Build the API URL with appropriate parameters
      let apiUrl = `/api/images?page=${pageNum}&limit=${imagesPerPage}`;

      // Add search query if it exists
      if (searchQuery) {
        apiUrl += `&search=${encodeURIComponent(searchQuery)}`;
      }

      // Add cursor for pagination if not first page
      if (pageNum > 1 && nextCursor) {
        apiUrl += `&next_cursor=${encodeURIComponent(nextCursor)}`;
      }

      const res = await fetch(apiUrl);
      const data = await res.json();

      // Check if response has the expected structure
      if (data.error) {
        throw new Error(data.error);
      }

      // Extract images, cursor, and total count from response
      const imageArray = data.images || [];
      const newNextCursor = data.next_cursor || "";
      const newTotalCount = data.total_count || 0;

      if (replace) {
        setImages(imageArray);
      } else {
        setImages((prev) => [...prev, ...imageArray]);
      }

      // Update pagination state
      setNextCursor(newNextCursor);
      setTotalCount(newTotalCount);
      setHasMore(!!newNextCursor);
      setLoading(false);
    } catch (error) {
      console.error("Error loading images:", error);
      toast.error("Error loading images");
      setLoading(false);
      setImages([]); // Ensure images is always an array even after error
    }
  };

  useEffect(() => {
    fetchImages(1, true);
    setNextCursor("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Apply sorting to displayed images
  const sortedImages = [...images].sort((a, b) => {
    if (newestFirst) {
      return new Date(b.created_at) - new Date(a.created_at);
    } else {
      return new Date(a.created_at) - new Date(b.created_at);
    }
  });

  const handleImageUpload = (newImage) => {
    setImages((prev) => [newImage, ...prev]);
    toast.success("Image uploaded successfully!");
  };

  const handleLoadMore = () => {
    // For cursor-based pagination, we just need to use the current cursor
    fetchImages(2, false); // Page parameter is still needed for the URL structure
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleDeleteImage = async (publicId) => {
    try {
      const res = await fetch("/api/images", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public_id: publicId }),
      });

      if (res.ok) {
        setImages((prev) =>
          prev.filter((image) => image.public_id !== publicId)
        );
        toast.success("Image deleted successfully!");
        if (isModalOpen && selectedImage?.public_id === publicId) {
          setIsModalOpen(false);
        }
      } else {
        toast.error("Failed to delete image");
      }
    } catch (error) {
      toast.error("Error deleting image");
    }
  };

  const clearSearch = () => {
    router.push("/");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero section without stats */}
      <section className="bg-gradient-to-r from-blue-800 to-indigo-900 rounded-2xl p-6 mb-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Image Gallery
            </h1>
            <p className="text-blue-100 mb-4">
              Store and manage your images with ease
            </p>
          </div>
          <div className="w-full md:w-auto">
            <a
              href="#upload"
              className="w-full md:w-auto inline-block bg-white text-blue-600 hover:bg-blue-50 font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Upload New Images
            </a>
          </div>
        </div>
      </section>

      {/* Display search results information if searching */}
      {searchQuery && (
        <div className="mb-6 p-4 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-between">
          <p className="text-lg text-gray-200">
            Search results for:{" "}
            <span className="font-semibold">"{searchQuery}"</span>
            {totalCount > 0 && (
              <span className="ml-2 text-sm text-gray-400">
                ({totalCount} results)
              </span>
            )}
          </p>
          <button
            onClick={clearSearch}
            className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <FaTimes className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      )}

      {/* Upload section */}
      <ImageUpload onImageUpload={handleImageUpload} />

      {/* Filter and sort controls */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-xl font-bold text-gray-200 flex items-center gap-2">
          <FaImages className="text-blue-400" />
          <span>Your Images</span>
          {sortedImages.length > 0 && (
            <span className="text-sm font-normal text-gray-400">
              ({sortedImages.length} images)
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Sort toggle button */}
          <button
            onClick={() => setNewestFirst(!newestFirst)}
            className="flex items-center gap-2 bg-gray-800 border border-gray-700 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {newestFirst ? (
              <>
                <FaSortAmountDown className="w-3.5 h-3.5" />
                <span>Newest First</span>
              </>
            ) : (
              <>
                <FaSortAmountUpAlt className="w-3.5 h-3.5" />
                <span>Oldest First</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main image grid */}
      <ImageGrid
        images={sortedImages}
        loading={loading}
        onImageClick={handleImageClick}
      />

      {/* Load more button */}
      {hasMore && images.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-8 rounded-lg transition-colors flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </span>
            ) : (
              <span>Load More</span>
            )}
          </button>
        </div>
      )}

      {/* Empty state */}
      {sortedImages.length === 0 && !loading && (
        <div className="text-center py-16 bg-gray-800 rounded-xl border border-dashed border-gray-600">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <FaImages className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-gray-300 text-xl font-medium mb-2">
              No images found
            </h3>
            <p className="text-gray-400 mb-4">
              {searchQuery
                ? "No images match your search criteria"
                : "Your gallery is empty"}
            </p>
          </div>
        </div>
      )}

      {/* Image modal */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDelete={handleDeleteImage}
        />
      )}
    </div>
  );
}

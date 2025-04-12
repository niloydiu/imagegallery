"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaDownload, FaTags, FaTimes, FaTrash } from "react-icons/fa";

export default function ImageModal({ image, isOpen, onClose, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset states when modal opens with new image
    if (isOpen) {
      setConfirmDelete(false);
      setIsLoading(true);
    }
  }, [isOpen, image]);

  if (!isOpen) return null;

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(image.public_id);
    } else {
      setConfirmDelete(true);
      // Auto reset confirm state after 5 seconds
      setTimeout(() => setConfirmDelete(false), 5000);
    }
  };

  // Format the created date nicely
  const formattedDate = image.created_at
    ? new Date(image.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // Download image function
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image.secure_url;
    link.download = `${image.title || "image"}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="bg-white dark:bg-gray-900 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden relative flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-black/20 backdrop-blur-md text-white rounded-full p-2 hover:bg-black/40 transition-colors"
          aria-label="Close"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        <div className="relative md:w-2/3 h-[40vh] md:h-[80vh] bg-black/20">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
              <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            </div>
          )}
          <Image
            src={image.secure_url}
            alt={image.title || "Image preview"}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 66vw"
            onLoadingComplete={() => setIsLoading(false)}
            priority
          />
        </div>

        <div className="p-6 md:w-1/3 flex flex-col h-full overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            {image.title || "Untitled"}
          </h2>

          {formattedDate && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
              Uploaded on {formattedDate}
            </p>
          )}

          {image.tags && image.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                <FaTags className="w-3 h-3" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {image.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs px-3 py-1.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Image details */}
          {image.width && image.height && (
            <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4 mb-6">
              <h3 className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                Image Details
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Dimensions</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {image.width} × {image.height}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Format</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {image.format ? image.format.toUpperCase() : "Unknown"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-auto grid grid-cols-2 gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <FaDownload />
              <span>Download</span>
            </button>

            <button
              onClick={handleDelete}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
                confirmDelete
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <FaTrash />
              <span>{confirmDelete ? "Confirm Delete" : "Delete Image"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

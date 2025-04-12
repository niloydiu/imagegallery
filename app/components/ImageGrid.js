"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FaEye, FaSpinner, FaTag } from "react-icons/fa";

export default function ImageGrid({ images, loading, onImageClick }) {
  const [imageLoaded, setImageLoaded] = useState({});
  const [hoveredImage, setHoveredImage] = useState(null);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const handleImageLoad = (id) => {
    setImageLoaded((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fadeIn">
      {images.map((image) => (
        <div
          key={image.public_id}
          className="group bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          onClick={() => onImageClick(image)}
          onMouseEnter={() => setHoveredImage(image.public_id)}
          onMouseLeave={() => setHoveredImage(null)}
        >
          <div className="relative w-full aspect-square bg-gray-700 overflow-hidden">
            {!imageLoaded[image.public_id] && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                <div className="relative">
                  <FaSpinner className="animate-spin text-gray-400 w-8 h-8" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-gray-700 animate-pulse"></div>
                </div>
              </div>
            )}
            <Image
              src={image.secure_url}
              alt={image.title || "Gallery Image"}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              onLoad={() => handleImageLoad(image.public_id)}
              priority={images.indexOf(image) === 0}
            />

            {/* Overlay with title that appears on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-white font-medium text-lg truncate">
                  {image.title || "Untitled"}
                </h3>
                <div className="flex gap-2">
                  <span className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                    <FaEye className="text-white w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-700">
            <h3 className="font-semibold text-lg mb-1 truncate text-gray-100">
              {image.title || "Untitled"}
            </h3>

            {image.tags &&
            Array.isArray(image.tags) &&
            image.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {image.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-900/50 text-blue-200 text-xs px-2.5 py-1 rounded-full flex items-center gap-1"
                  >
                    <FaTag className="w-2.5 h-2.5" />
                    {tag.trim()}
                  </span>
                ))}
                {image.tags.length > 3 && (
                  <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                    +{image.tags.length - 3}
                  </span>
                )}
              </div>
            ) : image.tags &&
              typeof image.tags === "string" &&
              image.tags.trim() !== "" ? (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {image.tags
                  .split(",")
                  .slice(0, 3)
                  .map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-900/50 text-blue-200 text-xs px-2.5 py-1 rounded-full flex items-center gap-1"
                    >
                      <FaTag className="w-2.5 h-2.5" />
                      {tag.trim()}
                    </span>
                  ))}
                {image.tags.split(",").length > 3 && (
                  <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                    +{image.tags.split(",").length - 3}
                  </span>
                )}
              </div>
            ) : null}
          </div>
        </div>
      ))}

      {loading && (
        <div className="col-span-full flex justify-center py-8">
          <div className="relative">
            <FaSpinner className="animate-spin text-blue-500 w-10 h-10" />
            <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
          </div>
        </div>
      )}

      <div ref={loadMoreRef} className="h-4"></div>
    </div>
  );
}

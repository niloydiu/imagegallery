"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { FaImage, FaSpinner, FaTimes, FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";

export default function ImageUpload({ onImageUpload }) {
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (newFiles.length === 0) {
        toast.error("Please upload only image files");
        return;
      }

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    if (!title) {
      toast.error("Please enter a title");
      return;
    }

    try {
      setUploading(true);

      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", title);
        formData.append("tags", tags);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        onImageUpload(data);
      }

      // Reset form
      setTitle("");
      setTags("");
      setFiles([]);
      toast.success(
        `${files.length} ${
          files.length === 1 ? "image" : "images"
        } uploaded successfully!`
      );
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div id="upload" className="bg-gray-800 shadow-lg rounded-xl p-6 mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
        <FaImage className="text-blue-400" />
        Upload New Images
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Title*
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter image title"
              required
            />
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="nature, sunset, beach"
            />
          </div>
        </div>

        <div
          className={`relative border-2 border-dashed rounded-lg p-6 
            ${
              dragActive
                ? "border-blue-500 bg-gray-700"
                : "border-gray-600 hover:border-blue-400 hover:bg-gray-700"
            } 
            transition-all cursor-pointer flex flex-col items-center justify-center`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            multiple
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />

          <FaUpload className="text-blue-400 text-3xl mb-3" />
          <p className="text-gray-200 font-medium mb-1">
            Drag & drop your images here
          </p>
          <p className="text-gray-400 text-sm">
            or click to browse from your computer
          </p>
        </div>

        {files.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-300 mb-2">
              {files.length} {files.length === 1 ? "file" : "files"} selected:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {files.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg bg-gray-100 overflow-hidden">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-white/80 hover:bg-white rounded-full p-1 shadow-sm group-hover:opacity-100 opacity-0 transition-opacity"
                    aria-label="Remove file"
                  >
                    <FaTimes className="text-red-500 w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-6 rounded-lg transition-colors disabled:bg-blue-400"
        >
          {uploading ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <FaUpload />
              <span>
                Upload {files.length > 0 ? `${files.length} Images` : "Images"}
              </span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

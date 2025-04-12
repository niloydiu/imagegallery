"use client";

import Link from "next/link";
import { useState } from "react";
import { FaCamera, FaImages, FaSearch } from "react-icons/fa";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="flex items-center justify-between mb-3 md:mb-0">
          <Link
            href="/"
            className="text-2xl font-bold flex items-center gap-2 hover:text-blue-200 transition-colors"
          >
            <FaImages className="h-6 w-6" />
            <span>Image Gallery</span>
          </Link>
        </div>

        <form
          onSubmit={handleSearch}
          className="relative w-full md:w-2/5 mb-3 md:mb-0"
        >
          <div className="flex items-center bg-white/15 backdrop-blur-sm rounded-full overflow-hidden border border-white/30 hover:border-white/50 transition-all focus-within:ring-2 focus-within:ring-white/40 focus-within:border-white/50 focus-within:bg-white/20 focus-within:shadow-lg shadow-md">
            <div className="flex items-center pl-4 text-white/70">
              <FaSearch className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search by title or tags..."
              className="w-full px-3 py-3 bg-transparent text-white placeholder-white/70 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className=" text-white px-5 py-2 transition-colors font-medium flex items-center justify-center"
              aria-label="Search"
            >
              Search
            </button>
          </div>
        </form>

        <div className="hidden md:block">
          <Link
            href="/#upload"
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all border border-white/20"
          >
            <FaCamera />
            <span>Upload</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

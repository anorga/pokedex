import React, { useState, setIsFocused, isFocused } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import magnify from "./assets/magnifying_glass.png"

function Search({ toNextPage, toPrevPage, handleSearchChange, currentPage }) {
  return (
    <div className="bg-white flex justify-center py-5">
      {/* Left Button */}
      <button
        type="button"
        className={`px-4 py-4 mx-5 md:mx-20 ${
          currentPage === 1
            ? "cursor-not-allowed"
            : "bg-white"
        }`}
        onClick={toPrevPage}
        disabled={currentPage === 1}
      >
        <span className="sr-only">Previous</span>
        <ChevronLeftIcon className="h-12 w-12" aria-hidden="true" />
      </button>
      {/* Search Bar */}
      <form className="my-auto">
        <div className="relative flex items-center">
          <input
            className="h-12 md:h-14 w-48 text-3xl placeholder-black focus:outline-none text-center pr-10 placeholder-shown:text-center focus:placeholder-opacity-0"
            placeholder={isFocused ? "" : "Search"}
            type="text"
            onChange={handleSearchChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {/* Search Icon */}
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <span className="sr-only">Submit Search</span>
            <img src={magnify} alt="Search" className="w-8 h-8" />
          </button>
        </div>
      </form>
      {/* Right Button */}
      <button
        type="button"
        className="px-4 py-4 mx-5 md:mx-20"
        onClick={toNextPage}
      >
        <span className="sr-only">Next</span>
        <ChevronRightIcon className="h-12 w-12" aria-hidden="true" />
      </button>
    </div>
  );
}

export default Search;

import React, { useState } from "react";

interface SearchBoxProps {
  onSearch: (query: string, criteria: string) => void; // Define the onSearch prop type
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("name");

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchCriteriaChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSearchCriteria(event.target.value);
  };

  const handleSearch = () => {
    onSearch(searchQuery, searchCriteria); // Call the parent function with search input
  };

  return (
    <div className="flex items-center gap-1 sm:gap-4 mb-4">
      <div className="flex items-center ">
        <span className="hidden sm:flex text-sm md:text-[1rem] mr-2">
          Search by:
        </span>
        <select
          value={searchCriteria}
          onChange={handleSearchCriteriaChange}
          className="border border-gray-300 rounded-md p-1"
        >
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="role">Role</option>
        </select>
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchInputChange}
        placeholder="Search..."
        className="border border-gray-300 rounded-md p-1 flex-grow"
      />
      <button
        onClick={handleSearch}
        className="px-1 sm:px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBox;

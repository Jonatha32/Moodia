import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative">
      <div className={`flex items-center bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 ${isActive ? 'border-primary-purple shadow-primary' : 'border-gray-100'}`}>
        <div className="pl-4 pr-2">
          <svg className="w-5 h-5 text-neutral-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          placeholder="Buscar usuarios, moods, contenido..."
          className="flex-1 py-4 px-2 bg-transparent focus:outline-none font-lato text-neutral-text placeholder-neutral-secondary"
        />
        {query && (
          <button
            onClick={() => handleSearch('')}
            className="pr-4 text-neutral-secondary hover:text-neutral-text transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
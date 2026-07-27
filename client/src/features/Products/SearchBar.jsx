import { useEffect, useRef, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

function SearchBar({ onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  function handleSearch(e) {
    e.preventDefault();

    const text = query.trim();
    if (!text) return;

    navigate(`/search?q=${encodeURIComponent(text)}`);
    onClose();
  }

  return (
    <div
      ref={searchRef}
      className="fixed top-20 inset-x-0 z-500 mx-auto w-full border-b border-gray-200 bg-white px-4 py-3 md:w-[50%]"
    >
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <IoIosSearch className="h-5 w-5 text-gray-500" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full text-sm outline-none"
          autoFocus
        />

        <button
          type="button"
          onClick={onClose}
          className="text-sm text-gray-500 hover:text-black"
        >
          Close
        </button>
      </form>
    </div>
  );
}

export default SearchBar;

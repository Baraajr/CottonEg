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
      className="fixed inset-x-0 top-16 z-500 mx-auto w-full border-b border-border bg-background px-4 py-4 shadow-lg md:top-20 md:w-[50%]"
    >
      <form onSubmit={handleSearch} className="flex items-center gap-3">
        <IoIosSearch className="h-5 w-5 shrink-0 text-muted-foreground" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          autoFocus
        />

        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
        >
          Close
        </button>
      </form>
    </div>
  );
}

export default SearchBar;

// SearchBar.jsx
import React, { useState } from 'react';

function SearchBar({ onSearch, onSort }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleSortChange = (e) => {
    onSort(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Sök..."
        value={searchTerm}
        onChange={handleChange}
      />
      <select onChange={handleSortChange} defaultValue="lowest">
        <option value="lowest">Lägsta pris först</option>
        <option value="highest">Högsta pris först</option>
      </select>
    </div>
  );
}

export default SearchBar;

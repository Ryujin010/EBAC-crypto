import { useEffect, useState } from 'react';
import useDebounce from '../hooks/useDebounce';

// El texto vive en estado local; a la página solo le avisamos cuando el usuario hace una pausa

function SearchBar({ initialValue = '', onSearch, delay = 500 }) {
  const [text, setText] = useState(initialValue);
  const debounced = useDebounce(text, delay);

  useEffect(() => {
    onSearch(debounced.trim());
  }, [debounced, onSearch]);

  return (
    <div className="field search">
      <label htmlFor="coin-search">Buscar moneda</label>
      <input
        id="coin-search"
        type="search"
        value={text}
        placeholder="Bitcoin, ETH, solana…"
        autoComplete="off"
        onChange={(event) => setText(event.target.value)}
      />
    </div>
  );
}

export default SearchBar;
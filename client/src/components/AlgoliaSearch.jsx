import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import algoliasearch from 'algoliasearch';
import {
  InstantSearch,
  SearchBox,
  Hits,
  Configure
} from 'react-instantsearch';

// Initialize the Algolia client
const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_KEY
);

const Hit = ({ hit }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => navigate(`/product/${hit.objectID}`)}
      className="cursor-pointer p-2 hover:bg-gray-100"
    >
      <div className="flex items-center gap-4">
        <img 
          src={hit.image} 
          alt={hit.name} 
          className="w-12 h-12 object-cover rounded"
        />
        <div>
          <p className="font-medium">{hit.name}</p>
          <p className="text-sm text-gray-600">${hit.price}</p>
        </div>
      </div>
    </div>
  );
};

const AlgoliaSearch = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <InstantSearch 
        searchClient={searchClient}
        indexName="products"
      >
        <SearchBox
          onFocus={() => setIsOpen(true)}
          placeholder="Search products..."
          className="w-full"
        />
        {isOpen && (
          <div 
            className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg z-50"
            onMouseLeave={() => setIsOpen(false)}
          >
            <Configure hitsPerPage={5} />
            <Hits hitComponent={Hit} />
          </div>
        )}
      </InstantSearch>
    </div>
  );
};

export default AlgoliaSearch;
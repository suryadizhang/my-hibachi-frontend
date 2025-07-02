import React, { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { Form, InputGroup, Button, Dropdown, Badge, Card, ListGroup } from 'react-bootstrap';
import './AdminComponents.css';

/**
 * 🔍 ADVANCED SEARCH SYSTEM
 * Comprehensive search with autocomplete, saved searches, and smart filters
 */
const AdvancedSearchSystem = memo(({
  onSearch,
  searchValue = '',
  savedSearches = [],
  onSaveSearch,
  onDeleteSearch,
  quickFilters = [],
  searchHistory = [],
  placeholder = 'Search bookings, customers, or IDs...'
}) => {
  const [query, setQuery] = useState(searchValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [activeQuickFilters, setActiveQuickFilters] = useState([]);
  const [searchType, setSearchType] = useState('all');

  // Search suggestions based on query
  const suggestions = useMemo(() => {
    if (!query || query.length < 2) return [];

    const searchSuggestions = [
      // Customer suggestions
      { type: 'customer', value: `customer:${query}`, label: `Customer: ${query}`, icon: '👤' },
      { type: 'phone', value: `phone:${query}`, label: `Phone: ${query}`, icon: '📞' },
      { type: 'email', value: `email:${query}`, label: `Email: ${query}`, icon: '📧' },
      
      // Booking suggestions
      { type: 'id', value: `id:${query}`, label: `Booking ID: ${query}`, icon: '🔢' },
      { type: 'date', value: `date:${query}`, label: `Date: ${query}`, icon: '📅' },
      { type: 'status', value: `status:${query}`, label: `Status: ${query}`, icon: '📊' },
      
      // Amount suggestions
      { type: 'amount', value: `amount:>${query}`, label: `Amount greater than $${query}`, icon: '💰' },
      { type: 'amount', value: `amount:<${query}`, label: `Amount less than $${query}`, icon: '💰' },
    ];

    return searchSuggestions.filter(suggestion => 
      suggestion.label.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);
  }, [query]);

  // Handle search input change
  const handleQueryChange = useCallback((value) => {
    setQuery(value);
    setShowSuggestions(value.length >= 2);
    
    // Debounced search
    const timeoutId = setTimeout(() => {
      if (value.length >= 2 || value === '') {
        onSearch({
          query: value,
          type: searchType,
          quickFilters: activeQuickFilters
        });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [onSearch, searchType, activeQuickFilters]);

  // Handle suggestion selection
  const handleSuggestionClick = useCallback((suggestion) => {
    setQuery(suggestion.value);
    setShowSuggestions(false);
    onSearch({
      query: suggestion.value,
      type: suggestion.type,
      quickFilters: activeQuickFilters
    });
  }, [onSearch, activeQuickFilters]);

  // Handle quick filter toggle
  const handleQuickFilterToggle = useCallback((filter) => {
    setActiveQuickFilters(prev => {
      const newFilters = prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter];
      
      // Trigger search with new filters
      onSearch({
        query,
        type: searchType,
        quickFilters: newFilters
      });
      
      return newFilters;
    });
  }, [query, searchType, onSearch]);

  // Handle saved search
  const handleSaveSearch = useCallback(() => {
    if (query.trim()) {
      const searchToSave = {
        id: Date.now(),
        name: query.length > 30 ? `${query.substring(0, 30)}...` : query,
        query,
        type: searchType,
        quickFilters: activeQuickFilters,
        createdAt: new Date().toISOString()
      };
      onSaveSearch(searchToSave);
    }
  }, [query, searchType, activeQuickFilters, onSaveSearch]);

  // Handle saved search selection
  const handleSavedSearchClick = useCallback((savedSearch) => {
    setQuery(savedSearch.query);
    setSearchType(savedSearch.type);
    setActiveQuickFilters(savedSearch.quickFilters);
    setShowSavedSearches(false);
    
    onSearch({
      query: savedSearch.query,
      type: savedSearch.type,
      quickFilters: savedSearch.quickFilters
    });
  }, [onSearch]);

  // Search type options
  const searchTypes = [
    { key: 'all', label: 'All Fields', icon: '🔍' },
    { key: 'customer', label: 'Customer', icon: '👤' },
    { key: 'booking', label: 'Booking', icon: '📅' },
    { key: 'payment', label: 'Payment', icon: '💰' }
  ];

  return (
    <Card className="advanced-search-system mb-4">
      <Card.Body>
        {/* Main Search Input */}
        <InputGroup className="mb-3">
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" size="sm" className="search-type-toggle">
              {searchTypes.find(t => t.key === searchType)?.icon} {searchTypes.find(t => t.key === searchType)?.label}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {searchTypes.map(type => (
                <Dropdown.Item
                  key={type.key}
                  active={searchType === type.key}
                  onClick={() => setSearchType(type.key)}
                >
                  {type.icon} {type.label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Form.Control
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setShowSuggestions(query.length >= 2)}
            className="search-input"
          />

          <Button 
            variant="primary" 
            onClick={handleSaveSearch}
            disabled={!query.trim()}
            title="Save this search"
          >
            💾
          </Button>

          <Dropdown show={showSavedSearches} onToggle={setShowSavedSearches}>
            <Dropdown.Toggle variant="outline-primary" className="saved-searches-toggle">
              📚 Saved ({savedSearches.length})
            </Dropdown.Toggle>
            <Dropdown.Menu className="saved-searches-menu">
              {savedSearches.length === 0 ? (
                <Dropdown.Item disabled>No saved searches</Dropdown.Item>
              ) : (
                savedSearches.map(saved => (
                  <div key={saved.id} className="saved-search-item d-flex justify-content-between align-items-center px-3 py-2">
                    <span 
                      className="saved-search-name flex-grow-1 cursor-pointer"
                      onClick={() => handleSavedSearchClick(saved)}
                    >
                      {saved.name}
                    </span>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-danger p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSearch(saved.id);
                      }}
                    >
                      🗑️
                    </Button>
                  </div>
                ))
              )}
            </Dropdown.Menu>
          </Dropdown>
        </InputGroup>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <Card className="search-suggestions mb-3">
            <ListGroup variant="flush">
              {suggestions.map((suggestion, index) => (
                <ListGroup.Item
                  key={index}
                  action
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="d-flex align-items-center"
                >
                  <span className="me-2">{suggestion.icon}</span>
                  <span>{suggestion.label}</span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        )}

        {/* Quick Filters */}
        {quickFilters.length > 0 && (
          <div className="quick-filters">
            <small className="text-muted me-2">Quick Filters:</small>
            {quickFilters.map(filter => (
              <Badge
                key={filter.key}
                bg={activeQuickFilters.includes(filter.key) ? 'primary' : 'outline-secondary'}
                className="me-2 mb-2 cursor-pointer quick-filter-badge"
                onClick={() => handleQuickFilterToggle(filter.key)}
              >
                {filter.icon} {filter.label}
                {activeQuickFilters.includes(filter.key) && ' ✕'}
              </Badge>
            ))}
            {activeQuickFilters.length > 0 && (
              <Button
                variant="link"
                size="sm"
                className="clear-filters-btn"
                onClick={() => {
                  setActiveQuickFilters([]);
                  onSearch({ query, type: searchType, quickFilters: [] });
                }}
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}

        {/* Search Stats */}
        {query && (
          <div className="search-stats mt-2">
            <small className="text-muted">
              Search type: <strong>{searchTypes.find(t => t.key === searchType)?.label}</strong>
              {activeQuickFilters.length > 0 && (
                <> • Filters: <strong>{activeQuickFilters.length}</strong></>
              )}
            </small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
});

AdvancedSearchSystem.displayName = 'AdvancedSearchSystem';

export default AdvancedSearchSystem;

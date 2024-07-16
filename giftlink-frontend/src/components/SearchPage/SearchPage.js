import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { urlConfig } from "../../config";

function SearchPage() {
  // Task 1: Define state variables for the search query, age range, and search results.
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [ageRange, setAgeRange] = useState(10); // Default age range value
  const [searchResults, setSearchResults] = useState([]);

  const categories = ["Living", "Bedroom", "Bathroom", "Kitchen", "Office"];
  const conditions = ["New", "Like New", "Older"];

  useEffect(() => {
    // fetch all products
    const fetchProducts = async () => {
      try {
        let url = `${urlConfig.backendUrl}/api/gifts`;
        console.log(url);
        const response = await fetch(url);
        if (!response.ok) {
          // something went wrong
          throw new Error(`HTTP error; ${response.status}`);
        }
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.log("Fetch error: " + error.message);
      }
    };

    fetchProducts();
  }, []);

  // Task 2. Fetch search results from the API based on user inputs.
  const handleSearch = async () => {
    try {
      let url = `${urlConfig.backendUrl}/api/gifts?query=${searchQuery}&category=${selectedCategory}&condition=${selectedCondition}&ageRange=${ageRange}`;
      console.log(url);
      const response = await fetch(url);
      if (!response.ok) {
        // something went wrong
        throw new Error(`HTTP error; ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.log("Fetch error: " + error.message);
    }
  };

  const navigate = useNavigate();

  const goToDetailsPage = (productId) => {
    // Task 6. Enable navigation to the details page of a selected gift.
    navigate(`/app/product/${productId}`);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="filter-section mb-3 p-3 border rounded">
            <h5>Filters</h5>
            <div className="d-flex flex-column">
              {/* Task 3: Dynamically generate category and condition dropdown options. */}
              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <select
                  id="category"
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="condition" className="form-label">
                  Condition
                </label>
                <select
                  id="condition"
                  className="form-select"
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                >
                  <option value="">All Conditions</option>
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>
              {/* Task 4: Implement an age range slider and display the selected value. */}
              <div className="mb-3">
                <label htmlFor="ageRange" className="form-label">
                  Age Range (Years)
                </label>
                <input
                  type="range"
                  className="form-range"
                  id="ageRange"
                  min="0"
                  max="20"
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                />
                <div>Selected Age Range: {ageRange} years</div>
              </div>
            </div>
          </div>
          {/* Task 7: Add text input field for search criteria */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Task 8: Implement search button with onClick event to trigger search */}
          <button onClick={handleSearch} className="btn btn-primary mb-3">
            Search
          </button>
          {/* Task 5: Display search results and handle empty results with a message */}
          <div>
            {searchResults.length > 0 ? (
              searchResults.map((gift) => (
                <div key={gift.id} className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">{gift.name}</h5>
                    <p className="card-text">Category: {gift.category}</p>
                    <p className="card-text">Condition: {gift.condition}</p>
                    <button
                      onClick={() => goToDetailsPage(gift.id)}
                      className="btn btn-primary"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div>No results found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;

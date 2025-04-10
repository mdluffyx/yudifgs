/**
 * This script provides a fallback for saving products when PHP is not available.
 * It uses the browser's localStorage to save product data.
 */
const PRODUCTS_KEY = 'amazonProducts';
const PRODUCTS_FILE = 'products.json';
/**
 * Fetches products from products.json and saves them to local storage.
 * If fetching fails, attempts to load products from local storage.
 * If both fail, displays an alert.
 */
function initializeProducts() {
  fetch(PRODUCTS_FILE)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch ${PRODUCTS_FILE}: ${response.status}`);
      }
      return response.json();
    })
    .then(products => {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      console.log('Products fetched and saved to local storage.');
    })
    .catch(error => {
      console.error(error);
      const storedProducts = localStorage.getItem(PRODUCTS_KEY);
      if (storedProducts) {
        console.log('Loaded products from local storage.');
      } else {
        alert(`Failed to load products from ${PRODUCTS_FILE} or local storage.`);
      }
    });
  }
  
  // Call the function to initialize products
  initializeProducts();
  
  // Export the function for use in other modules if needed
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeProducts };
  }

/**
 * This script provides a fallback for saving products when PHP is not available.
 * It uses the browser's localStorage to save product data.
 */

// Function to save products to localStorage
function saveProductsToLocalStorage(products) {
    try {
        localStorage.setItem('amazonProducts', JSON.stringify(products));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

// Function to load products from localStorage
function loadProductsFromLocalStorage() {
    try {
        const productsJson = localStorage.getItem('amazonProducts');
        if (productsJson) {
            return JSON.parse(productsJson);
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
    return null;
}

// Function to download products as a JSON file
function downloadProductsAsJson(products) {
    const productsJson = JSON.stringify(products, null, 2);
    const blob = new Blob([productsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        saveProductsToLocalStorage,
        loadProductsFromLocalStorage,
        downloadProductsAsJson
    };
}

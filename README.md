# Amazon Links Website

This is a personal website with social media links and Amazon product recommendations.

## Features

- Social media links (Instagram, TikTok, Spotify)
- Amazon product recommendations
- Admin interface for managing Amazon products

## How to Add Amazon Products

### Using the Admin Interface

1. Click the "Admin" link in the footer of the website
2. Login with the password: `admin123`
3. In the admin panel, simply paste an Amazon product URL
4. Click "Fetch" to automatically extract product details
5. Click "Add Product" to add it to your website
6. Click "Save All Changes" to save your changes

### How It Works

The system uses multiple methods to handle product information:

1. **Server-side extraction** (PHP): This is the preferred method and provides the most accurate information. It requires PHP to be available on your server.

2. **Client-side fallback for extraction**: If PHP is not available, the system will use a JavaScript fallback to extract basic information from the URL. This method is limited and may not provide complete product details.

3. **Multiple storage options**:
   - **PHP server-side storage**: Saves products to a JSON file on the server (requires PHP)
   - **Browser localStorage**: Automatically saves products in the browser's local storage
   - **JSON file download**: As a last resort, downloads the products as a JSON file that you can manually upload

## Technical Details

### Files

- `index.html` - The main website
- `admin.html` - Admin login page
- `admin-panel.html` - Admin panel for managing products
- `products.json` - JSON file storing product data
- `fetch-amazon-data.php` - PHP script for extracting product data from Amazon
- `save-products.php` - PHP script for saving product data
- `amazon-parser.js` - JavaScript fallback for parsing Amazon URLs
- `local-storage-fallback.js` - JavaScript fallback for storing products in browser localStorage

### Requirements

- Web server with PHP support (recommended)
- Modern web browser

### Security Note

This admin interface uses a simple client-side password check. For a production environment, you should implement a more secure authentication system.

## Customization

You can customize the website by:

1. Changing the background image
2. Updating social media links
3. Modifying the styling in the HTML/CSS
4. Changing the admin password in `admin.html`

## Troubleshooting

### If you encounter issues with the PHP scripts:

1. Make sure your server supports PHP
2. Check that the PHP files have the correct permissions
3. Look for error messages in your server logs

### If you can't save products:

The system will automatically try these methods in order:

1. Save using PHP to the server (requires PHP support)
2. Save to your browser's localStorage (works without PHP)
3. Download as a JSON file (manual method)

If you get a downloaded JSON file, you can manually upload it to your server as `products.json`.

### If the automatic product data extraction doesn't work:

1. Try a different Amazon product URL
2. Make sure the URL is from the main Amazon product page
3. The system will still work but with limited product information

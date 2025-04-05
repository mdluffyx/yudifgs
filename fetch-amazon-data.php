<?php
// This script fetches product data from an Amazon URL

// Allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Get the Amazon URL from the request
$amazonUrl = isset($_GET['url']) ? $_GET['url'] : '';

if (empty($amazonUrl)) {
    http_response_code(400);
    echo json_encode(['error' => 'No Amazon URL provided']);
    exit;
}

// Function to fetch and parse Amazon product data
function fetchAmazonProductData($url) {
    // Set up a user agent to mimic a browser
    $userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    
    // Initialize cURL session
    $ch = curl_init();
    
    // Set cURL options
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, $userAgent);
    
    // Execute cURL session
    $html = curl_exec($ch);
    
    // Check for cURL errors
    if (curl_errno($ch)) {
        curl_close($ch);
        return [
            'error' => 'Failed to fetch product data: ' . curl_error($ch)
        ];
    }
    
    // Close cURL session
    curl_close($ch);
    
    // Parse the HTML to extract product information
    // Note: This is a simplified version and may break if Amazon changes their page structure
    
    // Extract product name
    preg_match('/<span id="productTitle"[^>]*>\s*(.*?)\s*<\/span>/s', $html, $nameMatches); // Added whitespace handling
    $name = isset($nameMatches[1]) ? trim(strip_tags($nameMatches[1])) : 'Unknown Product';
    
    // Extract product image
    preg_match('/"large":"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/s', $html, $imageMatches);
    $image = isset($imageMatches[1]) ? $imageMatches[1] : '';
    
    // Extract product price
    preg_match('/<span class="a-offscreen"[^>]*>(.*?)<\/span>/s', $html, $priceMatches); // Look for price within specific span
    $price = isset($priceMatches[0]) ? $priceMatches[0] : '$0.00';
    
    // Extract product rating
    preg_match('/<span.*?class=".*?a-icon-alt".*?>\s*([0-9.]+)\s*out of 5 stars\s*<\/span>/s', $html, $ratingMatches); // Look for rating within specific span
    $rating = isset($ratingMatches[1]) ? $ratingMatches[1] : '0.0';
    
    return [
        'name' => $name,
        'image' => $image,
        'price' => $price,
        'rating' => $rating,
        'url' => $url
    ];
}

// Attempt to fetch product data
$productData = fetchAmazonProductData($amazonUrl);

// Return the product data as JSON
echo json_encode($productData);
?>

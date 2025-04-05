<?php
// Get the JSON data from the request
$json_data = file_get_contents('php://input');

// Validate JSON
$products = json_decode($json_data);
if ($products === null && json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

// Save the JSON data to the products.json file
$result = file_put_contents('products.json', $json_data);

if ($result === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save products']);
    exit;
}

// Return success response
http_response_code(200);
echo json_encode(['success' => true]);
?>

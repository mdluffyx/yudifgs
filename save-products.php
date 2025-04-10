<?php
$method = $_SERVER['REQUEST_METHOD'];

function log_error($message) {
    $log_file = 'error.log';
    $timestamp = date('Y-m-d H:i:s');
    error_log("[{$timestamp}] {$message}\n", 3, $log_file);
}

if ($method == 'POST') {
    try {
        // Get the JSON data from the request
        $json_data = file_get_contents('php://input');

        // Validate JSON
        $new_product = json_decode($json_data, true);
        if ($new_product === null && json_last_error() !== JSON_ERROR_NONE) {
            $error_message = 'Invalid JSON data: ' . json_last_error_msg();
            log_error($error_message);
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => $error_message]);
            exit;
        }

        // Read the existing products
        $products_json = @file_get_contents('products.json');
        if ($products_json === false) {
            $error_message = 'Could not read products.json';
            log_error($error_message);
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $error_message]);
            exit;
        }
        $products = json_decode($products_json, true);

        if (!is_array($products)) {
            $products = [];
        }

        // Check if a product with the same ASIN already exists
        $product_exists = false;
        foreach ($products as $product) {
            if ($product['asin'] == $new_product['asin']) {
                $product_exists = true;
                break;
            }
        }

        // If the product doesn't exist, add it
        if (!$product_exists) {
            $products[] = $new_product;

            // Save the updated products array to the products.json file
            if (file_put_contents('products.json', json_encode($products)) !== false) {
                http_response_code(200);
                echo json_encode(['status' => 'success']);
            } else {
                $error_message = 'Failed to save products to products.json';
                log_error($error_message);
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => $error_message]);
            }
        } else {
            http_response_code(200);
            echo json_encode(['status' => 'success', 'message' => 'Product already exists']);
        }
    } catch (Exception $e) {
        log_error('An unexpected error occurred: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'An unexpected error occurred: ' . $e->getMessage()]);
    }
}
?>

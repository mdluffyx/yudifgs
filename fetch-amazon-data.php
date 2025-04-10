<?php
// Allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$url = $_GET['url'] ?? '';
$logFile = 'error.log';

if (empty($url)) {
    $errorMessage = 'URL parameter is required.';
    error_log(date('[Y-m-d H:i:s]') . " " . $errorMessage . PHP_EOL, 3, $logFile);
    echo json_encode(['status' => 'error', 'message' => $errorMessage]);
    exit;
}

try {
    $content = @file_get_contents($url);

    if ($content === FALSE) {
        $error = error_get_last();
        $errorMessage = 'Failed to retrieve content from URL: ' . $error['message'];
        error_log(date('[Y-m-d H:i:s]') . " " . $errorMessage . PHP_EOL, 3, $logFile);
        echo json_encode(['status' => 'error', 'message' => $errorMessage]);
        exit;
    }

    $http_response_header = $http_response_header ?? [];
    $headers = [];
    foreach ($http_response_header as $header) {
        $headers[] = $header;
    }

    echo json_encode([
        'status' => 'success',
        'data' => $content
    ]);
} catch (Exception $e) {
    $errorMessage = 'An unexpected error occurred: ' . $e->getMessage();
    error_log(date('[Y-m-d H:i:s]') . " " . $errorMessage . PHP_EOL, 3, $logFile);
    echo json_encode(['status' => 'error', 'message' => $errorMessage]);
    exit;
}

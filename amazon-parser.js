async function fetchAndParseAmazonProduct(url) {
  try {
    const response = await fetch('fetch-amazon-data.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'url=' + encodeURIComponent(url),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product data');
    }

    const data = await response.json();

    if (!data.asin || !data.title || !data.price || !data.imageUrl || !data.description) {
      throw new Error('Could not extract all required product information');
    }

    return {
      asin: data.asin,
      title: data.title,
      price: data.price,
      imageUrl: data.imageUrl,
      description: data.description,
    };
  } catch (error) {
    console.error("Error fetching and parsing Amazon product:", error);
    alert("Could not retrieve the product information. Please check the URL and try again.");
    return null;
  }
}

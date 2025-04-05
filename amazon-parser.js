/**
 * This is a fallback solution for environments where PHP is not available.
 * It provides a way to manually add Amazon product information.
 */

// Function to extract ASIN from Amazon URL
function extractAsinFromUrl(url) {
    // Common patterns for Amazon URLs
    const patterns = [
        /\/dp\/([A-Z0-9]{10})/i,
        /\/product\/([A-Z0-9]{10})/i,
        /\/gp\/product\/([A-Z0-9]{10})/i,
        /\/ASIN\/([A-Z0-9]{10})/i,
        /\/([A-Z0-9]{10})(?:\/|\?|$)/i,
        /amzn.to\/([A-Z0-9]{10})/i,
        /amazon.com.*(?:tag=|linkCode=|&linkId=).*?(?:&th=|&psc=|&ref=|$)/i  // SiteStripe links
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    // Special handling for SiteStripe links
    if (url.includes('amazon.com') && (url.includes('tag=') || url.includes('linkCode='))) {
        // Try to extract from the URL path
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');

            // Look for dp/ or gp/product/ patterns
            for (let i = 0; i < pathParts.length; i++) {
                if ((pathParts[i] === 'dp' || pathParts[i] === 'product') && i < pathParts.length - 1) {
                    const potentialAsin = pathParts[i+1];
                    if (potentialAsin && potentialAsin.length === 10 && /^[A-Z0-9]{10}$/i.test(potentialAsin)) {
                        return potentialAsin;
                    }
                }
            }
        } catch (e) {
            console.error('Error parsing SiteStripe URL:', e);
        }
    }

    return null;
}

// Function to generate Amazon image URL from ASIN
function generateAmazonImageUrl(asin) {
    if (!asin) return '';
    // Use a larger image format that's more likely to work
    return `https://m.media-amazon.com/images/P/${asin}._AC_SL500_.jpg`;
}

// Function to parse Amazon URL and extract basic information
function parseAmazonUrl(url) {
    // Extract ASIN
    const asin = extractAsinFromUrl(url);

    // Extract product name from URL
    let name = 'Amazon Product';
    try {
        // Try to get product name from URL
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');

        // Find the part that might be the product name
        for (let i = 0; i < pathParts.length; i++) {
            if (pathParts[i] === 'dp' || pathParts[i] === 'product' || pathParts[i] === 'gp') {
                if (i > 0 && pathParts[i-1].length > 3) {
                    // Convert URL-friendly format to readable text
                    name = pathParts[i-1]
                        .replace(/-/g, ' ')
                        .replace(/\b\w/g, l => l.toUpperCase());
                    break;
                }
            }
        }
    } catch (e) {
        console.error('Error parsing URL:', e);
    }

    // Generate a random price between $19.99 and $199.99
    const randomPrice = (Math.floor(Math.random() * 18000) / 100 + 19.99).toFixed(2);

    // Generate a random rating between 4.0 and 5.0
    const randomRating = (Math.floor(Math.random() * 10) / 10 + 4.0).toFixed(1);

    // If we have an ASIN, we can make a better guess at the product
    let productInfo = {
        name: name,
        url: url,
        image: generateAmazonImageUrl(asin),
        price: '$' + randomPrice,
        rating: randomRating
    };

    // If the URL contains certain keywords, we can make a better guess at the product category
    const lowerUrl = url.toLowerCase();

    // Check for common product categories
    if (lowerUrl.includes('headphone') || lowerUrl.includes('earbud') || lowerUrl.includes('airpod')) {
        productInfo.name = productInfo.name || 'Wireless Headphones';
        productInfo.image = productInfo.image || 'https://m.media-amazon.com/images/I/71NTi82uBEL._AC_SL1500_.jpg';
    } else if (lowerUrl.includes('kindle') || lowerUrl.includes('ebook') || lowerUrl.includes('reader')) {
        productInfo.name = productInfo.name || 'Kindle E-reader';
        productInfo.image = productInfo.image || 'https://m.media-amazon.com/images/I/61Ww4abGxPL._AC_SL1000_.jpg';
    } else if (lowerUrl.includes('watch') || lowerUrl.includes('smartwatch') || lowerUrl.includes('wearable')) {
        productInfo.name = productInfo.name || 'Smartwatch';
        productInfo.image = productInfo.image || 'https://m.media-amazon.com/images/I/71MHTK3AodL._AC_SL1500_.jpg';
    } else if (lowerUrl.includes('speaker') || lowerUrl.includes('echo') || lowerUrl.includes('alexa')) {
        productInfo.name = productInfo.name || 'Smart Speaker';
        productInfo.image = productInfo.image || 'https://m.media-amazon.com/images/I/71JB6hM6Z6L._AC_SL1000_.jpg';
    } else if (lowerUrl.includes('camera') || lowerUrl.includes('webcam') || lowerUrl.includes('security')) {
        productInfo.name = productInfo.name || 'Digital Camera';
        productInfo.image = productInfo.image || 'https://m.media-amazon.com/images/I/61zWy2tOQKL._AC_SL1500_.jpg';
    } else if (lowerUrl.includes('laptop') || lowerUrl.includes('notebook') || lowerUrl.includes('macbook')) {
        productInfo.name = productInfo.name || 'Laptop Computer';
        productInfo.image = productInfo.image || 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_SL1500_.jpg';
    } else if (lowerUrl.includes('phone') || lowerUrl.includes('iphone') || lowerUrl.includes('smartphone')) {
        productInfo.name = productInfo.name || 'Smartphone';
        productInfo.image = productInfo.image || 'https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_SL1500_.jpg';
    } else if (lowerUrl.includes('tablet') || lowerUrl.includes('ipad')) {
        productInfo.name = productInfo.name || 'Tablet';
        productInfo.image = productInfo.image || 'https://m.media-amazon.com/images/I/61NGnpjoRDL._AC_SL1500_.jpg';
    } else if (lowerUrl.includes('mouse') || lowerUrl.includes('keyboard')) {
        productInfo.name = productInfo.name || 'Computer Accessory';
        productInfo.image = productInfo.image || 'https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_SL1500_.jpg';
    } else if (lowerUrl.includes('charger') || lowerUrl.includes('power') || lowerUrl.includes('battery')) {
        productInfo.name = productInfo.name || 'Portable Charger';
        productInfo.image = productInfo.image || 'https://m.media-amazon.com/images/I/71IqJc4WHJL._AC_SL1500_.jpg';
    } else {
        // If no specific category is found, use a generic image if the ASIN image fails
        productInfo.image = productInfo.image || 'https://m.media-amazon.com/images/I/91vwHMt+x7L._AC_SL1500_.jpg';
    }

    return productInfo;
}

// Export the function for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseAmazonUrl };
}

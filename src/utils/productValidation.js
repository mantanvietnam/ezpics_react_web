/**
 * Utility functions for validating and sanitizing product data
 */

/**
 * Validates if a product object has the minimum required fields
 * @param {Object} product - The product object to validate
 * @returns {boolean} - True if product is valid, false otherwise
 */
export const isValidProduct = (product) => {
  if (!product || typeof product !== 'object') {
    return false;
  }

  // Check for required fields
  const requiredFields = ['id', 'name'];
  for (const field of requiredFields) {
    if (!product[field] || (typeof product[field] === 'string' && product[field].trim() === '')) {
      return false;
    }
  }

  return true;
};

/**
 * Sanitizes a product object by providing fallback values for missing or invalid fields
 * @param {Object} product - The product object to sanitize
 * @returns {Object} - Sanitized product object with fallback values
 */
export const sanitizeProduct = (product) => {
  if (!product || typeof product !== 'object') {
    return null;
  }

  const sanitized = {
    id: product.id || `fallback-${Date.now()}-${Math.random()}`,
    name: product.name || 'Sản phẩm không có tên',
    image: product.image || product.thumbnail || '/images/default-image.jpg',
    thumbnail: product.thumbnail || product.image || '/images/default-thumbnail.jpg',
    price: typeof product.price === 'number' && product.price >= 0 ? product.price : 0,
    sale_price: typeof product.sale_price === 'number' && product.sale_price >= 0 ? product.sale_price : 0,
    sold: typeof product.sold === 'number' && product.sold >= 0 ? product.sold : 0,
    free_pro: Boolean(product.free_pro),
    ecoin: typeof product.ecoin === 'number' && product.ecoin >= 0 ? product.ecoin : 0,
    // Copy other fields as-is if they exist
    ...Object.keys(product).reduce((acc, key) => {
      if (!['id', 'name', 'image', 'thumbnail', 'price', 'sale_price', 'sold', 'free_pro', 'ecoin'].includes(key)) {
        acc[key] = product[key];
      }
      return acc;
    }, {})
  };

  return sanitized;
};

/**
 * Filters an array of products, removing invalid ones and sanitizing valid ones
 * @param {Array} products - Array of product objects
 * @returns {Array} - Array of valid, sanitized products
 */
export const filterAndSanitizeProducts = (products) => {
  if (!Array.isArray(products)) {
    return [];
  }

  return products
    .filter(product => {
      try {
        return isValidProduct(product);
      } catch (error) {
        console.warn('Error validating product:', error, product);
        return false;
      }
    })
    .map(product => {
      try {
        return sanitizeProduct(product);
      } catch (error) {
        console.warn('Error sanitizing product:', error, product);
        return null;
      }
    })
    .filter(product => product !== null);
};

/**
 * Safe getter for product fields with fallback values
 * @param {Object} product - The product object
 * @param {string} field - The field to get
 * @param {*} fallback - Fallback value if field is missing or invalid
 * @returns {*} - The field value or fallback
 */
export const getProductField = (product, field, fallback = '') => {
  try {
    if (!product || typeof product !== 'object') {
      return fallback;
    }

    const value = product[field];
    
    // Handle different field types
    switch (field) {
      case 'price':
      case 'sale_price':
      case 'sold':
      case 'ecoin':
        return typeof value === 'number' && value >= 0 ? value : (typeof fallback === 'number' ? fallback : 0);
      case 'name':
        return typeof value === 'string' && value.trim() !== '' ? value : (fallback || 'Sản phẩm không có tên');
      case 'image':
        return typeof value === 'string' && value.trim() !== '' ? value : (fallback || '/images/default-image.jpg');
      case 'thumbnail':
        return typeof value === 'string' && value.trim() !== '' ? value : (fallback || '/images/default-thumbnail.jpg');
      default:
        return value !== undefined && value !== null ? value : fallback;
    }
  } catch (error) {
    console.warn(`Error getting field ${field} from product:`, error, product);
    return fallback;
  }
};

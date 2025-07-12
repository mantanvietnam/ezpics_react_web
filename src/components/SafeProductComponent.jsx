import React from 'react';
import ProductComponent from './ProductComponent';
import { isValidProduct, sanitizeProduct, getProductField } from '@/utils/productValidation';
import { Skeleton } from 'antd';

/**
 * Safe wrapper for ProductComponent that handles malformed product data
 * @param {Object} props - Component props
 * @param {Object} props.product - Product data (may be malformed)
 * @param {boolean} props.showError - Whether to show error state for invalid products
 * @param {React.ReactNode} props.fallback - Custom fallback component for invalid products
 * @returns {React.ReactElement} - Safe product component or fallback
 */
const SafeProductComponent = ({ 
  product, 
  showError = false, 
  fallback = null,
  ...otherProps 
}) => {
  // Handle null/undefined product
  if (!product) {
    if (fallback) return fallback;
    if (showError) {
      return (
        <div className="card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer w-full sm:w-58 p-4">
          <div className="text-center text-gray-500">
            <div className="text-sm">Không thể tải sản phẩm</div>
          </div>
        </div>
      );
    }
    return <Skeleton active />;
  }

  try {
    // Validate product data
    if (!isValidProduct(product)) {
      console.warn('Invalid product data:', product);
      
      if (fallback) return fallback;
      if (showError) {
        return (
          <div className="card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer w-full sm:w-58 p-4">
            <div className="text-center text-gray-500">
              <div className="text-sm">Dữ liệu sản phẩm không hợp lệ</div>
              {product?.name && (
                <div className="text-xs mt-1 truncate">{product.name}</div>
              )}
            </div>
          </div>
        );
      }
      return null; // Don't render invalid products by default
    }

    // Sanitize product data
    const sanitizedProduct = sanitizeProduct(product);
    if (!sanitizedProduct) {
      console.warn('Failed to sanitize product:', product);
      return fallback || null;
    }

    // Render the actual ProductComponent with sanitized data
    return <ProductComponent product={sanitizedProduct} {...otherProps} />;

  } catch (error) {
    console.error('Error rendering product component:', error, product);
    
    if (fallback) return fallback;
    if (showError) {
      return (
        <div className="card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer w-full sm:w-58 p-4">
          <div className="text-center text-red-500">
            <div className="text-sm">Lỗi hiển thị sản phẩm</div>
            <div className="text-xs mt-1">Vui lòng thử lại sau</div>
          </div>
        </div>
      );
    }
    return null;
  }
};

/**
 * Error boundary component for product rendering
 */
class ProductErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Product component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer w-full sm:w-58 p-4">
          <div className="text-center text-red-500">
            <div className="text-sm">Lỗi hiển thị sản phẩm</div>
            <div className="text-xs mt-1">Vui lòng thử lại sau</div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Enhanced SafeProductComponent with error boundary
 */
const SafeProductComponentWithBoundary = (props) => {
  return (
    <ProductErrorBoundary>
      <SafeProductComponent {...props} />
    </ProductErrorBoundary>
  );
};

export default SafeProductComponentWithBoundary;
export { SafeProductComponent, ProductErrorBoundary };

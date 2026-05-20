interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  specification?: string;
}

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image Section */}
        <div className="aspect-[4/5] w-full overflow-hidden bg-(--color-border)">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Details Section */}
        <div className="flex flex-col justify-start space-y-6">
          <div>
            <p className="text-sm text-(--color-secondary) uppercase tracking-wide">
              {product.category}
            </p>
            <h1 className="mt-2 text-4xl font-bold text-(--color-text)">
              {product.name}
            </h1>
          </div>

          <div className="flex items-baseline gap-4">
            <p className="text-3xl font-bold text-(--color-primary)">
              ${product.price.toFixed(2)}
            </p>
            {!product.inStock && (
              <span className="text-sm font-semibold text-(--color-danger)">
                Out of Stock
              </span>
            )}
            {product.inStock && (
              <span className="text-sm font-semibold text-(--color-success)">
                In Stock
              </span>
            )}
          </div>

          <p className="text-base text-(--color-text) leading-relaxed">
            {product.description}
          </p>

          {product.specification && (
            <div className="border-t border-b border-(--color-border) py-4">
              <h3 className="mb-2 font-semibold text-(--color-text)">
                Specifications
              </h3>
              <p className="text-sm text-(--color-secondary)">
                {product.specification}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

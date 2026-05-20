'use client';

interface SizeColorSelectorProps {
  sizes: string[];
  colors: string[];
  selectedSize: string | null;
  selectedColor: string | null;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
}

export function SizeColorSelector({
  sizes,
  colors,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
}: SizeColorSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Size Selection */}
      {sizes.length > 0 && (
        <div>
          <label className="mb-3 block font-semibold text-(--color-text)">
            Size
          </label>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                className={`border-2 px-4 py-2 font-semibold transition-colors ${
                  selectedSize === size
                    ? 'border-(--color-primary) bg-(--color-primary) text-(--color-surface)'
                    : 'border-(--color-border) bg-(--color-surface) text-(--color-text) hover:border-(--color-primary)'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {colors.length > 0 && (
        <div>
          <label className="mb-3 block font-semibold text-(--color-text)">
            Color
          </label>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => onColorChange(color)}
                className={`h-10 w-10 border-2 transition-transform hover:scale-110 ${
                  selectedColor === color
                    ? 'border-4 border-(--color-primary)'
                    : 'border-(--color-border)'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

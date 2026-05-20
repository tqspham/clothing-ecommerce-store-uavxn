import { supabase } from '@/lib/supabase';

interface ProductVariant {
  size: string;
  color: string;
}

interface ProductRow {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
  in_stock: boolean;
  clothing_ecommerce_store_uavxn_product_variants: ProductVariant[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const categories = searchParams.get('categories')?.split(',') || [];
    const sizes = searchParams.get('sizes')?.split(',') || [];
    const colors = searchParams.get('colors')?.split(',') || [];
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '10000');
    const sort = searchParams.get('sort') || 'popularity';

    let query = supabase
      .from('clothing_ecommerce_store_uavxn_products')
      .select(
        '*, clothing_ecommerce_store_uavxn_product_variants(size, color)'
      )
      .gte('price', minPrice)
      .lte('price', maxPrice);

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (category) {
      query = query.eq('category_id', category);
    }

    if (categories.length > 0) {
      query = query.in('category_id', categories);
    }

    const { data: products, error } = await query;

    if (error) throw error;

    let filtered = (products as ProductRow[]) || [];

    if (sizes.length > 0) {
      filtered = filtered.filter((p) =>
        p.clothing_ecommerce_store_uavxn_product_variants.some((v) =>
          sizes.includes(v.size)
        )
      );
    }

    if (colors.length > 0) {
      filtered = filtered.filter((p) =>
        p.clothing_ecommerce_store_uavxn_product_variants.some((v) =>
          colors.includes(v.color)
        )
      );
    }

    if (sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    const mappedProducts = filtered.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      description: p.description,
      imageUrl: p.image_url,
      category: p.category,
      inStock: p.in_stock,
      sizes: [
        ...new Set(
          p.clothing_ecommerce_store_uavxn_product_variants.map((v) => v.size)
        ),
      ],
      colors: [
        ...new Set(
          p.clothing_ecommerce_store_uavxn_product_variants.map((v) => v.color)
        ),
      ],
    }));

    return Response.json({
      products: mappedProducts,
      total: mappedProducts.length,
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return Response.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

import { supabase } from '@/lib/supabase';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: product, error } = await supabase
      .from('clothing_ecommerce_store_uavxn_products')
      .select(
        '*, clothing_ecommerce_store_uavxn_product_variants(size, color)'
      )
      .eq('id', id)
      .single();

    if (error || !product) {
      return Response.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const mappedProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      imageUrl: product.image_url,
      category: product.category,
      inStock: product.in_stock,
      specification: 'Premium quality garment with premium fabric composition',
      sizes: [
        ...new Set(
          product.clothing_ecommerce_store_uavxn_product_variants.map(
            (v: { size: string }) => v.size
          )
        ),
      ],
      colors: [
        ...new Set(
          product.clothing_ecommerce_store_uavxn_product_variants.map(
            (v: { color: string }) => v.color
          )
        ),
      ],
    };

    return Response.json({ product: mappedProduct });
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return Response.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

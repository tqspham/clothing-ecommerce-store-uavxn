import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: categories } = await supabase
      .from('clothing_ecommerce_store_uavxn_categories')
      .select('*')
      .order('name', { ascending: true });

    return Response.json({ categories: categories || [] });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return Response.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

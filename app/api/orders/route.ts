import { supabase } from '@/lib/supabase';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: orders } = await supabase
      .from('clothing_ecommerce_store_uavxn_orders')
      .select(
        `
        id,
        order_number,
        created_at,
        total,
        clothing_ecommerce_store_uavxn_order_items(
          product_id,
          name,
          quantity,
          price,
          size,
          color
        ),
        clothing_ecommerce_store_uavxn_shipping_addresses(
          full_name,
          street,
          city,
          state,
          postal_code,
          country
        )
      `
      )
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    const mappedOrders = (orders || []).map((order: any) => ({
      id: order.id,
      orderNumber: order.order_number,
      date: new Date(order.created_at).toLocaleDateString(),
      itemCount: order.clothing_ecommerce_store_uavxn_order_items.length,
      total: order.total,
      items: order.clothing_ecommerce_store_uavxn_order_items,
      shippingAddress: order.clothing_ecommerce_store_uavxn_shipping_addresses,
    }));

    return Response.json({ orders: mappedOrders });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return Response.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, subtotal, tax, shipping, total } = await request.json();

    const orderNumber = `ORD-${Date.now()}`;

    const { data: order, error: orderError } = await supabase
      .from('clothing_ecommerce_store_uavxn_orders')
      .insert({
        user_id: session.user.id,
        order_number: orderNumber,
        subtotal,
        tax,
        shipping,
        total,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError || !order) {
      return Response.json({ error: 'Failed to create order' }, { status: 500 });
    }

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));

    await supabase
      .from('clothing_ecommerce_store_uavxn_order_items')
      .insert(orderItems);

    return Response.json({
      orderId: order.id,
      orderNumber: order.order_number,
      total: order.total,
    });
  } catch (error) {
    console.error('Failed to create order:', error);
    return Response.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

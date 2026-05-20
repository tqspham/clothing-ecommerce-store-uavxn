import { supabase } from '@/lib/supabase';
import { auth } from '@/auth';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { shippingAddress, paymentMethod } = await request.json();

    // Get user's cart
    const { data: cart } = await supabase
      .from('clothing_ecommerce_store_uavxn_carts')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (!cart) {
      return Response.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    // Get cart items
    const { data: cartItems } = await supabase
      .from('clothing_ecommerce_store_uavxn_cart_items')
      .select(
        `
        id,
        product_id,
        size,
        color,
        quantity,
        clothing_ecommerce_store_uavxn_products(
          name,
          price
        )
      `
      )
      .eq('cart_id', cart.id);

    if (!cartItems || cartItems.length === 0) {
      return Response.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = cartItems.reduce(
      (sum: number, item: any) =>
        sum + item.clothing_ecommerce_store_uavxn_products.price * item.quantity,
      0
    );
    const tax = parseFloat((subtotal * 0.1).toFixed(2));
    const shipping = subtotal > 100 ? 0 : 10;
    const total = parseFloat((subtotal + tax + shipping).toFixed(2));

    // Save shipping address
    const { data: savedAddress } = await supabase
      .from('clothing_ecommerce_store_uavxn_shipping_addresses')
      .insert({
        user_id: session.user.id,
        full_name: shippingAddress.fullName,
        email: shippingAddress.email,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postal_code: shippingAddress.postalCode,
        country: shippingAddress.country,
        is_default: false,
      })
      .select()
      .single();

    // Create order
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
      return Response.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Add order items
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      name: item.clothing_ecommerce_store_uavxn_products.name,
      price: item.clothing_ecommerce_store_uavxn_products.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));

    await supabase
      .from('clothing_ecommerce_store_uavxn_order_items')
      .insert(orderItems);

    // Clear cart
    await supabase
      .from('clothing_ecommerce_store_uavxn_cart_items')
      .delete()
      .eq('cart_id', cart.id);

    return Response.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      total: order.total,
      message: 'Order placed successfully',
    });
  } catch (error) {
    console.error('Failed to process checkout:', error);
    return Response.json(
      { error: 'Failed to process checkout' },
      { status: 500 }
    );
  }
}

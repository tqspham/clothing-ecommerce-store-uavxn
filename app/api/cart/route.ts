import { supabase } from '@/lib/supabase';
import { auth } from '@/auth';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  imageUrl: string;
}

async function getCartForUser(userId: string) {
  let { data: cart } = await supabase
    .from('clothing_ecommerce_store_uavxn_carts')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!cart) {
    const { data: newCart } = await supabase
      .from('clothing_ecommerce_store_uavxn_carts')
      .insert({ user_id: userId })
      .select()
      .single();
    cart = newCart;
  }

  return cart;
}

async function getCartItems(cartId: string) {
  const { data: items } = await supabase
    .from('clothing_ecommerce_store_uavxn_cart_items')
    .select(
      `
      id,
      product_id,
      size,
      color,
      quantity,
      clothing_ecommerce_store_uavxn_products:product_id(
        name,
        price,
        image_url
      )
    `
    )
    .eq('cart_id', cartId);

  return items || [];
}

function calculateTotals(
  items: CartItem[]
): { subtotal: number; tax: number; shipping: number; total: number } {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = parseFloat((subtotal * 0.1).toFixed(2));
  const shipping = subtotal > 100 ? 0 : 10;
  const total = parseFloat((subtotal + tax + shipping).toFixed(2));

  return { subtotal, tax, shipping, total };
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cart = await getCartForUser(session.user.id);
    const items = await getCartItems(cart.id);

    const mappedItems: CartItem[] = items.map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      name: item.clothing_ecommerce_store_uavxn_products.name,
      price: item.clothing_ecommerce_store_uavxn_products.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      imageUrl: item.clothing_ecommerce_store_uavxn_products.image_url,
    }));

    const totals = calculateTotals(mappedItems);

    return Response.json({
      items: mappedItems,
      ...totals,
    });
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    return Response.json(
      { error: 'Failed to fetch cart' },
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

    const { productId, size, color, quantity } = await request.json();

    const cart = await getCartForUser(session.user.id);

    const { data: existingItem } = await supabase
      .from('clothing_ecommerce_store_uavxn_cart_items')
      .select('*')
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
      .eq('size', size)
      .eq('color', color)
      .single();

    if (existingItem) {
      await supabase
        .from('clothing_ecommerce_store_uavxn_cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id);
    } else {
      await supabase.from('clothing_ecommerce_store_uavxn_cart_items').insert({
        cart_id: cart.id,
        product_id: productId,
        size,
        color,
        quantity,
      });
    }

    const items = await getCartItems(cart.id);
    const mappedItems: CartItem[] = items.map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      name: item.clothing_ecommerce_store_uavxn_products.name,
      price: item.clothing_ecommerce_store_uavxn_products.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      imageUrl: item.clothing_ecommerce_store_uavxn_products.image_url,
    }));

    const totals = calculateTotals(mappedItems);

    return Response.json({
      items: mappedItems,
      ...totals,
    });
  } catch (error) {
    console.error('Failed to add to cart:', error);
    return Response.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cartItemId, quantity } = await request.json();

    if (quantity < 1) {
      await supabase
        .from('clothing_ecommerce_store_uavxn_cart_items')
        .delete()
        .eq('id', cartItemId);
    } else {
      await supabase
        .from('clothing_ecommerce_store_uavxn_cart_items')
        .update({ quantity })
        .eq('id', cartItemId);
    }

    const cart = await getCartForUser(session.user.id);
    const items = await getCartItems(cart.id);
    const mappedItems: CartItem[] = items.map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      name: item.clothing_ecommerce_store_uavxn_products.name,
      price: item.clothing_ecommerce_store_uavxn_products.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      imageUrl: item.clothing_ecommerce_store_uavxn_products.image_url,
    }));

    const totals = calculateTotals(mappedItems);

    return Response.json({
      items: mappedItems,
      ...totals,
    });
  } catch (error) {
    console.error('Failed to update cart:', error);
    return Response.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cartItemId } = await request.json();

    await supabase
      .from('clothing_ecommerce_store_uavxn_cart_items')
      .delete()
      .eq('id', cartItemId);

    const cart = await getCartForUser(session.user.id);
    const items = await getCartItems(cart.id);
    const mappedItems: CartItem[] = items.map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      name: item.clothing_ecommerce_store_uavxn_products.name,
      price: item.clothing_ecommerce_store_uavxn_products.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      imageUrl: item.clothing_ecommerce_store_uavxn_products.image_url,
    }));

    const totals = calculateTotals(mappedItems);

    return Response.json({
      items: mappedItems,
      ...totals,
    });
  } catch (error) {
    console.error('Failed to remove from cart:', error);
    return Response.json(
      { error: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}

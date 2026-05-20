import { supabase } from '@/lib/supabase';
import { auth } from '@/auth';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: addresses } = await supabase
      .from('clothing_ecommerce_store_uavxn_shipping_addresses')
      .select('*')
      .eq('user_id', session.user.id);

    const mappedAddresses = (addresses || []).map((addr: any) => ({
      id: addr.id,
      name: addr.full_name,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postal_code,
      country: addr.country,
      isDefault: addr.is_default,
    }));

    return Response.json({ addresses: mappedAddresses });
  } catch (error) {
    console.error('Failed to fetch addresses:', error);
    return Response.json(
      { error: 'Failed to fetch addresses' },
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

    const { fullName, email, street, city, state, postalCode, country } =
      await request.json();

    const { data: address, error } = await supabase
      .from('clothing_ecommerce_store_uavxn_shipping_addresses')
      .insert({
        id: uuidv4(),
        user_id: session.user.id,
        full_name: fullName,
        email,
        street,
        city,
        state,
        postal_code: postalCode,
        country,
        is_default: false,
      })
      .select()
      .single();

    if (error || !address) {
      return Response.json(
        { error: 'Failed to save address' },
        { status: 500 }
      );
    }

    return Response.json({
      address: {
        id: address.id,
        name: address.full_name,
        street: address.street,
        city: address.city,
        state: address.state,
        postalCode: address.postal_code,
        country: address.country,
      },
    });
  } catch (error) {
    console.error('Failed to save address:', error);
    return Response.json(
      { error: 'Failed to save address' },
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

    const { addressId } = await request.json();

    const { error } = await supabase
      .from('clothing_ecommerce_store_uavxn_shipping_addresses')
      .delete()
      .eq('id', addressId)
      .eq('user_id', session.user.id);

    if (error) {
      return Response.json(
        { error: 'Failed to delete address' },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Failed to delete address:', error);
    return Response.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    );
  }
}

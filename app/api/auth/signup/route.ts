import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('clothing_ecommerce_store_uavxn_users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return Response.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user with explicit UUID
    const { data: user, error } = await supabase
      .from('clothing_ecommerce_store_uavxn_users')
      .insert({
        email,
        password_hash: passwordHash,
      })
      .select()
      .single();

    if (error || !user) {
      return Response.json(
        { message: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Create default cart
    await supabase.from('clothing_ecommerce_store_uavxn_carts').insert({
      user_id: user.id,
    });

    return Response.json(
      {
        message: 'User created successfully',
        user: { id: user.id, email: user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to sign up:', error);
    return Response.json(
      { message: 'Failed to sign up' },
      { status: 500 }
    );
  }
}
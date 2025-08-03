// app/api/test-redis/route.ts
import { NextResponse } from 'next/server';
import { redis } from '../../../lib/redis';

export async function GET() {
  try {
    await redis.set('foo', 'bar');
    const value = await redis.get('foo');
    return NextResponse.json({ success: true, value });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

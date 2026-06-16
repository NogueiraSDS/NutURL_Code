import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ tier: 'free' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid: userId }
    });

    return NextResponse.json({ tier: user ? user.tier : 'free' });
  } catch (error) {
    console.error('Error fetching user tier:', error);
    return NextResponse.json({ tier: 'free' });
  }
}

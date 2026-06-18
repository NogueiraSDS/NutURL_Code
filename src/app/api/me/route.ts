import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ tier: 'free' });
  }

  try {
    let user = await prisma.user.findUnique({
      where: { firebaseUid: userId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: { firebaseUid: userId, tier: 'free' }
      });
    }

    return NextResponse.json({ tier: user.tier });
  } catch (error) {
    console.error('Error fetching user tier:', error);
    return NextResponse.json({ tier: 'free' });
  }
}

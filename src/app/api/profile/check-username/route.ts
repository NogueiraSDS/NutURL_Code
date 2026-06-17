import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/profile/check-username?username=...&userId=...
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const userId = searchParams.get('userId'); // Firebase UID

  if (!username) {
    return NextResponse.json({ error: 'Missing username' }, { status: 400 });
  }

  try {
    const existing = await prisma.profile.findUnique({
      where: { username },
    });

    if (!existing) {
      // Free to use
      return NextResponse.json({ available: true });
    }

    // It is taken, but is it by the current user?
    if (userId) {
      const dbUser = await prisma.user.findUnique({
        where: { firebaseUid: userId }
      });
      if (dbUser && existing.userId === dbUser.id) {
        return NextResponse.json({ available: true });
      }
    }

    // Taken by someone else
    return NextResponse.json({ available: false });
  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

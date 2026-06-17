import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/profile?userId=...
// Fetches the user's profile and links
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        links: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/profile
// Creates or updates the user's profile
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, username, title, bio } = body;

    if (!userId || !username) {
      return NextResponse.json({ error: 'Missing userId or username' }, { status: 400 });
    }

    // Check if username is taken by someone else
    const existingUsername = await prisma.profile.findUnique({
      where: { username },
    });

    if (existingUsername && existingUsername.userId !== userId) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
    }

    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        username,
        title,
        bio,
      },
      create: {
        userId,
        username,
        title,
        bio,
      },
      include: {
        links: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

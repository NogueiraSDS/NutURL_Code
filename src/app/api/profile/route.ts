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
    let user = await prisma.user.findUnique({
      where: { firebaseUid: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { firebaseUid: userId, tier: 'free' }
      });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
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
    const { userId, username, title, bio, avatarUrl, coverUrl, backgroundColor, theme, hideWatermark } = body;

    if (!userId || !username) {
      return NextResponse.json({ error: 'Missing userId or username' }, { status: 400 });
    }

    // Find or create the actual database user ID using firebaseUid
    let dbUser = await prisma.user.findUnique({
      where: { firebaseUid: userId },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: { firebaseUid: userId, tier: 'free' }
      });
    }

    // Check if username is taken by someone else
    const existingUsername = await prisma.profile.findUnique({
      where: { username },
    });

    if (existingUsername && existingUsername.userId !== dbUser.id) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
    }

    const profile = await prisma.profile.upsert({
      where: { userId: dbUser.id },
      update: {
        username,
        title,
        bio,
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(coverUrl !== undefined && { coverUrl }),
        ...(backgroundColor !== undefined && { backgroundColor }),
        ...(theme !== undefined && { theme }),
        ...(hideWatermark !== undefined && { hideWatermark }),
      },
      create: {
        userId: dbUser.id,
        username,
        title,
        bio,
        avatarUrl,
        coverUrl,
        backgroundColor: backgroundColor || '#0f172a',
        theme: theme || 'solid',
        hideWatermark: hideWatermark || false,
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

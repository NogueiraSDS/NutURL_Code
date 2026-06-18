import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/profile/links
// Adds a new link to the profile
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { profileId, title, url, icon, isAgeRestricted, animation, isSocialIcon } = body;

    if (!profileId || !title || !url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Determine order (last + 1)
    const existingLinks = await prisma.profileLink.findMany({
      where: { profileId },
      orderBy: { order: 'desc' },
      take: 1,
    });
    const nextOrder = existingLinks.length > 0 ? existingLinks[0].order + 1 : 0;

    const link = await prisma.profileLink.create({
      data: {
        profileId,
        title,
        url,
        icon: icon || 'web',
        isAgeRestricted: isAgeRestricted || false,
        isSocialIcon: isSocialIcon || false,
        animation: animation || 'none',
        order: nextOrder,
      },
    });

    return NextResponse.json({ link });
  } catch (error) {
    console.error('Error creating profile link:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/profile/links
// Updates an existing link (e.g. toggle isActive, edit url, or reorder)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, title, url, icon, isAgeRestricted, isActive, order, animation, isSocialIcon } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing link id' }, { status: 400 });
    }

    const updated = await prisma.profileLink.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(url !== undefined && { url }),
        ...(icon !== undefined && { icon }),
        ...(isAgeRestricted !== undefined && { isAgeRestricted }),
        ...(isSocialIcon !== undefined && { isSocialIcon }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order }),
        ...(animation !== undefined && { animation }),
      },
    });

    return NextResponse.json({ link: updated });
  } catch (error) {
    console.error('Error updating profile link:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/profile/links?id=...
// Deletes a link
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing link id' }, { status: 400 });
  }

  try {
    await prisma.profileLink.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting profile link:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

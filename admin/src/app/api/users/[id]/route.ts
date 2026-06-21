import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const { tier } = body;

    if (!['free', 'pro', 'premium'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier value' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { tier },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('Error updating user tier:', error);
    return NextResponse.json({ error: 'Failed to update user tier', details: error.message }, { status: 500 });
  }
}

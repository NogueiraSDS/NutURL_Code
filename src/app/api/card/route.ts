import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/card?userId=... or GET /api/card?slug=...
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const slug = searchParams.get('slug');

  try {
    if (slug) {
      const card = await prisma.businessCard.findUnique({
        where: { slug: slug.toLowerCase() },
      });
      if (!card) {
        return NextResponse.json({ error: 'Card not found' }, { status: 404 });
      }
      return NextResponse.json({ card });
    }

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId or slug' }, { status: 400 });
    }

    // Lookup user by firebaseUid
    let user = await prisma.user.findUnique({
      where: { firebaseUid: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { firebaseUid: userId, tier: 'free' },
      });
    }

    const card = await prisma.businessCard.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({ card });
  } catch (error) {
    console.error('Error fetching business card:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/card - Create or update business card
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      slug,
      fullName,
      role,
      company,
      phone,
      whatsapp,
      email,
      website,
      address,
      city,
      state,
      notes,
      avatarUrl,
      theme,
    } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    if (!fullName || !fullName.trim()) {
      return NextResponse.json({ error: 'Nome completo é obrigatório' }, { status: 400 });
    }

    let cleanSlug = (slug || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, '');

    if (!cleanSlug) {
      cleanSlug = fullName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    // Find or create DB User
    let user = await prisma.user.findUnique({
      where: { firebaseUid: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { firebaseUid: userId, tier: 'free' },
      });
    }

    // Check if slug is taken by another card
    const existingSlug = await prisma.businessCard.findUnique({
      where: { slug: cleanSlug },
    });

    if (existingSlug && existingSlug.userId !== user.id) {
      return NextResponse.json(
        { error: 'Este link/slug já está sendo utilizado por outro usuário. Escolha outro.' },
        { status: 409 }
      );
    }

    const card = await prisma.businessCard.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        slug: cleanSlug,
        fullName: fullName.trim(),
        role: role?.trim() || null,
        company: company?.trim() || null,
        phone: phone?.trim() || null,
        whatsapp: whatsapp?.trim() || null,
        email: email?.trim() || null,
        website: website?.trim() || null,
        address: address?.trim() || null,
        city: city?.trim() || null,
        state: state?.trim() || null,
        notes: notes?.trim() || null,
        avatarUrl: avatarUrl?.trim() || null,
        theme: theme || 'dark',
      },
      update: {
        slug: cleanSlug,
        fullName: fullName.trim(),
        role: role?.trim() || null,
        company: company?.trim() || null,
        phone: phone?.trim() || null,
        whatsapp: whatsapp?.trim() || null,
        email: email?.trim() || null,
        website: website?.trim() || null,
        address: address?.trim() || null,
        city: city?.trim() || null,
        state: state?.trim() || null,
        notes: notes?.trim() || null,
        avatarUrl: avatarUrl?.trim() || null,
        theme: theme || 'dark',
      },
    });

    return NextResponse.json({ card, success: true });
  } catch (error: any) {
    console.error('Error saving business card:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

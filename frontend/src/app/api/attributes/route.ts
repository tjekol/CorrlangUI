import { PrismaClient } from '@/generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET - Fetch all attributes
export async function GET() {
  try {
    const attributes = await prisma.attribute.findMany();

    return NextResponse.json(attributes);
  } catch (error) {
    console.error('Error fetching attributes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attributes' },
      { status: 500 }
    );
  }
}

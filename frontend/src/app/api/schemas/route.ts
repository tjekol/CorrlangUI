import { PrismaClient } from '@/generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET - Fetch all schemas
export async function GET() {
  try {
    const schemas = await prisma.schema.findMany({
      include: {
        nodes: true
      }
    });

    return NextResponse.json(schemas);
  } catch (error) {
    console.error('Error fetching schemas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schemas' },
      { status: 500 }
    );
  }
}

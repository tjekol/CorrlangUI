import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all edges
export async function GET() {
  try {
    const edges = await prisma.edge.findMany();

    return NextResponse.json(edges);
  } catch (error) {
    console.error('Error fetching edges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch edges' },
      { status: 500 }
    );
  }
}

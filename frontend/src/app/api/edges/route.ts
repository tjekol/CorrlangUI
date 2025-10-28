import { PrismaClient } from '@/generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET - Fetch all edges
export async function GET() {
  try {
    const edges = await prisma.edge.findMany({
      include: {
        node: true
      }
    });

    return NextResponse.json(edges);
  } catch (error) {
    console.error('Error fetching edges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch edges' },
      { status: 500 }
    );
  }
}

// POST - Create a new node
export async function POST(request: NextRequest) {
  try {
    const { edgeID, nodeID, positionX, positionY, isAttributeNode } = await request.json();

    const edge = await prisma.edge.create({
      data: {
        edgeID,
        nodeID,
        positionX,
        positionY
      },
    });

    return NextResponse.json(edge, { status: 201 });
  } catch (error) {
    console.error('Error creating edge:', error);
    return NextResponse.json(
      { error: 'Failed to create edge' },
      { status: 500 }
    );
  }
}

// DELETE - Delete edges by ID
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    // Delete related edges
    const deletedEdge = await prisma.edge.deleteMany({
      where: {
        edgeID: id,
      },
    });

    return NextResponse.json(deletedEdge);
  } catch (error) {
    console.error('Error deleting edge:', error);
    return NextResponse.json(
      { error: 'Failed to delete edge' },
      { status: 500 }
    );
  }
}

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all edge connections
export async function GET() {
  try {
    const connections = await prisma.edgeConnection.findMany();

    return NextResponse.json(connections);
  } catch (error) {
    console.error('Error fetching edge connections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch edge connections' },
      { status: 500 }
    );
  }
}

// POST - Create a new connection
export async function POST(request: NextRequest) {
  try {
    const { srcEdgeID, trgtEdgeID } = await request.json();

    const con = await prisma.edgeConnection.create({
      data: {
        srcEdgeID,
        trgtEdgeID
      },
    });

    return NextResponse.json(con, { status: 201 });
  } catch (error) {
    console.error('Error creating edge connection:', error);
    return NextResponse.json(
      { error: 'Failed to create edge connection' },
      { status: 500 }
    );
  }
}

// DELETE - Delete edge connections by ID
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json().catch(() => ({}));
    let deletedCon;

    if (id) {
      // Delete related edge connections
      deletedCon = await prisma.edgeConnection.deleteMany({
        where: {
          id: id,
        },
      });
    } else {
      deletedCon = await prisma.edgeConnection.deleteMany()
    }

    return NextResponse.json(deletedCon);
  } catch (error) {
    console.error('Error deleting edge connection:', error);
    return NextResponse.json(
      { error: 'Failed to delete edge connection' },
      { status: 500 }
    );
  }
}

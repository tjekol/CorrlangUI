import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all connections
export async function GET() {
  try {
    const multiCon = await prisma.nodeConnection.findMany({
      include: {
        nodes: {
          select: {
            id: true
          }
        }
      }
    });

    return NextResponse.json(multiCon);
  } catch (error) {
    console.error('Error fetching connection:', error);
    return NextResponse.json(
      { error: 'Failed to fetch connection' },
      { status: 500 }
    );
  }
}

// POST - Create a new connection
export async function POST(request: NextRequest) {
  try {
    const { nodeIDs } = await request.json();

    const con = await prisma.nodeConnection.create({
      data: {
        nodes: {
          connect: nodeIDs.map((id: number) => ({ id }))
        }
      },
      include: {
        nodes: {
          select: {
            id: true
          }
        }
      }
    });

    return NextResponse.json(con, { status: 201 });
  } catch (error) {
    console.error('Error creating connection:', error);
    return NextResponse.json(
      { error: 'Failed to create connection' },
      { status: 500 }
    );
  }
}

// PUT - Update connection
export async function PUT(request: NextRequest) {
  try {
    const { nodeConID, nodeID } = await request.json();

    const con = await prisma.nodeConnection.update({
      where: {
        id: nodeConID
      },
      data: {
        nodes: {
          connect: { id: nodeID }
        }
      },
      include: {
        nodes: {
          select: {
            id: true
          }
        }
      }
    })

    return NextResponse.json(con, { status: 201 });
  } catch (error) {
    console.error('Error updating connection:', error);
    return NextResponse.json(
      { error: 'Failed to update connection' },
      { status: 500 }
    );
  }
}

// DELETE - Delete connection by ID or all
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json().catch(() => ({}));
    let deletedCon;
    if (id) {
      // Delete related connections
      deletedCon = await prisma.nodeConnection.deleteMany({
        where: {
          id: id,
        },
      });
    } else {
      deletedCon = await prisma.nodeConnection.deleteMany()
    }
    return NextResponse.json(deletedCon);
  } catch (error) {
    console.error('Error deleting connection:', error);
    return NextResponse.json(
      { error: 'Failed to delete connection' },
      { status: 500 }
    );
  }
}

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all multi connections
export async function GET() {
  try {
    const multiCon = await prisma.multiConnection.findMany({
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
    console.error('Error fetching multi connection:', error);
    return NextResponse.json(
      { error: 'Failed to fetch multi connection' },
      { status: 500 }
    );
  }
}

// POST - Create a new multi connection
export async function POST(request: NextRequest) {
  try {
    const { nodeIDs } = await request.json();

    const con = await prisma.multiConnection.create({
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
    console.error('Error creating multi connection:', error);
    return NextResponse.json(
      { error: 'Failed to create multi connection' },
      { status: 500 }
    );
  }
}

// PUT - Update multi connection
export async function PUT(request: NextRequest) {
  try {
    const { id, nodeID } = await request.json();

    const con = await prisma.multiConnection.update({
      where: {
        id: id
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
    console.error('Error updating multi connection:', error);
    return NextResponse.json(
      { error: 'Failed to update multi connection' },
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
      deletedCon = await prisma.multiConnection.deleteMany({
        where: {
          id: id,
        },
      });
    } else {
      deletedCon = await prisma.multiConnection.deleteMany()
    }
    return NextResponse.json(deletedCon);
  } catch (error) {
    console.error('Error deleting multi connection:', error);
    return NextResponse.json(
      { error: 'Failed to delete multi connection' },
      { status: 500 }
    );
  }
}

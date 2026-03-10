import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all connections
export async function GET() {
  try {
    const con = await prisma.nodeConnection.findMany({
      include: {
        nodes: {
          select: {
            id: true
          }
        }
      }
    });

    return NextResponse.json(con);
  } catch (error) {
    console.error('Error fetching node connection:', error);
    return NextResponse.json(
      { error: 'Failed to fetch node connection' },
      { status: 500 }
    );
  }
}

// POST - Create a new connection
export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json();

    const con = await prisma.nodeConnection.create({
      data: {
        nodes: {
          connect: ids.map((id: number) => ({ id }))
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
    console.error('Error creating node connection:', error);
    return NextResponse.json(
      { error: 'Failed to create node connection' },
      { status: 500 }
    );
  }
}

// PUT - Update connection
export async function PUT(request: NextRequest) {
  try {
    const { conID, id } = await request.json();

    const con = await prisma.nodeConnection.update({
      where: {
        id: conID
      },
      data: {
        nodes: {
          connect: { id: id }
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
    console.error('Error updating node connection:', error);
    return NextResponse.json(
      { error: 'Failed to update node connection' },
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
    console.error('Error deleting node connection:', error);
    return NextResponse.json(
      { error: 'Failed to delete node connection' },
      { status: 500 }
    );
  }
}

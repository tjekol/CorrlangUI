import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all connections
export async function GET() {
  try {
    const con = await prisma.actionConnection.findMany({
      include: {
        actions: {
          select: {
            id: true
          }
        }
      }
    });

    return NextResponse.json(con);
  } catch (error) {
    console.error('Error fetching action connection:', error);
    return NextResponse.json(
      { error: 'Failed to fetch action connection' },
      { status: 500 }
    );
  }
}

// POST - Create a new connection
export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json();

    const con = await prisma.actionConnection.create({
      data: {
        actions: {
          connect: ids.map((id: number) => ({ id }))
        }
      },
      include: {
        actions: {
          select: {
            id: true
          }
        }
      }
    });

    return NextResponse.json(con, { status: 201 });
  } catch (error) {
    console.error('Error creating action connection:', error);
    return NextResponse.json(
      { error: 'Failed to create action connection' },
      { status: 500 }
    );
  }
}

// PUT - Update connection
export async function PUT(request: NextRequest) {
  try {
    const { conID, id } = await request.json();

    const con = await prisma.actionConnection.update({
      where: {
        id: conID
      },
      data: {
        actions: {
          connect: { id: id }
        }
      },
      include: {
        actions: {
          select: {
            id: true
          }
        }
      }
    })

    return NextResponse.json(con, { status: 201 });
  } catch (error) {
    console.error('Error updating action connection:', error);
    return NextResponse.json(
      { error: 'Failed to update action connection' },
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
      deletedCon = await prisma.actionConnection.deleteMany({
        where: {
          id: id,
        },
      });
    } else {
      deletedCon = await prisma.actionConnection.deleteMany()
    }
    return NextResponse.json(deletedCon);
  } catch (error) {
    console.error('Error deleting action connection:', error);
    return NextResponse.json(
      { error: 'Failed to delete action connection' },
      { status: 500 }
    );
  }
}

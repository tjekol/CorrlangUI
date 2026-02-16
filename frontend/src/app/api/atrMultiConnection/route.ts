import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all atr multi connections
export async function GET() {
  try {
    const multiCon = await prisma.atrMultiConnection.findMany({
      include: {
        attributes: {
          select: {
            id: true,
            nodeID: true
          }
        }
      }
    });

    return NextResponse.json(multiCon);
  } catch (error) {
    console.error('Error fetching attribute multi connection:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attribute multi connection' },
      { status: 500 }
    );
  }
}

// POST - Create a new multi connection
export async function POST(request: NextRequest) {
  try {
    const { atrIDs } = await request.json();

    const con = await prisma.atrMultiConnection.create({
      data: {
        attributes: {
          connect: atrIDs.map((id: number) => ({ id }))
        }
      },
      include: {
        attributes: {
          select: {
            id: true,
            nodeID: true
          }
        }
      }
    });

    return NextResponse.json(con, { status: 201 });
  } catch (error) {
    console.error('Error creating attribute multi connection:', error);
    return NextResponse.json(
      { error: 'Failed to create attribute multi connection' },
      { status: 500 }
    );
  }
}

// PUT - Update attribute multi connection
export async function PUT(request: NextRequest) {
  try {
    const { id, atrID } = await request.json();

    const con = await prisma.atrMultiConnection.update({
      where: {
        id: id
      },
      data: {
        attributes: {
          connect: { id: atrID }
        }
      },
      include: {
        attributes: {
          select: {
            id: true,
            nodeID: true
          }
        }
      }
    })

    return NextResponse.json(con, { status: 201 });
  } catch (error) {
    console.error('Error updating attribute multi connection:', error);
    return NextResponse.json(
      { error: 'Failed to update attribute multi connection' },
      { status: 500 }
    );
  }
}

// DELETE - Delete attribute connection by ID or all
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json().catch(() => ({}));
    let deletedCon;
    if (id) {
      // Delete related connections
      deletedCon = await prisma.atrMultiConnection.deleteMany({
        where: {
          id: id,
        },
      });
    } else {
      deletedCon = await prisma.atrMultiConnection.deleteMany()
    }
    return NextResponse.json(deletedCon);
  } catch (error) {
    console.error('Error deleting attribute multi connection:', error);
    return NextResponse.json(
      { error: 'Failed to delete attribute multi connection' },
      { status: 500 }
    );
  }
}

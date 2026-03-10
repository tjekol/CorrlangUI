import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all attribute connections
export async function GET() {
  try {
    const con = await prisma.methodConnection.findMany({
      include: {
        methods: {
          select: {
            id: true,
            actionID: true
          }
        }
      }
    });

    return NextResponse.json(con);
  } catch (error) {
    console.error('Error fetching method connection:', error);
    return NextResponse.json(
      { error: 'Failed to fetch method connection' },
      { status: 500 }
    );
  }
}

// POST - Create a new connection
export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json();

    const con = await prisma.methodConnection.create({
      data: {
        methods: {
          connect: ids.map((id: number) => ({ id }))
        }
      },
      include: {
        methods: {
          select: {
            id: true,
            actionID: true
          }
        }
      }
    });

    return NextResponse.json(con, { status: 201 });
  } catch (error) {
    console.error('Error creating method connection:', error);
    return NextResponse.json(
      { error: 'Failed to create method connection' },
      { status: 500 }
    );
  }
}

// PUT - Update attribute connection
export async function PUT(request: NextRequest) {
  try {
    const { conID, id } = await request.json();

    const con = await prisma.methodConnection.update({
      where: {
        id: conID
      },
      data: {
        methods: {
          connect: { id: id }
        }
      },
      include: {
        methods: {
          select: {
            id: true,
            actionID: true
          }
        }
      }
    })

    return NextResponse.json(con, { status: 201 });
  } catch (error) {
    console.error('Error updating method connection:', error);
    return NextResponse.json(
      { error: 'Failed to update method connection' },
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
      deletedCon = await prisma.methodConnection.deleteMany({
        where: {
          id: id,
        },
      });
    } else {
      deletedCon = await prisma.methodConnection.deleteMany()
    }
    return NextResponse.json(deletedCon);
  } catch (error) {
    console.error('Error deleting attribute connection:', error);
    return NextResponse.json(
      { error: 'Failed to delete attribute connection' },
      { status: 500 }
    );
  }
}

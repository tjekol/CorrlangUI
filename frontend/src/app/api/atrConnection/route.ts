import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all attribute edges
export async function GET() {
  try {
    const cons = await prisma.atrConnection.findMany();

    return NextResponse.json(cons);
  } catch (error) {
    console.error('Error fetching connections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch connections' },
      { status: 500 }
    );
  }
}

// POST - Create a new node
export async function POST(request: NextRequest) {
  try {
    const { srcAtrID, trgtAtrID } = await request.json();

    const con = await prisma.atrConnection.create({
      data: {
        srcAtrID,
        trgtAtrID
      },
    });

    return NextResponse.json(con, { status: 201 });
  } catch (error) {
    console.error('Error creating attribute edge:', error);
    return NextResponse.json(
      { error: 'Failed to create connection' },
      { status: 500 }
    );
  }
}

// DELETE - Delete edges by ID or all
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json().catch(() => ({}));
    let deletedCon;

    if (id) {
      // Delete related edges
      deletedCon = await prisma.atrConnection.deleteMany({
        where: {
          id: id,
        },
      });
    } else {
      deletedCon = await prisma.atrConnection.deleteMany()
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

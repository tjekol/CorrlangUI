import { PrismaClient } from '@/generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET - Fetch all connections
export async function GET() {
  try {
    const connections = await prisma.connection.findMany();

    return NextResponse.json(connections);
  } catch (error) {
    console.error('Error fetching connections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch connections' },
      { status: 500 }
    );
  }
}

// POST - Create a new connection
export async function POST(request: NextRequest) {
  try {
    const { srcNodeID, trgtNodeID } = await request.json();

    const con = await prisma.connection.create({
      data: {
        srcNodeID,
        trgtNodeID
      },
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

// DELETE - Delete connections by ID
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    // Delete related connections
    const deletedCon = await prisma.connection.deleteMany({
      where: {
        id: id,
      },
    });

    return NextResponse.json(deletedCon);
  } catch (error) {
    console.error('Error deleting connection:', error);
    return NextResponse.json(
      { error: 'Failed to delete connection' },
      { status: 500 }
    );
  }
}

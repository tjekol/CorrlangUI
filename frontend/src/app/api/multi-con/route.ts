import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all multi edges
export async function GET() {
  try {
    const multiEdges = await prisma.multiEdge.findMany({
      include: {
        nodes: {
          select: {
            id: true
          }
        }
      }
    });

    return NextResponse.json(multiEdges);
  } catch (error) {
    console.error('Error fetching multi edges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch multi edges' },
      { status: 500 }
    );
  }
}

// POST - Create a new multi edge
export async function POST(request: NextRequest) {
  try {
    const { nodeIDs } = await request.json();

    const edge = await prisma.multiEdge.create({
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

    return NextResponse.json(edge, { status: 201 });
  } catch (error) {
    console.error('Error creating multi edge:', error);
    return NextResponse.json(
      { error: 'Failed to create multi edge' },
      { status: 500 }
    );
  }
}

// // PUT - Update multi edge
// export async function PUT(request: NextRequest) {
//   try {
//     const { nodeIDs } = await request.json();

//     const edge = await prisma

//     return NextResponse.json(edge, { status: 201 });
//   } catch (error) {
//     console.error('Error creating multi edge:', error);
//     return NextResponse.json(
//       { error: 'Failed to create multi edge' },
//       { status: 500 }
//     );
//   }
// }

// DELETE - Delete edges by ID
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    // Delete related edges
    const deletedEdge = await prisma.multiEdge.deleteMany({
      where: {
        id: id,
      },
    });

    return NextResponse.json(deletedEdge);
  } catch (error) {
    console.error('Error deleting multi edge:', error);
    return NextResponse.json(
      { error: 'Failed to delete multi edge' },
      { status: 500 }
    );
  }
}

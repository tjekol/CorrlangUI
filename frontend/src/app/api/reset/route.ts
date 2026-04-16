import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Delete in order to respect foreign key relationships
    await prisma.methodConnection.deleteMany();
    await prisma.actionConnection.deleteMany();
    await prisma.edgeConnection.deleteMany();
    await prisma.atrConnection.deleteMany();
    await prisma.nodeConnection.deleteMany();
    await prisma.method.deleteMany();
    await prisma.action.deleteMany();
    await prisma.edge.deleteMany();
    await prisma.attribute.deleteMany();
    await prisma.node.deleteMany();
    await prisma.schema.deleteMany();

    return NextResponse.json({ success: true, message: 'Database reset successfully' });
  } catch (error) {
    console.error('Error resetting database:', error);
    return NextResponse.json(
      { error: 'Failed to reset database' },
      { status: 500 }
    );
  }
}

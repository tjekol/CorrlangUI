import messages from '@/lib/client/client/core_pb.cjs';
import services from '@/lib/client/client/core_grpc_pb.cjs';
import grpc from '@grpc/grpc-js';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all schemas
export async function GET() {
  try {
    await getSchemas()

    const schemas = await prisma.schema.findMany({
      include: {
        nodes: true
      }
    });

    return NextResponse.json(schemas);
  } catch (error) {
    console.error('Error fetching schemas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schemas' },
      { status: 500 }
    );
  }
}

function getSchemas() {
  const client = new services.CoreServiceClient(
    'localhost:6969',
    grpc.credentials.createInsecure()
  );

  return new Promise((resolve, reject) => {
    const req = new messages.GetObjectsRequest();

    client.getObjects(req, async (error, object) => {
      if (error) {
        reject(error);
      } else {
        try {
          const objs = object.getObjectsList()
          for (const o of objs) {
            //  Object === ENDPOINT
            if (o.getObjecttype() === 0) {
              console.log(o.getId(), o.getName())
              const schema = await prisma.schema.findFirst({
                where: { id: o.getId(), title: o.getName() }
              })
              if (!schema)
                await prisma.schema.create({
                  data: { id: o.getId(), title: o.getName() }
                })
            }
          }
          resolve('Schemas injection completed!');
        } catch (dbError) {
          reject(dbError);
        }
      }
    });
  })
}

import messages from '@/lib/client/client/core_pb.cjs';
import services from '@/lib/client/client/core_grpc_pb.cjs';
import grpc from '@grpc/grpc-js';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all correspondences
export async function GET() {
  try {
    const corres = await getCorres()

    return NextResponse.json(corres);
  } catch (error) {
    console.error('Error fetching correspondences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch correspondences' },
      { status: 500 }
    );
  }
}

async function getCorres() {
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
          const corres: { id: number, title: string }[] = []
          const objs = object.getObjectsList()
          for (const o of objs) {
            console.log(o.getId(), o.getName())
            corres.push({ id: o.getId(), title: o.getName() })
          }
          resolve(corres)
        } catch (dbError) {
          reject(dbError);
        }
      }
    });
  });
}

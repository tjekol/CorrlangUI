import messages from '@/lib/client/client/core_pb.cjs';
import services from '@/lib/client/client/core_grpc_pb.cjs';
import ccp from '@/lib/client/client/ccp_pb.cjs';
import grpc from '@grpc/grpc-js';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all nodes
export async function GET() {
  try {
    await injectNodes();

    const nodes = await prisma.node.findMany({
      include: {
        attributes: true
      }
    });

    return NextResponse.json(nodes);
  } catch (error) {
    console.error('Error fetching nodes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nodes' },
      { status: 500 }
    );
  }
}

async function injectNodes() {
  const schemaIDs = await prisma.schema.findMany({
    select: {
      id: true
    }
  })

  for (const s of schemaIDs) {
    await getNodes(s.id)
  }
}

function getNodes(id: number) {
  const client = new services.CoreServiceClient(
    'localhost:6969',
    grpc.credentials.createInsecure()
  );

  return new Promise((resolve, reject) => {
    const req = new messages.GetSchemaRequest();
    req.setEndpointid(id);

    client.getSchema(req, async (error, schema) => {
      if (error) {
        reject(error);
      } else {
        try {
          const elems = schema.getElementsList();
          const s = await prisma.schema.findFirst({
            where: { title: schema.getName() },
          });

          if (s) {
            console.log(s.title)
            for (const e of elems) {
              let t = e.getElementtype();
              if (t === ccp.SchemaElementKind.OBJECT_TYPE) {
                let n = e.getFullyqualifiedname().getPartsList()[0];
                console.log(` Element: ${n} `);

                const node = await prisma.node.findFirst({
                  where: { title: n, schemaID: s.id }
                });

                if (!node)
                  await prisma.node.create({
                    data: { title: n, schemaID: s.id }
                  });
              }
            }
          }
          resolve("Node injection complete");
        } catch (dbError) {
          reject(dbError);
        }
      }
    });
  });
}

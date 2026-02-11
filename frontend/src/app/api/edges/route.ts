import messages from '@/lib/client/client/core_pb.cjs';
import services from '@/lib/client/client/core_grpc_pb.cjs';
import ccp from '@/lib/client/client/ccp_pb.cjs';
import grpc from '@grpc/grpc-js';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all edges
export async function GET() {
  try {
    await injectEdges()

    const edges = await prisma.edge.findMany();

    return NextResponse.json(edges);
  } catch (error) {
    console.error('Error fetching edges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch edges' },
      { status: 500 }
    );
  }
}

async function injectEdges() {
  const schemaIDs = await prisma.schema.findMany({
    select: {
      id: true
    }
  })

  for (const s of schemaIDs) {
    await getEdges(s.id)
  }
}

function getEdges(id: number) {
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
            for (const e of elems) {
              let t = e.getElementtype();
              if (t === ccp.SchemaElementKind.REFERENCE) {
                let srcName = e
                  .getReferencetypedetails()
                  .getSrctypename()
                  .getPartsList()[0];

                let trgtName = e
                  .getReferencetypedetails()
                  .getTrgtypename()
                  .getPartsList()[0];

                let lowerbound = e
                  .getReferencetypedetails()
                  .getMultiplicity()
                  .getLowerbound();

                let upperbound = e
                  .getReferencetypedetails()
                  .getMultiplicity()
                  .getUpperbound();

                let isOrdered = e
                  .getReferencetypedetails()
                  .getMultiplicity()
                  .getIsordered();

                let srcNode = await prisma.node.findFirst({
                  where: { title: srcName, schemaID: s.id },
                });

                let trgtNode = await prisma.node.findFirst({
                  where: { title: trgtName, schemaID: s.id },
                });

                if (srcNode && trgtNode) {
                  const edge = await prisma.edge.findFirst({
                    where: { srcNodeID: srcNode.id, trgtNodeID: trgtNode.id },
                  });

                  if (!edge)
                    await prisma.edge.create({
                      data: { srcNodeID: srcNode.id, trgtNodeID: trgtNode.id, lowerBound: lowerbound, upperBound: upperbound, isOrdered: isOrdered },
                    });
                }
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

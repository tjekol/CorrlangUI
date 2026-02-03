import messages from '@/lib/client/client/core_pb.cjs';
import services from '@/lib/client/client/core_grpc_pb.cjs';
import ccp from '@/lib/client/client/ccp_pb.cjs';
import grpc from '@grpc/grpc-js';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all attributes
export async function GET() {
  try {
    await injectAttributes();

    const attributes = await prisma.attribute.findMany();

    return NextResponse.json(attributes);
  } catch (error) {
    console.error('Error fetching attributes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attributes' },
      { status: 500 }
    );
  }
}

async function injectAttributes() {
  const schemaIDs = await prisma.schema.findMany({
    select: {
      id: true
    }
  })

  for (const s of schemaIDs) {
    await getAttributes(s.id)
  }
}

async function getAttributes(id: number) {
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
              if (t === ccp.SchemaElementKind.ATTRIBUTE) {
                let atr = e.getFullyqualifiedname().getPartsList()[1];
                console.log(`   Attribute: ${atr} `);
                let atrOwner = e.getFullyqualifiedname().getPartsList()[0];
                let node = await prisma.node.findFirst({
                  where: { title: atrOwner, schemaID: s.id },
                });

                if (node) {
                  let dataType;
                  let isArray = false;

                  dataType = e
                    .getAttributetypedetails()
                    .getDatatypename()
                    .getPartsList()[0];

                  let attribute = await prisma.attribute.findFirst({
                    where: {
                      nodeID: node.id,
                      text: atr,
                      type: dataType,
                      isArray: isArray,
                    },
                  });

                  if (!attribute)
                    await prisma.attribute.create({
                      data: {
                        nodeID: node.id,
                        text: atr,
                        type: dataType,
                        isArray: isArray,
                      },
                    });
                  console.log(`     AttributeType: ${dataType}`);
                }
              }
            }
          }
          resolve("Attribute injection complete");
        } catch (dbError) {
          reject(dbError);
        }
      }
    });
  });
}

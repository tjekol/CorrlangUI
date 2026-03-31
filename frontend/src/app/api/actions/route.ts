import messages from '@/lib/client/client/core_pb.cjs';
import services from '@/lib/client/client/core_grpc_pb.cjs';
import ccp from '@/lib/client/client/ccp_pb.cjs';
import grpc from '@grpc/grpc-js';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET - Fetch all actions
export async function GET() {
  try {
    await injectActions();

    const actions = await prisma.action.findMany();

    return NextResponse.json(actions);
  } catch (error) {
    console.error('Error fetching actions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch actions' },
      { status: 500 }
    );
  }
}

async function injectActions() {
  const schemaIDs = await prisma.schema.findMany({
    select: {
      id: true
    }
  })

  for (const s of schemaIDs) {
    await getActions(s.id)
  }
}

function getActions(id: number) {
  const client = new services.CoreServiceClient(
    process.env.NEXT_PUBLIC_SERVER,
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
              const t = e.getElementtype();
              if (t === ccp.SchemaElementKind.ACTION) {
                const n = e.getFullyqualifiedname().getPartsList()[0];
                const m = e.getFullyqualifiedname().getPartsList()[1];
                console.log(`Action: ${n}`);
                console.log(`   Method: ${m}`);

                let action = await prisma.action.findFirst({
                  where: { name: n, schemaID: s.id }
                });

                if (!action) {
                  action = await prisma.action.create({
                    data: { name: n, schemaID: s.id }
                  });
                }
              }
            }
          }
          resolve("Action injection complete");
        } catch (dbError) {
          reject(dbError);
        }
      }
    });
  });
}

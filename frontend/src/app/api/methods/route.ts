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

    const actions = await prisma.method.findMany();

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
              const t = e.getElementtype();
              if (t === ccp.SchemaElementKind.ACTION) {
                const n = e.getFullyqualifiedname().getPartsList()[0];
                const m = e.getFullyqualifiedname().getPartsList()[1];
                console.log(`Action: ${n}`);
                console.log(`   Method: ${m}`);

                const inputs = e.getActiontypedetails().getInputsList();
                const outputs = e.getActiontypedetails().getOutputsList();
                let input = '', output = '';

                for (const i of inputs) {
                  input +=
                    i.getArgumentname().getPartsList()[0] +
                    ':' +
                    i.getTypename().getPartsList()[0] + ',';
                }

                for (const o of outputs) {
                  output = o.getTypename().getPartsList()[0];
                }

                const action = await prisma.action.findFirst({
                  where: { name: n, schemaID: s.id }
                });

                if (action) {
                  const method = await prisma.method.findFirst({
                    where: { name: m, actionID: action.id, input: input, output: output }
                  });

                  if (!method)
                    await prisma.method.create({
                      data: { name: m, actionID: action.id, input: input, output: output }
                    });
                }
              }
            }
          }
          resolve("Method injection complete");
        } catch (dbError) {
          reject(dbError);
        }
      }
    });
  });
}

import messages from './client/core_pb.cjs';
import ccp from './client/ccp_pb.cjs';
import services from './client/core_grpc_pb.cjs';
import grpc from '@grpc/grpc-js';
import { prisma } from '../prisma.ts';

var client = new services.CoreServiceClient(
  'localhost:6969',
  grpc.credentials.createInsecure(),
);

var msg = new messages.GetStatusRequest();

/* Check connection of service */
function callback1(error, status) {
  if (error) {
    console.log(`Error: ${error}`);
  } else {
    let pid = status.getPid();
    let startup = new Date(status.getStartupts() * 1000);
    console.log(`Pid is ${pid}, service started at: ${startup}`);
  }
}
client.getStatus(msg, callback1);

/* Get schema and its elements */
var req = new messages.GetSchemaRequest();
req.setEndpointid(1);

var req2 = new messages.GetSchemaRequest();
req2.setEndpointid(2);

var req3 = new messages.GetSchemaRequest();
req3.setEndpointid(3);

function registerNode(request) {
  return new Promise((resolve, reject) => {
    client.getSchema(request, async (error, schema) => {
      if (error) {
        console.log(`Error ${error}`);
        reject(error);
      } else {
        let elems = schema.getElementsList();
        console.log(`-`);
        console.log('id', schema.getName());

        const s = await prisma.schema.findFirst({
          where: { title: schema.getName() },
        });

        /* Nodes */
        for (const e of elems) {
          let t = e.getElementtype();
          if (t === ccp.SchemaElementKind.OBJECT_TYPE) {
            let n = e.getFullyqualifiedname().getPartsList()[0];
            console.log(` Element: ${n} `);
            await prisma.node.create({
              data: { title: n, schemaID: s.id },
            });
          }
        }
        /* Attributes */
        for (const e of elems) {
          let t = e.getElementtype();
          if (
            t === ccp.SchemaElementKind.ATTRIBUTE ||
            t === ccp.SchemaElementKind.REFERENCE
          ) {
            let atr = e.getFullyqualifiedname().getPartsList()[1];
            console.log(`   Attribute: ${atr} `);
            let atrOwner = e.getFullyqualifiedname().getPartsList()[0];
            let node = await prisma.node.findFirst({
              where: { title: atrOwner, schemaID: s.id },
            });

            let dataType;
            let isArray = false;
            if (t === ccp.SchemaElementKind.ATTRIBUTE) {
              dataType = e
                .getAttributetypedetails()
                .getDatatypename()
                .getPartsList()[0];
            } else if (t === ccp.SchemaElementKind.REFERENCE) {
              dataType = e
                .getReferencetypedetails()
                .getTrgtypename()
                .getPartsList()[0];

              isArray = e
                .getReferencetypedetails()
                .getMultiplicity()
                .getIsordered();
            }

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
        resolve(schema);
      }
    });
  });
}

/* Register node and attributes */
async function registerNodeAtr() {
  await registerNode(req);
  await registerNode(req2);
  await registerNode(req3);
}

registerNodeAtr()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

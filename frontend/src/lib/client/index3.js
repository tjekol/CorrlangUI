import messages from './client/core_pb.cjs';
import ccp from './client/ccp_pb.cjs';
import services from './client/core_grpc_pb.cjs';
import grpc from '@grpc/grpc-js';
import { prisma } from '../prisma.ts';

var client = new services.CoreServiceClient(
  'localhost:6969',
  grpc.credentials.createInsecure()
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
function callback4(error, schema) {
  if (error) {
    console.log(`Error ${error}`);
  } else {
    let elems = schema.getElementsList();
    console.log(`-`);
    console.log('id', schema.getName());
    elems.map(async (e) => {
      let n = e.getFullyqualifiedname().getPartsList()[0];
      let t = e.getElementtype();
      if (t === ccp.SchemaElementKind.OBJECT_TYPE) {
        console.log(`Element: ${n} `);

        const s = await prisma.schema.findFirst({
          where: { title: schema.getName() },
        });

        await prisma.node.create({
          data: { title: n, schemaID: s.id },
        });
      }
    });
  }
}

client.getSchema(req, callback4);
client.getSchema(req2, callback4);
client.getSchema(req3, callback4);

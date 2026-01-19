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

/* Request for creating the "endpoint" (needs to be done only once) */
var req = new messages.RegisterEndpointRequest();
req.setName('Sales');
req.setProject('test');
req.setType(ccp.EndpointType.SERVICE);

var req2 = new messages.RegisterEndpointRequest();
req2.setName('Invoices');
req2.setProject('test');
req2.setType(ccp.EndpointType.SERVICE);

var req3 = new messages.RegisterEndpointRequest();
req3.setName('HR');
req3.setProject('test');
req3.setType(ccp.EndpointType.SERVICE);

function registerEndpoint(request) {
  return new Promise((resolve, reject) => {
    client.registerEndpoint(request, (error, ep) => {
      if (error) {
        console.log(`Error ${error}`);
        reject(error);
      } else {
        let id = ep.getId();
        let n = ep.getName();
        console.log(`Registered endpoint "${n}" with id: ${id}`);
        resolve(ep);
      }
    });
  });
}

async function registerEndpoints() {
  await registerEndpoint(req);
  await registerEndpoint(req2);
  await registerEndpoint(req3);
}

registerEndpoints();

async function main() {
  await prisma.schema.createMany({
    data: [
      { title: req.getName() },
      { title: req2.getName() },
      { title: req3.getName() },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

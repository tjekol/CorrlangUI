import messages from './client/core_pb.cjs';
import services from './client/core_grpc_pb.cjs';
import grpc from '@grpc/grpc-js';

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

/* Request for "parsing the schema itself" (needs to be done only once) */
var req = new messages.RegisterEndpointSchemaRequest();
req.setEndpointid(1);
req.setTechspace('GRAPH_QL');
req.setFilelocation(
  '/Users/theakolnes/repositories/CorrlangUI/corrlang/sales.graphql'
);

var req2 = new messages.RegisterEndpointSchemaRequest();
req2.setEndpointid(2);
req2.setTechspace('GRAPH_QL');
req2.setFilelocation(
  '/Users/theakolnes/repositories/CorrlangUI/corrlang/invoices.graphql'
);

var req3 = new messages.RegisterEndpointSchemaRequest();
req3.setEndpointid(3);
req3.setTechspace('GRAPH_QL');
req3.setFilelocation(
  '/Users/theakolnes/repositories/CorrlangUI/corrlang/hr.graphql'
);
function callback3(error, ack) {
  if (error) {
    console.log(`Error ${error}`);
  } else {
    console.log('Schema added:');
  }
}
client.registerEndpointSchema(req, callback3);
client.registerEndpointSchema(req2, callback3);
client.registerEndpointSchema(req3, callback3);

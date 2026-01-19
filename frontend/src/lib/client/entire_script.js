var messages = require('./client/core_pb.js');
var ccp = require('./client/ccp_pb.js');
var services = require('./client/core_grpc_pb.js');
var grpc = require('@grpc/grpc-js');

// npm run grcp
// in /downloads/ ./bin/corrlang-service
// Run each step by itself!!

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
function callback2(error, ep) {
  if (error) {
    console.log(`Error ${error}`);
  } else {
    let id = ep.getId();
    console.log(`Registered endpoint with id ${id}`);
  }
}
client.registerEndpoint(req, callback2);
client.registerEndpoint(req2, callback2);
client.registerEndpoint(req3, callback2);

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
    console.log('Schema added');
  }
}
client.registerEndpointSchema(req, callback3);
client.registerEndpointSchema(req2, callback3);
client.registerEndpointSchema(req3, callback3);

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
    console.log(`--------------------`);
    elems.map((e) => {
      let n = e.getFullyqualifiedname().getPartsList()[0];
      let t = e.getElementtype();
      if (t === ccp.SchemaElementKind.OBJECT_TYPE) {
        console.log(`Element: ${n} `);
      }
    });
  }
}

client.getSchema(req, callback4);
client.getSchema(req2, callback4);
client.getSchema(req3, callback4);

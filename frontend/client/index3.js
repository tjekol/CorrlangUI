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

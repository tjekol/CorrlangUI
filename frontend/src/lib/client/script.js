import messages from './client/core_pb.cjs';
import ccp from './client/ccp_pb.cjs';
import services from './client/core_grpc_pb.cjs';
import grpc from '@grpc/grpc-js';

// node ./src/lib/client/script.js

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

/* Request for "parsing the schema itself" (needs to be done only once) */
var req_sales = new messages.RegisterEndpointSchemaRequest();
req_sales.setEndpointid(1);
req_sales.setTechspace('GRAPH_QL');
req_sales.setFilelocation(
  '/Users/theakolnes/repositories/CorrlangUI/corrlang/sales.graphql',
);

var req_invoices = new messages.RegisterEndpointSchemaRequest();
req_invoices.setEndpointid(2);
req_invoices.setTechspace('GRAPH_QL');
req_invoices.setFilelocation(
  '/Users/theakolnes/repositories/CorrlangUI/corrlang/invoices.graphql',
);

var req_hr = new messages.RegisterEndpointSchemaRequest();
req_hr.setEndpointid(3);
req_hr.setTechspace('GRAPH_QL');
req_hr.setFilelocation(
  '/Users/theakolnes/repositories/CorrlangUI/corrlang/hr.graphql',
);

function addSchema(request) {
  return new Promise((resolve, reject) => {
    client.registerEndpointSchema(request, (error, ack) => {
      if (error) {
        console.log(`Error ${error}`);
        reject(error);
      } else {
        console.log('Schema added endpoint with id', request.getEndpointid());
        resolve(ack);
      }
    });
  });
}

async function injectServer() {
  await registerEndpoint(req);
  await registerEndpoint(req2);
  await registerEndpoint(req3);

  await addSchema(req_sales);
  await addSchema(req_invoices);
  await addSchema(req_hr);
}

injectServer();

/* Get schema and its elements */
// var req = new messages.GetSchemaRequest();
// req.setEndpointid(1);

// var req2 = new messages.GetSchemaRequest();
// req2.setEndpointid(2);

// var req3 = new messages.GetSchemaRequest();
// req3.setEndpointid(3);
// function callback4(error, schema) {
//   if (error) {
//     console.log(`Error ${error}`);
//   } else {
//     let elems = schema.getElementsList();
//     console.log(`--------------------`);
//     elems.map((e) => {
//       let n = e.getFullyqualifiedname().getPartsList()[0];
//       let t = e.getElementtype();
//       if (t === ccp.SchemaElementKind.OBJECT_TYPE) {
//         console.log(`Element: ${n} `);
//       }
//     });
//   }
// }

// client.getSchema(req, callback4);
// client.getSchema(req2, callback4);
// client.getSchema(req3, callback4);

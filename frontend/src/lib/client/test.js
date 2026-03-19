import messages from './client/core_pb.cjs';
import ccp from './client/ccp_pb.cjs';
import services from './client/core_grpc_pb.cjs';
import grpc from '@grpc/grpc-js';

// node ./src/lib/client/script.js

function main() {
  const client = new services.CoreServiceClient(
    'localhost:6969',
    grpc.credentials.createInsecure(),
  );

  return new Promise((resolve, reject) => {
    const req = new messages.GetSchemaRequest();
    req.setEndpointid(2);

    client.getSchema(req, async (error, schema) => {
      if (error) {
        reject(error);
      } else {
        try {
          const elems = schema.getElementsList();

          for (const e of elems) {
            let t = e.getElementtype();
            if (t === ccp.SchemaElementKind.REFERENCE) {
              let srcName = e
                .getReferencetypedetails()
                .getSrctypename()
                .getPartsList()[0];

              let trgtName = e
                .getReferencetypedetails()
                .getTrgtypename()
                .getPartsList()[0];

              let refName = e.getFullyqualifiedname().getPartsList()[1];

              let lowerbound = e
                .getReferencetypedetails()
                .getMultiplicity()
                .getLowerbound();

              let upperbound = e
                .getReferencetypedetails()
                .getMultiplicity()
                .getUpperbound();

              let isOrdered = e
                .getReferencetypedetails()
                .getMultiplicity()
                .getIsordered();

              console.log(
                ` ${srcName} ${trgtName} ${refName} ${lowerbound} ${upperbound} ${isOrdered}`,
              );
            }
          }
          resolve('Node injection complete');
        } catch (dbError) {
          reject(dbError);
        }
      }
    });
  });
}

async function testServer() {
  await main();
}

testServer();

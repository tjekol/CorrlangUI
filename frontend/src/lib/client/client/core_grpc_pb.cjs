// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var client_core_pb = require('./core_pb.cjs');
var client_ccp_pb = require('../client/ccp_pb.cjs');

function serialize_CorrLangServiceStatus(arg) {
  if (!(arg instanceof client_core_pb.CorrLangServiceStatus)) {
    throw new Error('Expected argument of type CorrLangServiceStatus');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_CorrLangServiceStatus(buffer_arg) {
  return client_core_pb.CorrLangServiceStatus.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_DeregisterObjectRequest(arg) {
  if (!(arg instanceof client_core_pb.DeregisterObjectRequest)) {
    throw new Error('Expected argument of type DeregisterObjectRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DeregisterObjectRequest(buffer_arg) {
  return client_core_pb.DeregisterObjectRequest.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_GetCorrespondenceRequest(arg) {
  if (!(arg instanceof client_core_pb.GetCorrespondenceRequest)) {
    throw new Error('Expected argument of type GetCorrespondenceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetCorrespondenceRequest(buffer_arg) {
  return client_core_pb.GetCorrespondenceRequest.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_GetEndpointRequest(arg) {
  if (!(arg instanceof client_core_pb.GetEndpointRequest)) {
    throw new Error('Expected argument of type GetEndpointRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetEndpointRequest(buffer_arg) {
  return client_core_pb.GetEndpointRequest.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_GetObjectsRequest(arg) {
  if (!(arg instanceof client_core_pb.GetObjectsRequest)) {
    throw new Error('Expected argument of type GetObjectsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetObjectsRequest(buffer_arg) {
  return client_core_pb.GetObjectsRequest.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_GetObjectsResponse(arg) {
  if (!(arg instanceof client_core_pb.GetObjectsResponse)) {
    throw new Error('Expected argument of type GetObjectsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetObjectsResponse(buffer_arg) {
  return client_core_pb.GetObjectsResponse.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_GetRegisteredTechSpacesRequest(arg) {
  if (!(arg instanceof client_core_pb.GetRegisteredTechSpacesRequest)) {
    throw new Error('Expected argument of type GetRegisteredTechSpacesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetRegisteredTechSpacesRequest(buffer_arg) {
  return client_core_pb.GetRegisteredTechSpacesRequest.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_GetRegisteredTechSpacesResponse(arg) {
  if (!(arg instanceof client_core_pb.GetRegisteredTechSpacesResponse)) {
    throw new Error(
      'Expected argument of type GetRegisteredTechSpacesResponse',
    );
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetRegisteredTechSpacesResponse(buffer_arg) {
  return client_core_pb.GetRegisteredTechSpacesResponse.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_GetSchemaRequest(arg) {
  if (!(arg instanceof client_core_pb.GetSchemaRequest)) {
    throw new Error('Expected argument of type GetSchemaRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetSchemaRequest(buffer_arg) {
  return client_core_pb.GetSchemaRequest.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_GetStatusRequest(arg) {
  if (!(arg instanceof client_core_pb.GetStatusRequest)) {
    throw new Error('Expected argument of type GetStatusRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetStatusRequest(buffer_arg) {
  return client_core_pb.GetStatusRequest.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_GetViewRequest(arg) {
  if (!(arg instanceof client_core_pb.GetViewRequest)) {
    throw new Error('Expected argument of type GetViewRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetViewRequest(buffer_arg) {
  return client_core_pb.GetViewRequest.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_MergeCorrSpecRequest(arg) {
  if (!(arg instanceof client_core_pb.MergeCorrSpecRequest)) {
    throw new Error('Expected argument of type MergeCorrSpecRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_MergeCorrSpecRequest(buffer_arg) {
  return client_core_pb.MergeCorrSpecRequest.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_RegisterCommonalityRequest(arg) {
  if (!(arg instanceof client_core_pb.RegisterCommonalityRequest)) {
    throw new Error('Expected argument of type RegisterCommonalityRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RegisterCommonalityRequest(buffer_arg) {
  return client_core_pb.RegisterCommonalityRequest.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_RegisterCorrespondenceRequest(arg) {
  if (!(arg instanceof client_core_pb.RegisterCorrespondenceRequest)) {
    throw new Error('Expected argument of type RegisterCorrespondenceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RegisterCorrespondenceRequest(buffer_arg) {
  return client_core_pb.RegisterCorrespondenceRequest.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_RegisterEndpointDatasetRequest(arg) {
  if (!(arg instanceof client_core_pb.RegisterEndpointDatasetRequest)) {
    throw new Error('Expected argument of type RegisterEndpointDatasetRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RegisterEndpointDatasetRequest(buffer_arg) {
  return client_core_pb.RegisterEndpointDatasetRequest.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_RegisterEndpointRequest(arg) {
  if (!(arg instanceof client_core_pb.RegisterEndpointRequest)) {
    throw new Error('Expected argument of type RegisterEndpointRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RegisterEndpointRequest(buffer_arg) {
  return client_core_pb.RegisterEndpointRequest.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_RegisterEndpointSchemaRequest(arg) {
  if (!(arg instanceof client_core_pb.RegisterEndpointSchemaRequest)) {
    throw new Error('Expected argument of type RegisterEndpointSchemaRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RegisterEndpointSchemaRequest(buffer_arg) {
  return client_core_pb.RegisterEndpointSchemaRequest.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_RegisterEndpointServiceAddressRequest(arg) {
  if (!(arg instanceof client_core_pb.RegisterEndpointServiceAddressRequest)) {
    throw new Error(
      'Expected argument of type RegisterEndpointServiceAddressRequest',
    );
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RegisterEndpointServiceAddressRequest(buffer_arg) {
  return client_core_pb.RegisterEndpointServiceAddressRequest.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_RegisterTechSpaceRequest(arg) {
  if (!(arg instanceof client_core_pb.RegisterTechSpaceRequest)) {
    throw new Error('Expected argument of type RegisterTechSpaceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RegisterTechSpaceRequest(buffer_arg) {
  return client_core_pb.RegisterTechSpaceRequest.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_RegisterViewRequest(arg) {
  if (!(arg instanceof client_core_pb.RegisterViewRequest)) {
    throw new Error('Expected argument of type RegisterViewRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RegisterViewRequest(buffer_arg) {
  return client_core_pb.RegisterViewRequest.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_ShutdownAcknowledged(arg) {
  if (!(arg instanceof client_core_pb.ShutdownAcknowledged)) {
    throw new Error('Expected argument of type ShutdownAcknowledged');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ShutdownAcknowledged(buffer_arg) {
  return client_core_pb.ShutdownAcknowledged.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_ShutdownRequest(arg) {
  if (!(arg instanceof client_core_pb.ShutdownRequest)) {
    throw new Error('Expected argument of type ShutdownRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ShutdownRequest(buffer_arg) {
  return client_core_pb.ShutdownRequest.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_StartProxyRequest(arg) {
  if (!(arg instanceof client_core_pb.StartProxyRequest)) {
    throw new Error('Expected argument of type StartProxyRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_StartProxyRequest(buffer_arg) {
  return client_core_pb.StartProxyRequest.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_TechSpaceRegistered(arg) {
  if (!(arg instanceof client_core_pb.TechSpaceRegistered)) {
    throw new Error('Expected argument of type TechSpaceRegistered');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TechSpaceRegistered(buffer_arg) {
  return client_core_pb.TechSpaceRegistered.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_WriteDatasetRequest(arg) {
  if (!(arg instanceof client_core_pb.WriteDatasetRequest)) {
    throw new Error('Expected argument of type WriteDatasetRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_WriteDatasetRequest(buffer_arg) {
  return client_core_pb.WriteDatasetRequest.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_WriteSchemaRequest(arg) {
  if (!(arg instanceof client_core_pb.WriteSchemaRequest)) {
    throw new Error('Expected argument of type WriteSchemaRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_WriteSchemaRequest(buffer_arg) {
  return client_core_pb.WriteSchemaRequest.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_ccp_Ack(arg) {
  if (!(arg instanceof client_ccp_pb.Ack)) {
    throw new Error('Expected argument of type ccp.Ack');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ccp_Ack(buffer_arg) {
  return client_ccp_pb.Ack.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ccp_Commonality(arg) {
  if (!(arg instanceof client_ccp_pb.Commonality)) {
    throw new Error('Expected argument of type ccp.Commonality');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ccp_Commonality(buffer_arg) {
  return client_ccp_pb.Commonality.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_ccp_Correspondence(arg) {
  if (!(arg instanceof client_ccp_pb.Correspondence)) {
    throw new Error('Expected argument of type ccp.Correspondence');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ccp_Correspondence(buffer_arg) {
  return client_ccp_pb.Correspondence.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_ccp_Dataset(arg) {
  if (!(arg instanceof client_ccp_pb.Dataset)) {
    throw new Error('Expected argument of type ccp.Dataset');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ccp_Dataset(buffer_arg) {
  return client_ccp_pb.Dataset.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ccp_Endpoint(arg) {
  if (!(arg instanceof client_ccp_pb.Endpoint)) {
    throw new Error('Expected argument of type ccp.Endpoint');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ccp_Endpoint(buffer_arg) {
  return client_ccp_pb.Endpoint.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ccp_Schema(arg) {
  if (!(arg instanceof client_ccp_pb.Schema)) {
    throw new Error('Expected argument of type ccp.Schema');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ccp_Schema(buffer_arg) {
  return client_ccp_pb.Schema.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ccp_TreeData(arg) {
  if (!(arg instanceof client_ccp_pb.TreeData)) {
    throw new Error('Expected argument of type ccp.TreeData');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ccp_TreeData(buffer_arg) {
  return client_ccp_pb.TreeData.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ccp_View(arg) {
  if (!(arg instanceof client_ccp_pb.View)) {
    throw new Error('Expected argument of type ccp.View');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ccp_View(buffer_arg) {
  return client_ccp_pb.View.deserializeBinary(new Uint8Array(buffer_arg));
}

// *
// This is the service offered by the CorrLang engine.
// It can both be used by TechSpace plugins (to register themselves)
// or language clients (language server etc.) to interact with CorrLang.
var CoreServiceService = (exports.CoreServiceService = {
  // General meta-information about the core-service process and health-check.
  getStatus: {
    path: '/CoreService/GetStatus',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.GetStatusRequest,
    responseType: client_core_pb.CorrLangServiceStatus,
    requestSerialize: serialize_GetStatusRequest,
    requestDeserialize: deserialize_GetStatusRequest,
    responseSerialize: serialize_CorrLangServiceStatus,
    responseDeserialize: deserialize_CorrLangServiceStatus,
  },
  // Must be called by a TechSpace plugin to be registered as TechSpace.
  registerTechSpace: {
    path: '/CoreService/RegisterTechSpace',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.RegisterTechSpaceRequest,
    responseType: client_core_pb.TechSpaceRegistered,
    requestSerialize: serialize_RegisterTechSpaceRequest,
    requestDeserialize: deserialize_RegisterTechSpaceRequest,
    responseSerialize: serialize_TechSpaceRegistered,
    responseDeserialize: deserialize_TechSpaceRegistered,
  },
  // Instruct CorrLang to parse a _corr-spec_ file and merge it into the context.
  mergeCorrSpec: {
    path: '/CoreService/MergeCorrSpec',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.MergeCorrSpecRequest,
    responseType: client_ccp_pb.Ack,
    requestSerialize: serialize_MergeCorrSpecRequest,
    requestDeserialize: deserialize_MergeCorrSpecRequest,
    responseSerialize: serialize_ccp_Ack,
    responseDeserialize: deserialize_ccp_Ack,
  },
  // Lists the registered TechSpace plugins.
  getRegisteredTechSpaces: {
    path: '/CoreService/GetRegisteredTechSpaces',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.GetRegisteredTechSpacesRequest,
    responseType: client_core_pb.GetRegisteredTechSpacesResponse,
    requestSerialize: serialize_GetRegisteredTechSpacesRequest,
    requestDeserialize: deserialize_GetRegisteredTechSpacesRequest,
    responseSerialize: serialize_GetRegisteredTechSpacesResponse,
    responseDeserialize: deserialize_GetRegisteredTechSpacesResponse,
  },
  // Lists all registered objects, i.e. endpoints, correspondences, views.
  getObjects: {
    path: '/CoreService/GetObjects',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.GetObjectsRequest,
    responseType: client_core_pb.GetObjectsResponse,
    requestSerialize: serialize_GetObjectsRequest,
    requestDeserialize: deserialize_GetObjectsRequest,
    responseSerialize: serialize_GetObjectsResponse,
    responseDeserialize: deserialize_GetObjectsResponse,
  },
  // Retrieves the formal schema presentation for a given endpoint (identified by id).
  getSchema: {
    path: '/CoreService/GetSchema',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.GetSchemaRequest,
    responseType: client_ccp_pb.Schema,
    requestSerialize: serialize_GetSchemaRequest,
    requestDeserialize: deserialize_GetSchemaRequest,
    responseSerialize: serialize_ccp_Schema,
    responseDeserialize: deserialize_ccp_Schema,
  },
  // Asks the service to shutdown
  requestShutdown: {
    path: '/CoreService/RequestShutdown',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.ShutdownRequest,
    responseType: client_core_pb.ShutdownAcknowledged,
    requestSerialize: serialize_ShutdownRequest,
    requestDeserialize: deserialize_ShutdownRequest,
    responseSerialize: serialize_ShutdownAcknowledged,
    responseDeserialize: deserialize_ShutdownAcknowledged,
  },
  // Registers a new endpoint within the context.
  registerEndpoint: {
    path: '/CoreService/RegisterEndpoint',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.RegisterEndpointRequest,
    responseType: client_ccp_pb.Endpoint,
    requestSerialize: serialize_RegisterEndpointRequest,
    requestDeserialize: deserialize_RegisterEndpointRequest,
    responseSerialize: serialize_ccp_Endpoint,
    responseDeserialize: deserialize_ccp_Endpoint,
  },
  // Adds a schema to a registered endpoint.
  registerEndpointSchema: {
    path: '/CoreService/RegisterEndpointSchema',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.RegisterEndpointSchemaRequest,
    responseType: client_ccp_pb.Ack,
    requestSerialize: serialize_RegisterEndpointSchemaRequest,
    requestDeserialize: deserialize_RegisterEndpointSchemaRequest,
    responseSerialize: serialize_ccp_Ack,
    responseDeserialize: deserialize_ccp_Ack,
  },
  // Adds a dataset to a registered endpoint.
  registerEndpointDataset: {
    path: '/CoreService/RegisterEndpointDataset',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.RegisterEndpointDatasetRequest,
    responseType: client_ccp_pb.Dataset,
    requestSerialize: serialize_RegisterEndpointDatasetRequest,
    requestDeserialize: deserialize_RegisterEndpointDatasetRequest,
    responseSerialize: serialize_ccp_Dataset,
    responseDeserialize: deserialize_ccp_Dataset,
  },
  // Adds a service address (URL or socket) to a registered endpoint.
  registerEndpointServiceAddress: {
    path: '/CoreService/RegisterEndpointServiceAddress',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.RegisterEndpointServiceAddressRequest,
    responseType: client_ccp_pb.Ack,
    requestSerialize: serialize_RegisterEndpointServiceAddressRequest,
    requestDeserialize: deserialize_RegisterEndpointServiceAddressRequest,
    responseSerialize: serialize_ccp_Ack,
    responseDeserialize: deserialize_ccp_Ack,
  },
  // Registers a new correspondence within the context.
  registerCorrespondence: {
    path: '/CoreService/RegisterCorrespondence',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.RegisterCorrespondenceRequest,
    responseType: client_ccp_pb.Correspondence,
    requestSerialize: serialize_RegisterCorrespondenceRequest,
    requestDeserialize: deserialize_RegisterCorrespondenceRequest,
    responseSerialize: serialize_ccp_Correspondence,
    responseDeserialize: deserialize_ccp_Correspondence,
  },
  // Registers a new commonality within the context of a correspondence.
  registerCommonality: {
    path: '/CoreService/RegisterCommonality',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.RegisterCommonalityRequest,
    responseType: client_ccp_pb.Commonality,
    requestSerialize: serialize_RegisterCommonalityRequest,
    requestDeserialize: deserialize_RegisterCommonalityRequest,
    responseSerialize: serialize_ccp_Commonality,
    responseDeserialize: deserialize_ccp_Commonality,
  },
  // Registers a new view within the context.
  registerView: {
    path: '/CoreService/RegisterView',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.RegisterViewRequest,
    responseType: client_ccp_pb.View,
    requestSerialize: serialize_RegisterViewRequest,
    requestDeserialize: deserialize_RegisterViewRequest,
    responseSerialize: serialize_ccp_View,
    responseDeserialize: deserialize_ccp_View,
  },
  // Asks CorrLang to export the schema of an endpoint to a file using a specified TechSpace.
  writeSchema: {
    path: '/CoreService/WriteSchema',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.WriteSchemaRequest,
    responseType: client_ccp_pb.Ack,
    requestSerialize: serialize_WriteSchemaRequest,
    requestDeserialize: deserialize_WriteSchemaRequest,
    responseSerialize: serialize_ccp_Ack,
    responseDeserialize: deserialize_ccp_Ack,
  },
  // Asks CorrLang to export the dataset to a file using a specified TechSpace.
  writeDataset: {
    path: '/CoreService/WriteDataset',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.WriteDatasetRequest,
    responseType: client_ccp_pb.Ack,
    requestSerialize: serialize_WriteDatasetRequest,
    requestDeserialize: deserialize_WriteDatasetRequest,
    responseSerialize: serialize_ccp_Ack,
    responseDeserialize: deserialize_ccp_Ack,
  },
  // Instructs CorrLang to start a proxy for a view on a specified port using a specified TechSpace.
  startProxy: {
    path: '/CoreService/StartProxy',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.StartProxyRequest,
    responseType: client_ccp_pb.Ack,
    requestSerialize: serialize_StartProxyRequest,
    requestDeserialize: deserialize_StartProxyRequest,
    responseSerialize: serialize_ccp_Ack,
    responseDeserialize: deserialize_ccp_Ack,
  },
  // Can be used by SOURCE-endpoints or SERVICE-endpoints that offer a subscribe() method to notify about 'new' data.
  pushData: {
    path: '/CoreService/PushData',
    requestStream: true,
    responseStream: false,
    requestType: client_ccp_pb.TreeData,
    responseType: client_ccp_pb.Ack,
    requestSerialize: serialize_ccp_TreeData,
    requestDeserialize: deserialize_ccp_TreeData,
    responseSerialize: serialize_ccp_Ack,
    responseDeserialize: deserialize_ccp_Ack,
  },
  // Retrieve information about a registered endpoint.
  getEndpoint: {
    path: '/CoreService/GetEndpoint',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.GetEndpointRequest,
    responseType: client_ccp_pb.Endpoint,
    requestSerialize: serialize_GetEndpointRequest,
    requestDeserialize: deserialize_GetEndpointRequest,
    responseSerialize: serialize_ccp_Endpoint,
    responseDeserialize: deserialize_ccp_Endpoint,
  },
  // Retrieve information about a registered correspondence.
  getCorrespondence: {
    path: '/CoreService/GetCorrespondence',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.GetCorrespondenceRequest,
    responseType: client_ccp_pb.Correspondence,
    requestSerialize: serialize_GetCorrespondenceRequest,
    requestDeserialize: deserialize_GetCorrespondenceRequest,
    responseSerialize: serialize_ccp_Correspondence,
    responseDeserialize: deserialize_ccp_Correspondence,
  },
  // Retrieve information about a registered view.
  getView: {
    path: '/CoreService/GetView',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.GetViewRequest,
    responseType: client_ccp_pb.View,
    requestSerialize: serialize_GetViewRequest,
    requestDeserialize: deserialize_GetViewRequest,
    responseSerialize: serialize_ccp_View,
    responseDeserialize: deserialize_ccp_View,
  },
  // Deregisters an object (endpoint, correspondence, view) from the CorrLang system.
  deregisterObject: {
    path: '/CoreService/DeregisterObject',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.DeregisterObjectRequest,
    responseType: client_ccp_pb.Ack,
    requestSerialize: serialize_DeregisterObjectRequest,
    requestDeserialize: deserialize_DeregisterObjectRequest,
    responseSerialize: serialize_ccp_Ack,
    responseDeserialize: deserialize_ccp_Ack,
  },
});

exports.CoreServiceClient = grpc.makeGenericClientConstructor(
  CoreServiceService,
  'CoreService',
);

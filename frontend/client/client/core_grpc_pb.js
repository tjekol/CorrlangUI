// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var client_core_pb = require('../client/core_pb.js');
var client_ccp_pb = require('../client/ccp_pb.js');

function serialize_CorrLangServiceStatus(arg) {
  if (!(arg instanceof client_core_pb.CorrLangServiceStatus)) {
    throw new Error('Expected argument of type CorrLangServiceStatus');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_CorrLangServiceStatus(buffer_arg) {
  return client_core_pb.CorrLangServiceStatus.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GetRegisteredEndpointsRequest(arg) {
  if (!(arg instanceof client_core_pb.GetRegisteredEndpointsRequest)) {
    throw new Error('Expected argument of type GetRegisteredEndpointsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetRegisteredEndpointsRequest(buffer_arg) {
  return client_core_pb.GetRegisteredEndpointsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GetRegisteredEndpointsResponse(arg) {
  if (!(arg instanceof client_core_pb.GetRegisteredEndpointsResponse)) {
    throw new Error('Expected argument of type GetRegisteredEndpointsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetRegisteredEndpointsResponse(buffer_arg) {
  return client_core_pb.GetRegisteredEndpointsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GetRegisteredTechSpacesRequest(arg) {
  if (!(arg instanceof client_core_pb.GetRegisteredTechSpacesRequest)) {
    throw new Error('Expected argument of type GetRegisteredTechSpacesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetRegisteredTechSpacesRequest(buffer_arg) {
  return client_core_pb.GetRegisteredTechSpacesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GetRegisteredTechSpacesResponse(arg) {
  if (!(arg instanceof client_core_pb.GetRegisteredTechSpacesResponse)) {
    throw new Error('Expected argument of type GetRegisteredTechSpacesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetRegisteredTechSpacesResponse(buffer_arg) {
  return client_core_pb.GetRegisteredTechSpacesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GetSchemaRequest(arg) {
  if (!(arg instanceof client_core_pb.GetSchemaRequest)) {
    throw new Error('Expected argument of type GetSchemaRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetSchemaRequest(buffer_arg) {
  return client_core_pb.GetSchemaRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GetStatusRequest(arg) {
  if (!(arg instanceof client_core_pb.GetStatusRequest)) {
    throw new Error('Expected argument of type GetStatusRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetStatusRequest(buffer_arg) {
  return client_core_pb.GetStatusRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_RegisterEndpointDatasetLocationRequest(arg) {
  if (!(arg instanceof client_core_pb.RegisterEndpointDatasetLocationRequest)) {
    throw new Error('Expected argument of type RegisterEndpointDatasetLocationRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RegisterEndpointDatasetLocationRequest(buffer_arg) {
  return client_core_pb.RegisterEndpointDatasetLocationRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_RegisterEndpointRequest(arg) {
  if (!(arg instanceof client_core_pb.RegisterEndpointRequest)) {
    throw new Error('Expected argument of type RegisterEndpointRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RegisterEndpointRequest(buffer_arg) {
  return client_core_pb.RegisterEndpointRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_RegisterEndpointSchemaRequest(arg) {
  if (!(arg instanceof client_core_pb.RegisterEndpointSchemaRequest)) {
    throw new Error('Expected argument of type RegisterEndpointSchemaRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RegisterEndpointSchemaRequest(buffer_arg) {
  return client_core_pb.RegisterEndpointSchemaRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_RegisterEndpointServiceSocketRequest(arg) {
  if (!(arg instanceof client_core_pb.RegisterEndpointServiceSocketRequest)) {
    throw new Error('Expected argument of type RegisterEndpointServiceSocketRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RegisterEndpointServiceSocketRequest(buffer_arg) {
  return client_core_pb.RegisterEndpointServiceSocketRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_RegisterEndpointServiceURLRequest(arg) {
  if (!(arg instanceof client_core_pb.RegisterEndpointServiceURLRequest)) {
    throw new Error('Expected argument of type RegisterEndpointServiceURLRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RegisterEndpointServiceURLRequest(buffer_arg) {
  return client_core_pb.RegisterEndpointServiceURLRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_RegisterTechSpaceRequest(arg) {
  if (!(arg instanceof client_core_pb.RegisterTechSpaceRequest)) {
    throw new Error('Expected argument of type RegisterTechSpaceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RegisterTechSpaceRequest(buffer_arg) {
  return client_core_pb.RegisterTechSpaceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ShutdownAcknowledged(arg) {
  if (!(arg instanceof client_core_pb.ShutdownAcknowledged)) {
    throw new Error('Expected argument of type ShutdownAcknowledged');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ShutdownAcknowledged(buffer_arg) {
  return client_core_pb.ShutdownAcknowledged.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ShutdownRequest(arg) {
  if (!(arg instanceof client_core_pb.ShutdownRequest)) {
    throw new Error('Expected argument of type ShutdownRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ShutdownRequest(buffer_arg) {
  return client_core_pb.ShutdownRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_TechSpaceRegistered(arg) {
  if (!(arg instanceof client_core_pb.TechSpaceRegistered)) {
    throw new Error('Expected argument of type TechSpaceRegistered');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TechSpaceRegistered(buffer_arg) {
  return client_core_pb.TechSpaceRegistered.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_WriteSchemaRequest(arg) {
  if (!(arg instanceof client_core_pb.WriteSchemaRequest)) {
    throw new Error('Expected argument of type WriteSchemaRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_WriteSchemaRequest(buffer_arg) {
  return client_core_pb.WriteSchemaRequest.deserializeBinary(new Uint8Array(buffer_arg));
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


// *
// This is the service offered by the CorrLang engine.
// It can both be used by TechSpace plugins (to register themselves)
// or language clients (language server etc.) to interact with CorrLang.
var CoreServiceService = exports.CoreServiceService = {
  // General meta-information about the core-service process.
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
  // Retrieves the endpoints that are currently registered.
getRegisteredEndpoints: {
    path: '/CoreService/GetRegisteredEndpoints',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.GetRegisteredEndpointsRequest,
    responseType: client_core_pb.GetRegisteredEndpointsResponse,
    requestSerialize: serialize_GetRegisteredEndpointsRequest,
    requestDeserialize: deserialize_GetRegisteredEndpointsRequest,
    responseSerialize: serialize_GetRegisteredEndpointsResponse,
    responseDeserialize: deserialize_GetRegisteredEndpointsResponse,
  },
  // Can be used by SOURCE-endpoints or SERVICE-endpoints that offer a subscribe() method
// to notify about 'new' data.
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
  // DANGER ZONE: the following methods are most likely going to change a bit 
//
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
  registerEndpointDatasetLocation: {
    path: '/CoreService/RegisterEndpointDatasetLocation',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.RegisterEndpointDatasetLocationRequest,
    responseType: client_ccp_pb.Ack,
    requestSerialize: serialize_RegisterEndpointDatasetLocationRequest,
    requestDeserialize: deserialize_RegisterEndpointDatasetLocationRequest,
    responseSerialize: serialize_ccp_Ack,
    responseDeserialize: deserialize_ccp_Ack,
  },
  registerEndpointServiceURL: {
    path: '/CoreService/RegisterEndpointServiceURL',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.RegisterEndpointServiceURLRequest,
    responseType: client_ccp_pb.Ack,
    requestSerialize: serialize_RegisterEndpointServiceURLRequest,
    requestDeserialize: deserialize_RegisterEndpointServiceURLRequest,
    responseSerialize: serialize_ccp_Ack,
    responseDeserialize: deserialize_ccp_Ack,
  },
  registerEndpointServiceSocket: {
    path: '/CoreService/RegisterEndpointServiceSocket',
    requestStream: false,
    responseStream: false,
    requestType: client_core_pb.RegisterEndpointServiceSocketRequest,
    responseType: client_ccp_pb.Ack,
    requestSerialize: serialize_RegisterEndpointServiceSocketRequest,
    requestDeserialize: deserialize_RegisterEndpointServiceSocketRequest,
    responseSerialize: serialize_ccp_Ack,
    responseDeserialize: deserialize_ccp_Ack,
  },
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
};

exports.CoreServiceClient = grpc.makeGenericClientConstructor(CoreServiceService, 'CoreService');

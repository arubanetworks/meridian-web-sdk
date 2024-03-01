/* eslint-disable */
import type { CallContext, CallOptions } from "nice-grpc-common";
import * as _m0 from "protobufjs/minimal";
import Long = require("long");

export const protobufPackage = "track";

export interface AssetRequest {
  resourceType: AssetRequest_ResourceType;
  locationId: string;
  resourceIds: string[];
}

export enum AssetRequest_ResourceType {
  LOCATION = 0,
  TAG = 1,
  FLOOR = 2,
  LABEL = 3,
  ZONE = 4,
  UNRECOGNIZED = -1,
}

export interface AssetRequestList {
  assetRequests: AssetRequest[];
}

export interface AllAssetRequest {
  locationId: string;
  floorId: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface ZoneEvent {
  action: ZoneEvent_Action;
  zoneId: number;
}

export enum ZoneEvent_Action {
  EXIT = 0,
  ENTER = 1,
  UNRECOGNIZED = -1,
}

export interface MapEvent {
  action: MapEvent_Action;
  mapId: string;
}

export enum MapEvent_Action {
  EXIT = 0,
  ENTER = 1,
  UNRECOGNIZED = -1,
}

export interface AssetUpdate {
  mac: string;
  id: string;
  name: string;
  locationId: string;
  mapId: string;
  x: number;
  y: number;
  eventType: AssetUpdate_EventType;
  timestamp: number;
  created: string;
  modified: string;
  externalId: string;
  imageUrl: string;
  batteryLevel: number;
  controlX: number;
  controlY: number;
  isControlTag: boolean;
  currentZoneId: number;
  tags: Tag[];
  tagIds: string[];
  zoneEvents: ZoneEvent[];
  mapEvents: MapEvent[];
  ingestionTime: number;
  lat: number;
  lon: number;
}

export enum AssetUpdate_EventType {
  DELETE = 0,
  UPDATE = 1,
  UNRECOGNIZED = -1,
}

export interface AssetUpdateList {
  assetUpdates: AssetUpdate[];
}

function createBaseAssetRequest(): AssetRequest {
  return { resourceType: 0, locationId: "", resourceIds: [] };
}

export const AssetRequest = {
  encode(message: AssetRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.resourceType !== 0) {
      writer.uint32(8).int32(message.resourceType);
    }
    if (message.locationId !== "") {
      writer.uint32(18).string(message.locationId);
    }
    for (const v of message.resourceIds) {
      writer.uint32(26).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AssetRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAssetRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.resourceType = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.locationId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.resourceIds.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<AssetRequest>): AssetRequest {
    return AssetRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<AssetRequest>): AssetRequest {
    const message = createBaseAssetRequest();
    message.resourceType = object.resourceType ?? 0;
    message.locationId = object.locationId ?? "";
    message.resourceIds = object.resourceIds?.map((e) => e) || [];
    return message;
  },
};

function createBaseAssetRequestList(): AssetRequestList {
  return { assetRequests: [] };
}

export const AssetRequestList = {
  encode(message: AssetRequestList, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.assetRequests) {
      AssetRequest.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AssetRequestList {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAssetRequestList();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.assetRequests.push(AssetRequest.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<AssetRequestList>): AssetRequestList {
    return AssetRequestList.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<AssetRequestList>): AssetRequestList {
    const message = createBaseAssetRequestList();
    message.assetRequests = object.assetRequests?.map((e) => AssetRequest.fromPartial(e)) || [];
    return message;
  },
};

function createBaseAllAssetRequest(): AllAssetRequest {
  return { locationId: "", floorId: "" };
}

export const AllAssetRequest = {
  encode(message: AllAssetRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.locationId !== "") {
      writer.uint32(10).string(message.locationId);
    }
    if (message.floorId !== "") {
      writer.uint32(18).string(message.floorId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AllAssetRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAllAssetRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.locationId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.floorId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<AllAssetRequest>): AllAssetRequest {
    return AllAssetRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<AllAssetRequest>): AllAssetRequest {
    const message = createBaseAllAssetRequest();
    message.locationId = object.locationId ?? "";
    message.floorId = object.floorId ?? "";
    return message;
  },
};

function createBaseTag(): Tag {
  return { id: "", name: "" };
}

export const Tag = {
  encode(message: Tag, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Tag {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTag();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.name = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<Tag>): Tag {
    return Tag.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Tag>): Tag {
    const message = createBaseTag();
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseZoneEvent(): ZoneEvent {
  return { action: 0, zoneId: 0 };
}

export const ZoneEvent = {
  encode(message: ZoneEvent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.action !== 0) {
      writer.uint32(8).int32(message.action);
    }
    if (message.zoneId !== 0) {
      writer.uint32(16).uint64(message.zoneId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ZoneEvent {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseZoneEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.action = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.zoneId = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<ZoneEvent>): ZoneEvent {
    return ZoneEvent.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ZoneEvent>): ZoneEvent {
    const message = createBaseZoneEvent();
    message.action = object.action ?? 0;
    message.zoneId = object.zoneId ?? 0;
    return message;
  },
};

function createBaseMapEvent(): MapEvent {
  return { action: 0, mapId: "" };
}

export const MapEvent = {
  encode(message: MapEvent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.action !== 0) {
      writer.uint32(8).int32(message.action);
    }
    if (message.mapId !== "") {
      writer.uint32(18).string(message.mapId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MapEvent {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMapEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.action = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.mapId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<MapEvent>): MapEvent {
    return MapEvent.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<MapEvent>): MapEvent {
    const message = createBaseMapEvent();
    message.action = object.action ?? 0;
    message.mapId = object.mapId ?? "";
    return message;
  },
};

function createBaseAssetUpdate(): AssetUpdate {
  return {
    mac: "",
    id: "",
    name: "",
    locationId: "",
    mapId: "",
    x: 0,
    y: 0,
    eventType: 0,
    timestamp: 0,
    created: "",
    modified: "",
    externalId: "",
    imageUrl: "",
    batteryLevel: 0,
    controlX: 0,
    controlY: 0,
    isControlTag: false,
    currentZoneId: 0,
    tags: [],
    tagIds: [],
    zoneEvents: [],
    mapEvents: [],
    ingestionTime: 0,
    lat: 0,
    lon: 0,
  };
}

export const AssetUpdate = {
  encode(message: AssetUpdate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.mac !== "") {
      writer.uint32(10).string(message.mac);
    }
    if (message.id !== "") {
      writer.uint32(18).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(26).string(message.name);
    }
    if (message.locationId !== "") {
      writer.uint32(34).string(message.locationId);
    }
    if (message.mapId !== "") {
      writer.uint32(42).string(message.mapId);
    }
    if (message.x !== 0) {
      writer.uint32(49).double(message.x);
    }
    if (message.y !== 0) {
      writer.uint32(57).double(message.y);
    }
    if (message.eventType !== 0) {
      writer.uint32(64).int32(message.eventType);
    }
    if (message.timestamp !== 0) {
      writer.uint32(72).int64(message.timestamp);
    }
    if (message.created !== "") {
      writer.uint32(82).string(message.created);
    }
    if (message.modified !== "") {
      writer.uint32(90).string(message.modified);
    }
    if (message.externalId !== "") {
      writer.uint32(98).string(message.externalId);
    }
    if (message.imageUrl !== "") {
      writer.uint32(106).string(message.imageUrl);
    }
    if (message.batteryLevel !== 0) {
      writer.uint32(113).double(message.batteryLevel);
    }
    if (message.controlX !== 0) {
      writer.uint32(121).double(message.controlX);
    }
    if (message.controlY !== 0) {
      writer.uint32(129).double(message.controlY);
    }
    if (message.isControlTag === true) {
      writer.uint32(136).bool(message.isControlTag);
    }
    if (message.currentZoneId !== 0) {
      writer.uint32(144).int64(message.currentZoneId);
    }
    for (const v of message.tags) {
      Tag.encode(v!, writer.uint32(154).fork()).ldelim();
    }
    for (const v of message.tagIds) {
      writer.uint32(162).string(v!);
    }
    for (const v of message.zoneEvents) {
      ZoneEvent.encode(v!, writer.uint32(170).fork()).ldelim();
    }
    for (const v of message.mapEvents) {
      MapEvent.encode(v!, writer.uint32(178).fork()).ldelim();
    }
    if (message.ingestionTime !== 0) {
      writer.uint32(184).int64(message.ingestionTime);
    }
    if (message.lat !== 0) {
      writer.uint32(193).double(message.lat);
    }
    if (message.lon !== 0) {
      writer.uint32(201).double(message.lon);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AssetUpdate {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAssetUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.mac = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.id = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.name = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.locationId = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.mapId = reader.string();
          continue;
        case 6:
          if (tag !== 49) {
            break;
          }

          message.x = reader.double();
          continue;
        case 7:
          if (tag !== 57) {
            break;
          }

          message.y = reader.double();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.eventType = reader.int32() as any;
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.timestamp = longToNumber(reader.int64() as Long);
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.created = reader.string();
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.modified = reader.string();
          continue;
        case 12:
          if (tag !== 98) {
            break;
          }

          message.externalId = reader.string();
          continue;
        case 13:
          if (tag !== 106) {
            break;
          }

          message.imageUrl = reader.string();
          continue;
        case 14:
          if (tag !== 113) {
            break;
          }

          message.batteryLevel = reader.double();
          continue;
        case 15:
          if (tag !== 121) {
            break;
          }

          message.controlX = reader.double();
          continue;
        case 16:
          if (tag !== 129) {
            break;
          }

          message.controlY = reader.double();
          continue;
        case 17:
          if (tag !== 136) {
            break;
          }

          message.isControlTag = reader.bool();
          continue;
        case 18:
          if (tag !== 144) {
            break;
          }

          message.currentZoneId = longToNumber(reader.int64() as Long);
          continue;
        case 19:
          if (tag !== 154) {
            break;
          }

          message.tags.push(Tag.decode(reader, reader.uint32()));
          continue;
        case 20:
          if (tag !== 162) {
            break;
          }

          message.tagIds.push(reader.string());
          continue;
        case 21:
          if (tag !== 170) {
            break;
          }

          message.zoneEvents.push(ZoneEvent.decode(reader, reader.uint32()));
          continue;
        case 22:
          if (tag !== 178) {
            break;
          }

          message.mapEvents.push(MapEvent.decode(reader, reader.uint32()));
          continue;
        case 23:
          if (tag !== 184) {
            break;
          }

          message.ingestionTime = longToNumber(reader.int64() as Long);
          continue;
        case 24:
          if (tag !== 193) {
            break;
          }

          message.lat = reader.double();
          continue;
        case 25:
          if (tag !== 201) {
            break;
          }

          message.lon = reader.double();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<AssetUpdate>): AssetUpdate {
    return AssetUpdate.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<AssetUpdate>): AssetUpdate {
    const message = createBaseAssetUpdate();
    message.mac = object.mac ?? "";
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    message.locationId = object.locationId ?? "";
    message.mapId = object.mapId ?? "";
    message.x = object.x ?? 0;
    message.y = object.y ?? 0;
    message.eventType = object.eventType ?? 0;
    message.timestamp = object.timestamp ?? 0;
    message.created = object.created ?? "";
    message.modified = object.modified ?? "";
    message.externalId = object.externalId ?? "";
    message.imageUrl = object.imageUrl ?? "";
    message.batteryLevel = object.batteryLevel ?? 0;
    message.controlX = object.controlX ?? 0;
    message.controlY = object.controlY ?? 0;
    message.isControlTag = object.isControlTag ?? false;
    message.currentZoneId = object.currentZoneId ?? 0;
    message.tags = object.tags?.map((e) => Tag.fromPartial(e)) || [];
    message.tagIds = object.tagIds?.map((e) => e) || [];
    message.zoneEvents = object.zoneEvents?.map((e) => ZoneEvent.fromPartial(e)) || [];
    message.mapEvents = object.mapEvents?.map((e) => MapEvent.fromPartial(e)) || [];
    message.ingestionTime = object.ingestionTime ?? 0;
    message.lat = object.lat ?? 0;
    message.lon = object.lon ?? 0;
    return message;
  },
};

function createBaseAssetUpdateList(): AssetUpdateList {
  return { assetUpdates: [] };
}

export const AssetUpdateList = {
  encode(message: AssetUpdateList, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.assetUpdates) {
      AssetUpdate.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AssetUpdateList {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAssetUpdateList();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.assetUpdates.push(AssetUpdate.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<AssetUpdateList>): AssetUpdateList {
    return AssetUpdateList.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<AssetUpdateList>): AssetUpdateList {
    const message = createBaseAssetUpdateList();
    message.assetUpdates = object.assetUpdates?.map((e) => AssetUpdate.fromPartial(e)) || [];
    return message;
  },
};

export type TrackingDefinition = typeof TrackingDefinition;
export const TrackingDefinition = {
  name: "Tracking",
  fullName: "track.Tracking",
  methods: {
    trackAssets: {
      name: "TrackAssets",
      requestType: AssetRequestList,
      requestStream: false,
      responseType: AssetUpdateList,
      responseStream: true,
      options: {
        _unknownFields: {
          578365826: [
            new Uint8Array([
              29,
              34,
              24,
              47,
              115,
              116,
              114,
              101,
              97,
              109,
              115,
              47,
              118,
              49,
              47,
              116,
              114,
              97,
              99,
              107,
              47,
              97,
              115,
              115,
              101,
              116,
              115,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    getAllAssets: {
      name: "GetAllAssets",
      requestType: AllAssetRequest,
      requestStream: false,
      responseType: AssetUpdateList,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            new Uint8Array([
              25,
              34,
              20,
              47,
              97,
              112,
              105,
              47,
              118,
              49,
              47,
              116,
              114,
              97,
              99,
              107,
              47,
              97,
              115,
              115,
              101,
              116,
              115,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
  },
} as const;

export interface TrackingServiceImplementation<CallContextExt = {}> {
  trackAssets(
    request: AssetRequestList,
    context: CallContext & CallContextExt,
  ): ServerStreamingMethodResult<DeepPartial<AssetUpdateList>>;
  getAllAssets(request: AllAssetRequest, context: CallContext & CallContextExt): Promise<DeepPartial<AssetUpdateList>>;
}

export interface TrackingClient<CallOptionsExt = {}> {
  trackAssets(
    request: DeepPartial<AssetRequestList>,
    options?: CallOptions & CallOptionsExt,
  ): AsyncIterable<AssetUpdateList>;
  getAllAssets(request: DeepPartial<AllAssetRequest>, options?: CallOptions & CallOptionsExt): Promise<AssetUpdateList>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function longToNumber(long: Long): number {
  if (long.gt(globalThis.Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

export type ServerStreamingMethodResult<Response> = { [Symbol.asyncIterator](): AsyncIterator<Response, void> };

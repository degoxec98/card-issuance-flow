import { CloudEvent, EventType } from "./events";

let counter = 0;
const nextId = () => ++counter;

export function buildCloudEvent<T>(params: {
  source: string;
  type: EventType;
  data: T;
}): CloudEvent<T> {
  return {
    id: nextId(),
    source: params.source,
    type: params.type,
    specversion: "1.0",
    time: new Date().toISOString(),
    datacontenttype: "application/json",
    data: params.data,
  };
}

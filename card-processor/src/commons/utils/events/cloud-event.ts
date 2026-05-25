export type EventType =
  | "io.card.requested.v1"
  | "io.cards.issued.v1"
  | "io.card.requested.v1.dlq";

export interface CloudEvent<T> {
  id: string | number;
  source: string;
  type: EventType;
  specversion: "1.0";
  time: string;
  datacontenttype: "application/json";
  data: T;
}

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

import {
  CardStatus,
  DocumentType,
  ProductCurrency,
  ProductType,
} from "../../enums";

export type EventType =
  | "io.card.requested.v1"
  | "io.cards.issued.v1"
  | "io.card.requested.v1.dlq";

export interface CloudEvent<T> {
  id: number;
  source: string;
  type: EventType;
  specversion: "1.0";
  time: string;
  datacontenttype: "application/json";
  data: T;
}

export interface CardRequestData {
  requestId: string;
  documentType: DocumentType;
  documentNumber: string;
  fullName: string;
  email: string;
  age: number;
  type: ProductType;
  currency: ProductCurrency;
  status: CardStatus.PENDING;
  forceError: boolean;
}

export interface CardIssuedData {
  requestId: string;
  documentNumber: string;
  card: {
    id: string;
    maskedNumber: string;
    expiry: string;
    brand: ProductType;
    currency: ProductCurrency;
  };
  status: CardStatus.EMITTED;
}

export interface CardDlqData {
  requestId: string;
  documentNumber: string;
  reason: string;
  attempts: number;
  originalPayload: CardRequestData;
  failedAt: string;
}
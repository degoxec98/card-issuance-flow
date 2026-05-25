export interface CardRequestData {
  requestId: string;
  documentNumber: string;
  currency: string;
  forceFailures?: number;
	forceError: boolean;
}

export interface IssuedCardData {
  id: string;
  maskedNumber: string;
  expiry: string;
  brand: string;
  currency: string;
}

export interface CardIssuedData {
  requestId: string;
  documentNumber: string;
  card: IssuedCardData;
  status: string;
}

export interface CardDlqData {
  requestId: string;
  documentNumber: string;
  reason: string;
  attempts: number;
  originalPayload: CardRequestData;
  failedAt: string;
}

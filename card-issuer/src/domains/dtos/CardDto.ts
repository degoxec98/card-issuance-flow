import {
  CardStatus,
  DocumentType,
  ProductCurrency,
  ProductType,
} from "../../commons/enums";

export interface CardDto {
  id: string;
  documentType: DocumentType;
  documentNumber: string;
  fullName: string;
  age: number;
  email: string;
  type: ProductType;
  currency: ProductCurrency;
  status: CardStatus;
  creationDate: number;
  updateDate: number;
}
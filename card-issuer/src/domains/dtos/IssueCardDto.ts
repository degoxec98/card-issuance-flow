import { DocumentType, ProductCurrency, ProductType } from "../../commons/enums";

export interface IssueCardDto {
  customer: {
    documentType: DocumentType;
    documentNumber: string;
    fullName: string;
    age: number;
    email: string;
  };
  product: {
    type: ProductType;
    currency: ProductCurrency;
  };
  forceError: boolean;
}
import Joi from "joi";
import {
  CardStatus,
  DocumentType,
  ProductCurrency,
  ProductType,
} from "../commons/enums";

const cardSchema = Joi.object({
  customer: Joi.object({
    documentType: Joi.string().valid(...Object.values(DocumentType)).required(),
    documentNumber: Joi.string().length(8).required(),
    fullName: Joi.string().required(),
    age: Joi.number().min(18).max(150).required(),
    email: Joi.string().email().required(),
  }).required(),
  product: Joi.object({
    type: Joi.string().valid(...Object.values(ProductType)).required(),
    currency: Joi.string().valid(...Object.values(ProductCurrency)).required(),
  }).required(),
  forceError: Joi.boolean().optional(),
});

export class Card {
  id: string;

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

  status: CardStatus;

  creationDate: number;

  updateDate: number;

  constructor(data?: Partial<Card>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  static instanceForCreate(data: Partial<Card>) {
    const { error } = cardSchema.validate(data, { convert: false });
    if (error) {
      throw new Error(`Invalid request data: ${error.message}`);
    }
    return new Card(data);
  }
}
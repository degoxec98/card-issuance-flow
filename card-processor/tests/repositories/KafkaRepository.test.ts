import { Producer } from "kafkajs";
import {
  KafkaEventRepositoryImpl,
  KafkaEventRepositoryImplProps,
} from "../../src/repositories/KafkaEventRepositoryImpl";
import { Card } from "../../src/domains/Card";
import { CardBrand } from "../../src/commons/enums";

describe("KafkaEventRepository", () => {
  describe("publishCardIssuedEvent", () => {
    it("should publish a card issued event", async () => {
      // Prepare
      const producerMock = {
        send: jest.fn(() => Promise.resolve()),
      } as unknown as Producer;

      const kafkaRepository = new KafkaEventRepositoryImpl({
        producer: producerMock,
        config: {},
      } as unknown as KafkaEventRepositoryImplProps);

      // Execute
      const response = await kafkaRepository.publishCardIssuedEvent(
        {
          requestId: "requestId",
          documentNumber: "87654324",
          currency: "PEN",
          forceError: false
        },
        new Card({
          id: "cardId",
          maskedNumber: "**** **** **** 1234",
          expiry: "12/25",
          brand: CardBrand.VISA,
        }),
        "sourceId"
      );

      // Validate
      expect(response).toBeUndefined();

      expect(producerMock.send).toHaveBeenCalledTimes(1);
    });
  });
  
  describe("publishCardDlqEvent", () => {
    it("should publish a card DLQ event", async () => {
      // Prepare
      const producerMock = {
        send: jest.fn(() => Promise.resolve()),
      } as unknown as Producer;

      const kafkaRepository = new KafkaEventRepositoryImpl({
        producer: producerMock,
        config: {},
      } as unknown as KafkaEventRepositoryImplProps);

      // Execute
      const response = await kafkaRepository.publishCardDlqEvent(
        {
          requestId: "requestId",
          documentNumber: "87654324",
          currency: "PEN",
          forceError: false
        },
        "sourceId",
        "reason description",
        3,
      );

      // Validate
      expect(response).toBeUndefined();

      expect(producerMock.send).toHaveBeenCalledTimes(1);
    });
  });
});
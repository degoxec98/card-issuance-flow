import { Producer } from "kafkajs";
import { Card } from "../../src/domains/Cards";
import {
  KafkaRepositoryImpl,
  KafkaRepositoryProps,
} from "../../src/repositories/KafkaRepositoryImpl";
import { DocumentType, ProductCurrency, ProductType } from "../../src/commons/enums";

class KafkaRepositoryImplStub extends KafkaRepositoryImpl {
  now?: number;

  constructor(props: KafkaRepositoryProps, now?: number) {
    super(props);
    this.now = now;
  }

  protected getUUID() {
    return "UUID" as any;
  }

  protected getTimestamp(): number {
    return this.now || 1678734965;
  }
}

describe("KafkaRepository", () => {
  describe("publishCreateCardEvent", () => {
    it("should publish a create card event", async () => {
      // Prepare
      const producerMock = {
        connect: jest.fn(() => Promise.resolve()),
        disconnect: jest.fn(() => Promise.resolve()),
        send: jest.fn(() => Promise.resolve()),
      } as unknown as Producer;

      const kafkaRepository = new KafkaRepositoryImplStub({
        producer: producerMock,
        config: {},
      } as unknown as KafkaRepositoryProps);

      // Execute
      const response = await kafkaRepository.publishCreateCardEvent(
        new Card({
          customer: {
            documentType: DocumentType.DNI,
            documentNumber: "87654324",
            fullName: "Juan Perez",
            age: 25,
            email: "abc@gmail.com"
          },
          product: {
            type: ProductType.VISA,
            currency: ProductCurrency.PEN
          },
          forceError: false
        }),
        "UUID"
      );

      // Validate
      expect(response).toBeUndefined();

      expect(producerMock.connect).toHaveBeenCalledTimes(1);
      expect(producerMock.send).toHaveBeenCalledTimes(1);
      expect(producerMock.disconnect).toHaveBeenCalledTimes(1);
    });
  });
});
import { DatabaseRepository } from "../../src/repositories/DatabaseRepository";
import { EventRepository } from "../../src/repositories/EventRepository";
import {
  ProcessCardServiceImpl,
  ProcessCardServiceImplProps,
} from "../../src/services/ProcessCardServiceImpl";

class ProcessCardServiceImplStub extends ProcessCardServiceImpl {
  constructor(props: ProcessCardServiceImplProps) {
    super(props);
  }

  protected getLatency() {
    return 1;
  }

  protected getRandomErrorChance() {
    return false;
  }
}

describe("ProcessCardService", () => {
  describe("execute", () => {
    it("should create card issued", async () => {
      // Prepare
      const databaseRepoMock = {
        findByDocument: jest.fn(() => Promise.resolve(undefined)),
        save: jest.fn(() => Promise.resolve()),
      } as unknown as DatabaseRepository;
      
      const eventRepoMock = {
        publishCardIssuedEvent: jest.fn(() => Promise.resolve()),
        publishCardDlqEvent: jest.fn(() => Promise.resolve()),
      } as unknown as EventRepository;

      const service = new ProcessCardServiceImplStub({
        databaseRepository: databaseRepoMock,
        eventRepository: eventRepoMock,
      } as unknown as ProcessCardServiceImplProps);

      // Execute
      const response = await service.execute(
        {
          requestId: "requestId",
          documentNumber: "87654321",
          currency: "PEN",
          forceFailures: 0,
          forceError: false
        },
        "sourceId"
      );

      // Validate
      expect(response).toBeUndefined();

      expect(databaseRepoMock.findByDocument).toHaveBeenCalledWith("87654321");
      expect(databaseRepoMock.save).toHaveBeenCalledWith(
        {
          requestId: "requestId",
          documentNumber: "87654321",
          currency: "PEN",
          forceFailures: 0,
          forceError: false
        },
        {
          id: expect.any(String),
          maskedNumber: expect.any(String),
          expiry: expect.any(String),
          brand: "VISA",
          cvv: expect.any(String),
          cardNumber: expect.any(String)
        },
      );
      expect(eventRepoMock.publishCardIssuedEvent).toHaveBeenCalledWith(
        {
          requestId: "requestId",
          documentNumber: "87654321",
          currency: "PEN",
          forceFailures: 0,
          forceError: false
        },
        {
          id: expect.any(String),
          maskedNumber: expect.any(String),
          expiry: expect.any(String),
          brand: "VISA",
          cvv: expect.any(String),
          cardNumber: expect.any(String)
        },
        "sourceId"
      );
      expect(eventRepoMock.publishCardDlqEvent).not.toHaveBeenCalled();
    });
    
    it("shouldn't create card issued when duplicate event", async () => {
      // Prepare
      const databaseRepoMock = {
        findByDocument: jest.fn(() => 
          Promise.resolve({ documentNumber: "87654321" }),
        ),
        save: jest.fn(() => Promise.resolve()),
      } as unknown as DatabaseRepository;
      
      const eventRepoMock = {
        publishCardIssuedEvent: jest.fn(() => Promise.resolve()),
        publishCardDlqEvent: jest.fn(() => Promise.resolve()),
      } as unknown as EventRepository;

      const service = new ProcessCardServiceImplStub({
        databaseRepository: databaseRepoMock,
        eventRepository: eventRepoMock,
      } as unknown as ProcessCardServiceImplProps);

      // Execute
      const response = await service.execute(
        {
          requestId: "requestId",
          documentNumber: "87654321",
          currency: "PEN",
          forceFailures: 0,
          forceError: false
        },
        "sourceId"
      );

      // Validate
      expect(response).toBeUndefined();

      expect(databaseRepoMock.findByDocument).toHaveBeenCalledWith("87654321");
      expect(databaseRepoMock.save).not.toHaveBeenCalled();
      expect(eventRepoMock.publishCardIssuedEvent).not.toHaveBeenCalled();
      expect(eventRepoMock.publishCardDlqEvent).toHaveBeenCalledWith(
        {
          requestId: "requestId",
          documentNumber: "87654321",
          currency: "PEN",
          forceFailures: 0,
          forceError: false
        },
        "sourceId",
        "Duplicate event detected",
        0,
      );
    });
  });
});
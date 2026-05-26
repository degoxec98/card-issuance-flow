import { Card } from "../../src/domains/Cards";
import { CardsServiceImpl, CardsServiceProps } from "../../src/services/CardsServiceImpl";
import { DatabaseRepository } from "../../src/repositories/DatabaseRepository";
import { EventRepository } from "../../src/repositories/EventRepository";

describe("CardsService", () => {
  describe("issue", () => {
    it("should create a card", async () => {
      // Prepare
      const databaseRepoMock = {
        findCardByDocumentNumber: jest.fn(() => Promise.resolve(undefined)),
        saveCard: jest.fn(() => Promise.resolve({
          requestId: "UUID",
          status: "PENDING",
        })),
      } as unknown as DatabaseRepository;
      
      const eventRepoMock = {
        publishCreateCardEvent: jest.fn(() => Promise.resolve()),
      } as unknown as EventRepository;

      const service = new CardsServiceImpl({
        databaseRepo: databaseRepoMock,
        eventRepo: eventRepoMock,
      } as unknown as CardsServiceProps);

      // Execute
      const response = await service.issue({
        customer: {
          documentType: "DNI",
          documentNumber: "87654324",
          fullName: "Juan Perez",
          age: 25,
          email: "abc@gmail.com"
        },
        product: {
          type: "VISA",
          currency: "PEN"
        },
        forceError: false
      } as unknown as Card);

      // Validate
      expect(response).toEqual(
        expect.objectContaining({
          requestId: "UUID",
          status: "PENDING",
        }),
      );

      expect(databaseRepoMock.findCardByDocumentNumber).toHaveBeenCalledWith(
        "87654324"
      );
      expect(databaseRepoMock.saveCard).toHaveBeenCalledWith(
        {
          customer: {
            documentType: "DNI",
            documentNumber: "87654324",
            fullName: "Juan Perez",
            age: 25,
            email: "abc@gmail.com"
          },
          product: {
            type: "VISA",
            currency: "PEN"
          },
          forceError: false
        },
      );
      expect(eventRepoMock.publishCreateCardEvent).toHaveBeenCalledWith(
        {
          customer: {
            documentType: "DNI",
            documentNumber: "87654324",
            fullName: "Juan Perez",
            age: 25,
            email: "abc@gmail.com"
          },
          product: {
            type: "VISA",
            currency: "PEN"
          },
          forceError: false
        },
        "UUID"
      );
    });
    
    it("shouldn't create a card when exists customer", async () => {
      // Prepare
      const databaseRepoMock = {
        findCardByDocumentNumber: jest.fn(() => Promise.resolve({
          documentNumber: "87654324",
        })),
        saveCard: jest.fn(() => Promise.resolve({
          requestId: "UUID",
          status: "PENDING",
        })),
      } as unknown as DatabaseRepository;
      
      const eventRepoMock = {
        publishCreateCardEvent: jest.fn(() => Promise.resolve()),
      } as unknown as EventRepository;

      const service = new CardsServiceImpl({
        databaseRepo: databaseRepoMock,
        eventRepo: eventRepoMock,
      } as unknown as CardsServiceProps);

      // Execute
      await expect(
        service.issue({
          customer: {
            documentType: "DNI",
            documentNumber: "87654324",
            fullName: "Juan Perez",
            age: 25,
            email: "abc@gmail.com"
          },
          product: {
            type: "VISA",
            currency: "PEN"
          },
          forceError: false
        } as unknown as Card)
      ).rejects.toThrow(
        new Error("Customer with this document number already has a card")
      );

      // Validate
      expect(databaseRepoMock.findCardByDocumentNumber).toHaveBeenCalledWith(
        "87654324"
      );
      expect(databaseRepoMock.saveCard).not.toHaveBeenCalled();
      expect(eventRepoMock.publishCreateCardEvent).not.toHaveBeenCalled();
    });
  });
});
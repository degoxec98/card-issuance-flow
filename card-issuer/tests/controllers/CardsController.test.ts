import { CardsService } from '../../src/services/CardsService';
import { CardsController, CardsControllerProps } from '../../src/controllers/CardsController';
import { IssueCardDto } from '../../src/domains/dtos/IssueCardDto';

describe("CardsController", () => {
  describe("issue", () => {
    it("should create a card", async () => {
      // Prepare
      const serviceMock = {
        issue: jest.fn(() =>
          Promise.resolve({
            requestId: "UUID",
            status: "PENDING",
          }),
        ),
      } as unknown as CardsService;

      const controller = new CardsController({
        service: serviceMock,
      } as unknown as CardsControllerProps);

      // Execute
      const response = await controller.issue({
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
      } as unknown as IssueCardDto);

      // Validate
      expect(response).toEqual(
        expect.objectContaining({
          requestId: "UUID",
          status: "PENDING",
        }),
      );

      expect(serviceMock.issue).toHaveBeenCalledWith(
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
    });
    
    it("shouldn't create a card when documentType is invalid", async () => {
      // Prepare
      const serviceMock = {
        issue: jest.fn(() =>
          Promise.resolve({
            requestId: "UUID",
            status: "PENDING",
          }),
        ),
      } as unknown as CardsService;

      const controller = new CardsController({
        service: serviceMock,
      } as unknown as CardsControllerProps);

      // Execute
      await expect(
        controller.issue({
          customer: {
            documentType: "RUC",
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
        } as unknown as IssueCardDto)
      ).rejects.toThrow(
        new Error('Invalid request data: "customer.documentType" must be [DNI]'),
      );
      
      expect(serviceMock.issue).not.toHaveBeenCalled();
    });
    
    it("shouldn't create a card when email is invalid", async () => {
      // Prepare
      const serviceMock = {
        issue: jest.fn(() =>
          Promise.resolve({
            requestId: "UUID",
            status: "PENDING",
          }),
        ),
      } as unknown as CardsService;

      const controller = new CardsController({
        service: serviceMock,
      } as unknown as CardsControllerProps);

      // Execute
      await expect(
        controller.issue({
          customer: {
            documentType: "DNI",
            documentNumber: "87654324",
            fullName: "Juan Perez",
            age: 25,
            email: "correo"
          },
          product: {
            type: "VISA",
            currency: "PEN"
          },
          forceError: false
        } as unknown as IssueCardDto)
      ).rejects.toThrow(
        new Error('Invalid request data: "customer.email" must be a valid email'),
      );
      
      expect(serviceMock.issue).not.toHaveBeenCalled();
    });

    it("shouldn't create a card when product.type is invalid", async () => {
      // Prepare
      const serviceMock = {
        issue: jest.fn(() =>
          Promise.resolve({
            requestId: "UUID",
            status: "PENDING",
          }),
        ),
      } as unknown as CardsService;
  
      const controller = new CardsController({
        service: serviceMock,
      } as unknown as CardsControllerProps);
  
      // Execute
      await expect(
        controller.issue({
          customer: {
            documentType: "DNI",
            documentNumber: "87654324",
            fullName: "Juan Perez",
            age: 25,
            email: "correo@ejemplo.com"
          },
          product: {
            type: "INVALID_TYPE",
            currency: "PEN"
          },
          forceError: false
        } as unknown as IssueCardDto)
      ).rejects.toThrow(
        new Error('Invalid request data: "product.type" must be [VISA]'),
      );
      
      expect(serviceMock.issue).not.toHaveBeenCalled();
    });
  });
});
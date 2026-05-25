import { Kafka, Partitioners, logLevel } from "kafkajs";
import { InMemoryDatabaseRepositoryImpl } from "./InMemoryDatabaseRepositoryImpl";
import { KafkaEventRepositoryImpl } from "./KafkaEventRepositoryImpl";
import { ProcessCardServiceImpl } from "../services/ProcessCardServiceImpl";
import { CardRequestConsumer } from "../infrastructure/kafka/CardRequestConsumer";

const brokers = (process.env.KAFKA_BROKERS ?? "localhost:29092").split(",");
const clientId = process.env.KAFKA_CLIENT_ID ?? "card-processor-service";
const kafka = new Kafka({
  clientId,
  brokers,
  logLevel: logLevel.WARN,
});
const producer = kafka.producer({
  allowAutoTopicCreation: false,
  createPartitioner: Partitioners.DefaultPartitioner,
});

export const databaseRepository = new InMemoryDatabaseRepositoryImpl({
  config: {},
});

export const eventRepository = new KafkaEventRepositoryImpl({
  producer,
  config: {},
});

export const processCardService = new ProcessCardServiceImpl({
  databaseRepository,
  eventRepository,
  config: {},
});

export const consumer = new CardRequestConsumer({
  brokers,
  clientId,
  groupId: "card-processor-group",
  service: processCardService,
  config: {},
});

export { producer };

export * from "./DatabaseRepository";
export * from "./EventRepository";
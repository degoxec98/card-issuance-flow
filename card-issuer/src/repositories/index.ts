import { Kafka, Partitioners, logLevel } from "kafkajs";
import { InMemoryDatabaseRepositoryImpl } from "./InMemoryDatabaseRepositoryImpl";
import { KafkaRepositoryImpl } from "./KafkaRepositoryImpl";

const brokers = (process.env.KAFKA_BROKERS ?? "localhost:9092").split(",");
const clientId = process.env.KAFKA_CLIENT_ID ?? "card-issuer-service";

export const databaseRepo = new InMemoryDatabaseRepositoryImpl({
  config: {},
})

export const eventRepo = new KafkaRepositoryImpl({
  producer: new Kafka({ clientId, brokers, logLevel: logLevel.WARN })
    .producer({
      allowAutoTopicCreation: false,
      createPartitioner: Partitioners.DefaultPartitioner,
    }),
  config: {}
});
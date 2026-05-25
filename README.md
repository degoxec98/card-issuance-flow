# IO Cards — Emisión de tarjetas event-driven

Proceso de emisión de tarjetas para nuevos clientes basado en eventos sobre Apache Kafka.

## Requisitos
- Node.js ≥ 20
- Docker + Docker Compose

## Cómo ejecutar (con Docker)

```bash
docker compose up --build
```

Esto levanta:
- `kafka` (puerto 9092 expuesto al host, 29092 interno)
- `card-issuer` en `http://localhost:3000`
- `card-processor` (consumer, sin puerto)

## Endpoints

### POST `/cards/issue`

**Request:**
```json
{
  "customer": {
      "documentType": "DNI",
      "documentNumber": "87654321",
      "fullName": "Juan Perez",
      "age": 25,
      "email": "juan@example.com"
    },
    "product": {
      "type": "VISA",
      "currency": "PEN"
    },
    "forceError": true
}
```

**Response `202 Accepted`:**
```json
{
  "requestId": "8f...uuid",
  "status": "PENDING",
}
```

## Probar el flujo

```bash
# Caso éxito (puede tardar si toca reintento por random)
curl --location --request POST 'http://localhost:3000/cards/issue' \
--header 'Content-Type: application/json' \
--data-raw '{
    "customer": {
        "documentType": "DNI",
        "documentNumber": "87654321",
        "fullName": "Juan Perez",
        "age": 25,
        "email": "juan@example.com"
      },
      "product": {
        "type": "VISA",
        "currency": "PEN"
      },
      "forceError": false
}'

# Caso forzado a DLQ (forceFailures >= 4 garantiza fallar todos los intentos)
curl --location --request POST 'http://localhost:3000/cards/issue' \
--header 'Content-Type: application/json' \
--data-raw '{
    "customer": {
        "documentType": "DNI",
        "documentNumber": "87654321",
        "fullName": "Juan Perez",
        "age": 25,
        "email": "juan@example.com"
      },
      "product": {
        "type": "VISA",
        "currency": "PEN"
      },
      "forceError": true
}'
```

Para ver los eventos publicados, en otra terminal:

```bash
# Eventos emitidos
docker exec io-kafka /opt/kafka/bin/kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 --topic io.card.requested.v1 --from-beginning

# Eventos exitosos
docker exec io-kafka /opt/kafka/bin/kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 --topic io.cards.issued.v1 --from-beginning

# DLQ
docker exec io-kafka /opt/kafka/bin/kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 --topic io.card.requested.v1.dlq --from-beginning
```

## Tests

```bash
# En card-issuer/
npm test

# En card-processor/
npm test
```
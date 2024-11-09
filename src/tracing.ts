import 'dotenv/config';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { Resource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { AmqplibInstrumentation } from '@opentelemetry/instrumentation-amqplib';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,  // O endereço do Collector no Docker Compose
  }),
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'service-a',
    [SemanticResourceAttributes.SERVICE_NAMESPACE]: 'minha-aplicacao',
    [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: process.env.HOSTNAME || 'instance-1',  // ID da instância
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.VERSION,
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.ENVIRONMENT,  // ou 'staging', 'development'
    [SemanticResourceAttributes.HOST_NAME]: process.env.DD_HOSTNAME || process.env.HOSTNAME 
  }),
  instrumentations: [
    //new HttpInstrumentation(),
    //new ExpressInstrumentation(),
    new NestInstrumentation(),
    new PgInstrumentation(),  // Apenas se precisar de traços para consultas SQL no PostgreSQL
    new AmqplibInstrumentation(),
  ],
});

sdk.start();


process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("Tracing terminated"))
    .catch((error) => console.log("Error terminating tracing", error))
    .finally(() => process.exit(0));
});

export default sdk;
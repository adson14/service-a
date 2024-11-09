## Prepara o ambiente

### Rodas os seguintes comandos na pasta raiz do projeto:

- Para criar uma rede docker

  - `docker network create microservices_network`

- Criar .env com base no .env.example

 
- Start no projeto
  - `docker-compose up -d --build`

### Endpoints:

http://localhost:3001

> Este projeto foi desenvolvido para fins didáticos onde, o service-a se comunica com o service-b através de Mensageria utilizando o RabitMQ.Para mais detalhe consulte: https://github.com/adson14/microservice_a_b

### Tecnologias:

- NestJS
- Postgress SQL
- RabitMQ
- Docker
- OpenTelemetry

### Telemetria

> Para capturar os dados de telemetria está sendo utilizado o OpenTelemetry, como exporter estou utilizando o Jaeger, que está rodando localmente no container e o Datadog. Para capturar os dados no Datadog é necessário criar uma conta na plataforma para obter a API KEY.

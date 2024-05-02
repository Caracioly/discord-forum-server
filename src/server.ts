import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import { errorHandler } from "./error-handler";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import { getUserPosts } from "./routes/get-user-posts";
import { getUser } from "./routes/get-user";
import { getUserComments } from "./routes/get-user-comments";
import { createUser } from "./routes/create-user";

const app = fastify();

app.register(fastifyCors, {
  origin: "*", // https://meufrontend.com
});

app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "discord forum",
      description:
        "O discord forum é um 'clone' do forum do discord com funcionalidades parecidas",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(getUser);
app.register(getUserPosts);
app.register(getUserComments);
app.register(createUser);

app.setErrorHandler(errorHandler);

app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("HTTP server running");
});

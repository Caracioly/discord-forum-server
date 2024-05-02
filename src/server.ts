import fastify from "fastify";
import fastifyCors from "@fastify/cors";

import { getUser } from "./routes/get-user";
import { errorHandler } from "./error-handler";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

const app = fastify();

app.register(fastifyCors, {
  origin: "*", // https://meufontend.com
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(getUser);

app.setErrorHandler(errorHandler);

app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("HTTP server running");
});

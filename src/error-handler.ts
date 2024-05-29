import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { FastifyInstance } from "fastify";
import { BadRequest } from "./routes/_erros/bad-request";
import { ZodError } from "zod";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Error during validation",
      erros: error.flatten().fieldErrors,
    });
  }

  if (error instanceof BadRequest) {
    return reply.status(400).send({ message: error.message });
  }

  if (error instanceof PrismaClientKnownRequestError) {
    if (error.meta?.target == "email") {
      return reply
        .status(500)
        .send({ message: "Another user with same email already exists." });
    }

    if (error.meta?.target == "user_tag") {
      return reply
        .status(500)
        .send({ message: "Another user with same user tag already exists." });
    }
  }
  
  return reply.status(500).send({ message: "Internal server error" });
};

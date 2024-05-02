import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { BadRequest } from "./_erros/bad-request";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/users",
    {
      schema: {
        summary: "create a new user",
        tags: ["users"],
        body: z.object({
          email: z.string().email(),
          userTag: z.string().min(4),
          password: z.string(),
        }),
        response: {
          201: z.object({ userId: z.string().uuid(), createdAt: z.date() }),
        },
      },
    },
    async (request, reply) => {
      const { email, userTag, password } = request.body;

      const userWithSameEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      console.log(userWithSameEmail)

      const user = await prisma.user.create({
        data: {
          email,
          userTag,
          password,
        },
      });

      if (userWithSameEmail !== null) {
        throw new BadRequest("Another user with same email already exists.");
      }

      return reply.status(201).send({ userId: user.id, createdAt: user.createdAt });
    }
  );
}
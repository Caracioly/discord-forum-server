import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { BadRequest } from "./_erros/bad-request";
import { compare } from "bcrypt";
import { prisma } from "../lib/prisma";
import { z } from "zod";

import jwt from "jsonwebtoken";

export async function loginAuth(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/login",
    {
      schema: {
        summary: "User login",
        tags: ["auth"],
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
          400: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new BadRequest("Invalid email or password");
      }

      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        throw new BadRequest("Invalid email or password");
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "7d" }
      );

      return reply.send({ token });
    }
  );
}

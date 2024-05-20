import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { BadRequest } from "./_erros/bad-request";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function getUserByEmail(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/users/:userEmail",
    {
      schema: {
        summary: "get user by email",
        tags: ["users"],
        params: z.object({
          userEmail: z.string().email(),
        }),
        response: {
          200: z.object({
            user: z.object({
              id: z.string().uuid(),
              email: z.string().email(),
              userTag: z.string(),
              password: z.string(),
              createdAt: z.date(),
              profilePicUrl: z.string().nullable(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { userEmail } = request.params;

      const user = await prisma.user.findUnique({
        select: {
          id: true,
          email: true,
          userTag: true,
          password: true,
          createdAt: true,
          profilePicUrl: true,
          comments: false,
          posts: false,
        },
        where: {
          email: userEmail,
        },
      });

      if (user === null) {
        throw new BadRequest("User not Found");
      }

      return reply.send({
        user: {
          id: user.id,
          email: user.email,
          userTag: user.userTag,
          password: user.password,
          createdAt: user.createdAt,
          profilePicUrl: user.profilePicUrl,
        },
      });
    }
  );
}

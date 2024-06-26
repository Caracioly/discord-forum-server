import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { BadRequest } from "./_erros/bad-request";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function getUserById(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/users/:userId",
    {
      schema: {
        summary: "get user by id",
        tags: ["users"],
        params: z.object({
          userId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            user: z.object({
              id: z.string().uuid(),
              email: z.string().email(),
              userTag: z.string(),
              createdAt: z.date(),
              birthDate: z.date(),
              profilePicUrl: z.string().nullable(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { userId } = request.params;

      const user = await prisma.user.findUnique({
        select: {
          id: true,
          email: true,
          userTag: true,
          createdAt: true,
          birthDate: true,
          profilePicUrl: true,
        },
        where: {
          id: userId,
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
          createdAt: user.createdAt,
          birthDate: user.birthDate,
          profilePicUrl: user.profilePicUrl,
        },
      });
    }
  );
}

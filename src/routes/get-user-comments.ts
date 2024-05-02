import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { BadRequest } from "./_erros/bad-request";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function getUserComments(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/users/:userId/comments",
    {
      schema: {
        summary: "get all user comments by user id",
        tags: ["comments"],
        params: z.object({
          userId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            comment: z.array(
              z.object({
                id: z.string().uuid(),
                content: z.string().nullable(),
                createdAt: z.date(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { userId } = request.params;

      const comments = await prisma.post.findMany({
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
        where: {
          authorId: userId,
        },
      });

      if (comments.length === 0) {
        throw new BadRequest("This user does not have any comments yet");
      }

      const formatedComments = comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
      }));

      return reply.send({
        comment: formatedComments,
      });
    }
  );
}

import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { BadRequest } from "./_erros/bad-request";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function getUserPosts(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/users/:userId/posts",
    {
      schema: {
        summary: "get all user posts by user id",
        tags: ["posts"],
        params: z.object({
          userId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            post: z.array(
              z.object({
                id: z.string().uuid(),
                title: z.string(),
                content: z.string().nullable(),
                published: z.boolean(),
                createdAt: z.date(),
                comments: z.array(
                  z.object({
                    id: z.string().uuid(),
                    content: z.string(),
                    createdAt: z.date(),
                  })
                ),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { userId } = request.params;

      const posts = await prisma.post.findMany({
        select: {
          id: true,
          title: true,
          content: true,
          published: true,
          createdAt: true,
          comments: true,
        },
        where: {
          authorId: userId,
        },
      });

      if (posts.length === 0) {
        throw new BadRequest("This user does not have any posts yet");
      }

      const formatedPosts = posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        published: post.published,
        createdAt: post.createdAt,
        comments: post.comments,
      }));

      return reply.send({
        post: formatedPosts,
      });
    }
  );
}

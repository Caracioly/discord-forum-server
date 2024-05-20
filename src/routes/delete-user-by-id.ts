import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { BadRequest } from "./_erros/bad-request";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function deleteUserById(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/users/:userId",
    {
      schema: {
        summary: "Delete user by id",
        tags: ["users"],
        params: z.object({
          userId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
          400: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { userId } = request.params;

      const user = await prisma.user.delete({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new BadRequest("User not found or could not be deleted");
      }

      return reply.send({ message: `User ${user.email} deleted successfully` });
    }
  );
}

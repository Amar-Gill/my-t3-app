import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  createPost: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        title: z.string(),
        content: z.string(),
        published: z.boolean(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: {
          authorId: input.userId,
          title: input.title,
          content: input.content,
          published: input.published,
        },
      });
    }),
  listPosts: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.post.findMany({
      where: {
        authorId: input,
      },
    });
  }),
  listPublishedPosts: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findMany({
        where: {
          authorId: input,
          published: true,
        },
      });
    }),
});

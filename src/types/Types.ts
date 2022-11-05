import { Prisma, PrismaClient } from "@prisma/client";

export interface ErrorOutputType {
    message: string,
    code: number
}

export interface Context {
    prisma: PrismaClient<
      Prisma.PrismaClientOptions,
      never,
      Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined >,
    userId: Promise<string | undefined> | string | undefined

}

export interface UserType {
  email: string,
  name: string | null,
  id: number
}

export interface ProfileType {
  bio?: string,
  userId: number,
  id: number,
}

export interface PostType {
  id: number,
  title: string,
  content?: string,
  published: boolean,
  authorId: number,
}

export interface ParentUserInput {
  userId: number
}

import { PrismaClient } from "@prisma/client";
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import dotenv from 'dotenv';
import { IncomingMessage } from 'node:http';
import { Mutation, Post, Profile, Query } from "./resolvers";
import { typeDefs } from './scheme';
import { Context } from "./types/Types";
import parseUserId from "./utils/parseUserId";

dotenv.config()

export const prisma = new PrismaClient();

const server = new ApolloServer<Context>({
    typeDefs: typeDefs,
    resolvers: {
        Query,
        Mutation,
        Profile,
        Post
    },
    includeStacktraceInErrorResponses: false,
});

const start = async () => {

    const { url } = await startStandaloneServer(server, {
        context: async ({ req }: { req: IncomingMessage }): Promise<Context> => ({
            prisma,
            userId: await parseUserId(req)
        }),
        listen: { port: 4000 },
    });

    console.log(`🚀  Server ready at ${url}`);
}

start()

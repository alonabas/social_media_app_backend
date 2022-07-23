import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server";
import dotenv from 'dotenv';
import { IncomingMessage } from 'node:http';
import { Mutation, Post, Profile, Query } from "./resolvers";
import { typeDefs } from './scheme';
import { Context } from "./types/Types";
import parseUserId from "./utils/parseUserId";

dotenv.config()

export const prisma = new PrismaClient();

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: {
        Query,
        Mutation,
        Profile,
        Post
    },
    context: async ({req}: {req: IncomingMessage}): Promise<Context> => ({
        prisma,
        userId: await parseUserId(req)
    })
});

server.listen().then(({url}) => {
    console.log(`Server is ready at ${url}`)
});
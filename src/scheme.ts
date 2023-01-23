import { gql } from "apollo-server";

export const typeDefs = gql`
    type Query {
        hello: String!,
        me: UserError!,
        profile(userId: ID!): ProfileError!,
        posts: PostsOutput
    }

    type Mutation {
        signup(auth: AuthInput!, name: String!, bio: String): AuthOutput!,
        signin(auth: AuthInput): AuthOutput!,
        postCreate(post: PostInput!): PostOutput!,
        postUpdate(postId: ID!, post: PostInput!): PostOutput!,
        postDelete(postId: ID!): PostOutput!,
        postPublish(postId: ID!): PostOutput!,
        postUnpublish(postId: ID!): PostOutput!
    }

    input AuthInput {
        email: String!,
        password: String!
    }

    input PostInput {
        title: String,
        content: String,
    }
    
    type AuthOutput {
        token: String,
        errors: [UserError!]!
    }

    type UserError {
        message: String!,
        code: Int!
    }

    type User {
        id: ID!,
        email: String!,
        name: String,
        posts: [Post!]!
    }

    type Post {
        id: ID!,
        title: String!,
        content: String!,
        published: Boolean!,
        author: User!,
    }

    type UserError {
        user: User,
        errors: [UserError!]!
    }

    type ProfileError {
        profile: Profile,
        errors: [UserError!]!
    }

    type Profile {
        id: ID!,
        bio: String,
        user: User!,
        isMe: Boolean!,
    }

    type PostOutput {
        post: Post,
        errors: [UserError!]!
    }
    type PostsOutput {
        posts: [Post!]!,
        errors: [UserError!]!
    }
`

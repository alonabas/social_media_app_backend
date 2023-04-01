import { GraphQLError } from "graphql";
import { Context, ErrorOutputType, PaginationInput, PostType, ProfileType, UserType } from "../types/Types";
import { AUTH_ERROR_CODE, SERVER_ERROR_CODE } from "../utils/constants";

interface MePayloadType {
    errors: ErrorOutputType[],
    user?: UserType
}
  
interface UserTypeInput {
    userId: string
}

interface PostsListTypeInput {
    userId?: string,
    take: number,
    cursorId: number,
}

interface ProfilePayloadType {
    errors: ErrorOutputType[],
    profile?: ProfileType
}

interface PostsPayloadType  {
    errors: ErrorOutputType[],
    posts: Array<PostType>,
    hasMore: boolean

}

interface UsersListPayloadType {
    errors: ErrorOutputType[],
    users: UserType[],
    hasMore: boolean
}


export const Query = {
    hello: () => 'hello world!!',
    me: async (
        __: any,
        _: any,
        { prisma, userId }: Context
    ): Promise<MePayloadType> => {
        if (!userId) {
            throw new GraphQLError('You are not authenticated.', {
                extensions: {
                  code: 'UNAUTHENTICATED',
                  http: {
                    status: 401,
                  },
                },
              });
        }
        let userObj = await prisma.user.findUnique({ where: { id: Number(userId) } });
        if (!userObj) {
            return {
                errors: [{ message: 'You should sign in first', code: AUTH_ERROR_CODE }],
                user: undefined
            }
        }
        return {
            errors: [],
            user: userObj as UserType
        }
    },
    profile: async (
        _ : any,
        {userId: userToSearch}: UserTypeInput,
        {userId, prisma}: Context
    ): Promise<ProfilePayloadType> => {
        if (!userId) {
            throw new GraphQLError('You are not authenticated.', {
                extensions: {
                  code: 'UNAUTHENTICATED',
                  http: {
                    status: 401,
                  },
                },
              });
        }

        let profileObj = await prisma.profile.findUnique({ where: { userId: Number(userToSearch) } });
        if (!profileObj) {
            return {
                errors: [{ message: `User with id ${userToSearch} does not exists`, code: SERVER_ERROR_CODE }],
                profile: undefined
            }
        }
        const profile = {...profileObj, isMe: profileObj.id === Number(userId)};
        return {
            errors: [],
            profile: profile as ProfileType
        }

    },
    users: async (
        _ : any,
        {take, cursorId} : PaginationInput,
        {userId, prisma}: Context
    ): Promise<UsersListPayloadType> => {
        if (!userId) {
            throw new GraphQLError('You are not authenticated.', {
                extensions: {
                  code: 'UNAUTHENTICATED',
                  http: {
                    status: 401,
                  },
                },
            });
        }
        const cursor = cursorId ? {id: cursorId} : undefined;
        const users = await prisma.user.findMany({
            orderBy: {
                updatedAt: 'desc'
            },
            cursor: cursor,
            take: take + 1
        });
        const hasMore = users.length > take
        return {
            errors: [],
            users: hasMore ? users.slice(0, -1) : users,
            hasMore,
        }
    },
    posts: async (
        _ : any,
        obj: PostsListTypeInput,
        {userId, prisma}: Context
    ): Promise<PostsPayloadType> => {
        if (!userId) {
            throw new GraphQLError('You are not authenticated.', {
                extensions: {
                  code: 'UNAUTHENTICATED',
                  http: {
                    status: 401,
                  },
                },
              });
        }
        const {userId: postsFromUser, take, cursorId} = obj
        const cursor = cursorId ? {id: cursorId} : undefined;
        const posts = await prisma.post.findMany({
            where: {
                published: postsFromUser !== userId.toString() ? true : undefined,
                authorId: postsFromUser ? Number(postsFromUser) : undefined
            },
            orderBy: {
                updatedAt: 'desc'
            },
            cursor,
            take: take + 1,
        });
        const hasMore = posts.length > take

        const postWithMe: Array<PostType> = (hasMore ? posts.slice(0, -1) : posts).map(p => ({
            ...p,
            isMy: Number(userId) === p.authorId,
        }))
        return {
            errors: [],
            posts: postWithMe as Array<PostType>,
            hasMore
        }
    }
}
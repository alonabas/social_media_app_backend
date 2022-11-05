import { Context, ErrorOutputType, PostType, ProfileType, UserType } from "../types/Types";
import { AUTH_ERROR_CODE, SERVER_ERROR_CODE } from "../utils/constants";

interface MePayloadType {
    errors: ErrorOutputType[],
    user?: UserType
}
  
interface UserTypeInput {
    userId: string
}

interface ProfilePayloadType {
    errors: ErrorOutputType[],
    profile?: ProfileType
}

interface PostsPayloadType  {
    errors: ErrorOutputType[],
    posts: Array<PostType>
}



export const Query = {
    hello: () => 'hello world!!',
    me: async (
        __: any,
        _: any,
        { prisma, userId }: Context
    ): Promise<MePayloadType> => {
        if (!userId) {
            return {
                errors: [{message: 'You should sign in first', code: AUTH_ERROR_CODE}],
                user: undefined
            }
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
            return {
                errors: [{message: 'You should sign in first', code: AUTH_ERROR_CODE}],
                profile: undefined
            }
        }

        let profileObj = await prisma.profile.findUnique({ where: { userId: Number(userToSearch) } });
        if (!profileObj) {
            return {
                errors: [{ message: `User with id ${userToSearch} does not exists`, code: SERVER_ERROR_CODE }],
                profile: undefined
            }
        }
        return {
            errors: [],
            profile: profileObj as ProfileType
        }

    },
    posts: async (
        _ : any,
        __: any,
        {userId, prisma}: Context
    ): Promise<PostsPayloadType> => {
        if (!userId) {
            return {
                errors: [{message: 'You should sign in first', code: AUTH_ERROR_CODE}],
                posts: []
            }
        }
        const posts = await prisma.post.findMany({
            where: {
                published: true
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });
        return {
            errors: [],
            posts: posts as Array<PostType>
        }
    }
}

import { Context, PaginationInput, ParentUserInput, PostsResponseType, PostType, UserType } from '../types/Types';


export const Profile = {
    user: async (
        {userId: userIdFromProfile}: ParentUserInput,
        _ : any,
        {prisma}: Context
    ): Promise<UserType | null> => {
        return await prisma.user.findUnique({where: {id: userIdFromProfile}}) as UserType
    },
    posts: async ({userId: userIdFromProfile}: ParentUserInput,
        {cursorId, take} : PaginationInput,
        {prisma, userId}: Context
    ): Promise<PostsResponseType> => {
        const where: {authorId: number, published?: boolean} = {
            authorId : userIdFromProfile,
            published: true
        }
        if (Number(userId) === userIdFromProfile ) {
            where.published = undefined
        }
        const cursor = cursorId ? {id: cursorId} : undefined;

        const result = await prisma.post.findMany({
            where: where, 
            take: take + 1,
            cursor: cursor,
            orderBy: [{updatedAt: 'desc'}]
        });
        const hasMore = result.length > take
        return {
            posts: (hasMore ? result.slice(0, -1) : result).map(r => ({
                ...r, 
                isMy: true,
            })),
            hasMore,
        }
    },
}

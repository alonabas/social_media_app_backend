
import { Context, LastCountInput, ParentUserInput, PostType, UserType } from '../types/Types';


export const Profile = {
    user: async (
        {userId: userIdFromProfile}: ParentUserInput,
        _ : any,
        {prisma}: Context
    ): Promise<UserType | null> => {
        return await prisma.user.findUnique({where: {id: userIdFromProfile}}) as UserType
    },
    posts: async ({userId: userIdFromProfile}: ParentUserInput,
        {last} : LastCountInput,
        {prisma, userId}: Context
    ): Promise<Array<PostType> | null> => {
        const where: {authorId: number, published?: boolean} = {
            authorId : userIdFromProfile,
            published: true
        }
        if (Number(userId) === userIdFromProfile ) {
            where.published = undefined
        }
        const result = await prisma.post.findMany({
            where: where, 
            take: last,
            orderBy: [{updatedAt: 'desc'}]
        });
        return result.map(r => ({
            ...r, 
            isMy: true,
        }));
    },
}

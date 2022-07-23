
import { Context, ParentUserInput, UserType } from '../types/Types';


export const Profile = {
    user: async (
        {userId: userIdFromProfile}: ParentUserInput,
        _ : any,
        {prisma}: Context
    ): Promise<UserType | null> => {
        return await prisma.user.findUnique({where: {id: userIdFromProfile}}) as UserType
    }
}

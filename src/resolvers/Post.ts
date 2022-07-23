import { Context, PostType, UserType } from "../types/Types";
import { userLoader } from "../utils/userLoader";

export const Post = {
    author: async (
        post: PostType,
        _ : any,
        {prisma}: Context
    ): Promise<UserType | undefined> => {
        return await userLoader.load(post.authorId)
    }
}

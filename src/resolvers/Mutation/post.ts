import { Context, ErrorOutputType, PostType } from "../../types/Types";


interface PostInputType {
    post: {
        title?: string,
        content?: string
    },
    postId?: string
}

interface PostIdInputType {
    postId: string
}

interface PostOutputType {
    errors: ErrorOutputType[],
    post: PostType | undefined,
}

export const postResolvers = {
    postCreate: async (
        _: any,
        {post}: PostInputType,
        { prisma, userId }: Context
    ): Promise<PostOutputType> => {
        if (!userId) {
            return {
                errors: [{message: 'You should sign in first'}],
                post: undefined
            }
        }
        const { title, content } = post;

        if (!title || !content) {
            return {
                errors: [{message: 'You should provide title and content of the post'}],
                post: undefined
            }
        }
        const result = await prisma.post.create({data: {
            authorId: +userId,
            title,
            content
        }});
        return {
            errors: [],
            post: result
        }
    },
    postUpdate: async (
        _: any,
        {post, postId}: PostInputType,
        { prisma, userId }: Context
    ): Promise<PostOutputType> => {
        if (!userId) {
            return {
                errors: [{message: 'You should sign in first'}],
                post: undefined
            }
        }
        if (!postId) {
            return {
                errors: [{message: 'Please provide Post ID you would like to change'}],
                post: undefined
            }
        }
        const { title, content } = post;

        if (!title && !content) {
            return {
                errors: [{message: 'You should provide a new title or content of the post'}],
                post: undefined
            }
        }
        const postObj = await prisma.post.findUnique({where: {id: +postId}})

        if (!postObj) {
            return {
                errors: [{message: `Post with id ${postId} doesnt exist`}],
                post: undefined
            }
        }
        if (+postObj.authorId !== +userId) {
            return {
                errors: [{message: `Your are not owner of the post ${postId}. You are not allowed to edit it`}],
                post: undefined
            }
        }
        const result = await prisma.post.update({
            where: {
                id: +postId
            },
            data: {
                ...postObj,
                content: content ?? postObj.content,
                title: title ?? postObj.title
            }
        })
        return {
            errors: [],
            post: result
        }
    },
    postDelete: async (
        _: any,
        {postId} : PostIdInputType,
        { prisma, userId }: Context
    ): Promise<PostOutputType> => {
        if (!userId) {
            return {
                errors: [{message: 'You should sign in first'}],
                post: undefined
            }
        }
        if (!postId) {
            return {
                errors: [{message: 'Please provide Post ID you would like to delete'}],
                post: undefined
            }
        }
        const postObj = await prisma.post.findUnique({where: {id: +postId}})

        if (!postObj) {
            return {
                errors: [{message: `Post with id ${postId} doesnt exist`}],
                post: undefined
            }
        }
        if (+postObj.authorId !== +userId) {
            return {
                errors: [{message: `Your are not owner of the post ${postId}. You are not allowed to delete it`}],
                post: undefined
            }
        }
        const result = await prisma.post.delete({
            where: {
                id: +postId
            }
        })
        return {
            errors: [],
            post: result
        }

    },
    postPublish: async (
        _: any,
        {postId} : PostIdInputType,
        { prisma, userId }: Context
    ): Promise<PostOutputType> => {
        if (!userId) {
            return {
                errors: [{message: 'You should sign in first'}],
                post: undefined
            }
        }
        if (!postId) {
            return {
                errors: [{message: 'Please provide Post ID you would like to publish'}],
                post: undefined
            }
        }
        const postObj = await prisma.post.findUnique({where: {id: +postId}})

        if (!postObj) {
            return {
                errors: [{message: `Post with id ${postId} doesnt exist`}],
                post: undefined
            }
        }
        if (+postObj.authorId !== +userId) {
            return {
                errors: [{message: `Your are not owner of the post ${postId}. You are not allowed to publish it`}],
                post: undefined
            }
        }
        const result = await prisma.post.update({
            where: {
                id: +postId
            },
            data: {
                ...postObj,
                published: true
            }
        })
        return {
            errors: [],
            post: result
        }

    },
    postUnpublish: async (
        _: any,
        {postId} : PostIdInputType,
        { prisma, userId }: Context
    ): Promise<PostOutputType> => {
        if (!userId) {
            return {
                errors: [{message: 'You should sign in first'}],
                post: undefined
            }
        }
        if (!postId) {
            return {
                errors: [{message: 'Please provide Post ID you would like to unpublish'}],
                post: undefined
            }
        }
        const postObj = await prisma.post.findUnique({where: {id: +postId}})

        if (!postObj) {
            return {
                errors: [{message: `Post with id ${postId} doesnt exist`}],
                post: undefined
            }
        }
        if (+postObj.authorId !== +userId) {
            return {
                errors: [{message: `Your are not owner of the post ${postId}. You are not allowed to unpublish it`}],
                post: undefined
            }
        }
        const result = await prisma.post.update({
            where: {
                id: +postId
            },
            data: {
                ...postObj,
                published: false
            }
        })
        return {
            errors: [],
            post: result
        }

    }
}
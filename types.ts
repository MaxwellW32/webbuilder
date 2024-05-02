import { z } from "zod";

const collectionSchema = z.object({
    relativePath: z.string().min(1),
    content: z.string().min(1),
})
export type collection = z.infer<typeof collectionSchema>

const layoutSchema = z.object({
    mainFileName: z.string().min(1),
    collection: z.array(collectionSchema),
})
export type layout = z.infer<typeof layoutSchema>




export const userComponentSchema = z.object({
    id: z.string().min(1),
    userId: z.number(),
    categoryId: z.number(),
    name: z.string().min(1),
    likes: z.number(),
    saves: z.number(),
    currentLayout: layoutSchema.nullable(),
    nextLayout: layoutSchema.nullable()
})
export type userComponent = z.infer<typeof userComponentSchema> & {
    fromUser?: user,
    fromCategory?: category,
    comments?: comment[]
}

export const newComponentSchema = userComponentSchema.omit({ likes: true, saves: true, currentLayout: true })
export type newComponent = z.infer<typeof newComponentSchema>









export const usersSchema = z.object({
    id: z.number(),
    name: z.string().min(1),
    username: z.string().min(1),
})
export type user = z.infer<typeof usersSchema> & {
    componentsAdded?: userComponent[],
    usersToLikedComments?: usersToLikedComments[]
}

export const newUserSchema = usersSchema.omit({ id: true })
export type newUser = z.infer<typeof newUserSchema>








export const categoriesSchema = z.object({
    id: z.number(),
    name: z.string().min(1),
})
export type category = z.infer<typeof categoriesSchema> & {
    components?: userComponent[]
}

export const newCategoriesSchema = categoriesSchema.omit({ id: true })
export type newCategory = z.infer<typeof newCategoriesSchema>











export const commentsSchema = z.object({
    id: z.number(),
    userId: z.number(),
    componentId: z.string().min(1),
    likes: z.number(),
    datePosted: z.date(),
    message: z.string().min(1),
})
export type comment = z.infer<typeof commentsSchema> & {
    fromUser?: user,
    fromComponent?: userComponent,
    usersToLikedComments?: usersToLikedComments[]
}

export const newCommentsSchema = commentsSchema.omit({ id: true, likes: true })
export type newComment = z.infer<typeof newCommentsSchema>











export const usersToLikedCommentsSchema = z.object({
    userId: z.number(),
    commentId: z.number(),
})
export type usersToLikedComments = z.infer<typeof usersToLikedCommentsSchema> & {
    user?: user,
    comment?: comment,
}















import { z } from "zod";

export type fileType = { [key: string]: string }//page.tsx -- content: function(){}
export type folderType = {
    folderName: string,
    children: (folderType | fileType)[]
}
export type layout = {
    mainFile: string, //which component to load in program - page.tsx
    collection: (fileType | folderType)[]
}

const firstLayout: layout = {
    mainFile: "page.tsx",
    collection: [
        { "page.tsx": "function(){return (<div>hey there</div>)}" },
        { "page.module.css": ".header{color: pink}" },
        {
            folderName: "folder",
            children: [
                { "page.module.css": ".header{color: pink}" }
            ]
        },
    ]
}

export const componentSchema = z.object({
    id: z.string().min(1),
    userId: z.number(),
    categoryId: z.number(),
    name: z.string().min(1),
    likes: z.number(),
    saves: z.number(),

    currentLayout: z.object({
        mainFile: z.string().min(1),
        collection: z.array(z.any()).nullable(),
    }),
    nextLayout: z.object({
        mainFile: z.string().min(1),
        collection: z.array(z.any()).nullable(),
    })
})
export type component = Omit<z.infer<typeof componentSchema>, "currentLayout" | "nextLayout"> & {
    currentLayout: layout | null;
    nextLayout: layout | null;

    fromUser?: user,
    fromCategory?: category,
    comments?: comment[]
}

export const newComponentSchema = componentSchema.omit({ id: true, likes: true, saves: true })
export type newComponent = Omit<z.infer<typeof newComponentSchema>, "currentLayout" | "nextLayout"> & {
    currentLayout: layout | null;
    nextLayout: layout | null;
}









export const usersSchema = z.object({
    id: z.number(),
    name: z.string().min(1),
    username: z.string().min(1),
})
export type user = z.infer<typeof usersSchema> & {
    componentsAdded?: component[],
    usersToLikedComments?: usersToLikedComments[]
}

export const newUserSchema = usersSchema.omit({ id: true })
export type newUser = z.infer<typeof newUserSchema>








export const categoriesSchema = z.object({
    id: z.number(),
    name: z.string().min(1),
})
export type category = z.infer<typeof categoriesSchema> & {
    components?: component[]
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
    fromComponent?: component,
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















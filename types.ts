import { z } from "zod";

export type builtComponent = (userComponent & { component: React.ComponentType<{}> | undefined })


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
    userId: z.string().min(1),
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
    comments?: comment[],
    userComponentsToProps?: userComponentsToProps[]
}

export const newUserComponentSchema = userComponentSchema.omit({ likes: true, saves: true, currentLayout: true })
export type newUserComponent = z.infer<typeof newUserComponentSchema>








export const propsSchema = z.object({
    id: z.number(),
    name: z.string().min(1),
    explanation: z.string().min(1),
    example: z.string().min(1),
    typeScriptDefinition: z.string().min(1),
    obj: z.record(z.any()),
})
export type prop = z.infer<typeof propsSchema> & {
    userComponentsToProps?: userComponentsToProps[]
}

export const newPropsSchema = propsSchema.omit({ id: true })
export type newProp = z.infer<typeof newPropsSchema>






export const usersSchema = z.object({
    id: z.string().min(1),
    role: z.string().min(1),
    name: z.string().min(1).nullable(),
    email: z.string().min(1),
    emailVerified: z.date().nullable(),
    image: z.string().min(1).nullable(),
    userName: z.string().min(1),
    createdAt: z.date().nullable(),
})
export type user = z.infer<typeof usersSchema> & {
    componentsAdded?: userComponent[],
    suggestions?: suggestion[],
    usersToLikedComments?: usersToLikedComments[],
}

export const newUserSchema = usersSchema.omit({ emailVerified: true, image: true, createdAt: true, role: true })
export type newUser = z.infer<typeof newUserSchema>








export const categoriesSchema = z.object({
    id: z.number(),
    name: z.string().min(1),
    order: z.number(),
})
export type category = z.infer<typeof categoriesSchema> & {
    components?: userComponent[]
}

export const newCategoriesSchema = categoriesSchema.omit({ id: true, order: true })
export type newCategory = z.infer<typeof newCategoriesSchema>











export const commentsSchema = z.object({
    id: z.number(),
    userId: z.string().min(1),
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







export const suggestionTypeSchema = z.enum(["category", "prop"])
export type suggestionType = z.infer<typeof suggestionTypeSchema>


export const suggestionsSchema = z.object({
    id: z.number(),
    userId: z.string().min(1),
    type: suggestionTypeSchema,
    suggestion: z.string().min(1),
    accepted: z.boolean(),
    datePosted: z.date(),
})
export type suggestion = z.infer<typeof suggestionsSchema> & {
    fromUser?: user,
}

export const newSuggestionsSchema = suggestionsSchema.omit({ id: true, accepted: true, datePosted: true })
export type newSuggestion = z.infer<typeof newSuggestionsSchema>







export const usersToLikedCommentsSchema = z.object({
    userId: z.string().min(1),
    commentId: z.number(),
})
export type usersToLikedComments = z.infer<typeof usersToLikedCommentsSchema> & {
    user?: user,
    comment?: comment,
}







// {
//     userComponentId: string;
//     propId: number;
// }



export const userComponentsToPropsSchema = z.object({
    userComponentId: z.string().min(1),
    propId: z.number(),
    upToDate: z.boolean()
})
export type userComponentsToProps = z.infer<typeof userComponentsToPropsSchema> & {
    userComponent?: userComponent,
    prop?: prop,
}






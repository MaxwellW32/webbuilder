import { fileType, folderType } from "@/types";
import { relations } from "drizzle-orm";
import { index, pgTable, integer, serial, text, varchar, jsonb, date, primaryKey, } from "drizzle-orm/pg-core";
// type seenType = typeof usersToLikedComments.$inferSelect;

export const components = pgTable("components", {
    id: varchar("id", { length: 255 }).notNull().primaryKey(), //will be the folder name on the server
    userId: serial("userId").notNull().references(() => users.id),
    cetegoryId: serial("cetegoryId").notNull().references(() => categories.id),
    name: varchar("name", { length: 255 }).notNull(), //helps custom foldernames when devs download components
    likes: integer("likes").notNull().default(0),
    saves: integer("saves").notNull().default(0),

    currentLayout: jsonb("currentLayout").$type<{
        mainFile: string,
        collection: (fileType | folderType)[]
    }>(),
    nextLayout: jsonb("nextLayout").$type<{
        mainFile: string,
        collection: (fileType | folderType)[]
    }>(),
},
    (table) => {
        return {
            nextLayoutIndex: index("nextLayoutIndex").on(table.nextLayout),
            currentLayoutIndex: index("currentLayoutIndex").on(table.currentLayout),
        };
    })
export const componentsRelations = relations(components, ({ many, one }) => ({
    fromUser: one(users, {
        fields: [components.userId],
        references: [users.id]
    }),
    fromCategory: one(categories, {
        fields: [components.cetegoryId],
        references: [categories.id]
    }),
    comments: many(comments)
}));









export const users = pgTable("users", {
    id: serial("id").notNull().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    userName: varchar("userName", { length: 255 }).notNull().unique(),
},
    (table) => {
        return {
            userNameIndex: index("userNameIndex").on(table.userName),
        };
    })
export const usersRelations = relations(users, ({ many }) => ({
    componentsAdded: many(components),
    usersToLikedComments: many(usersToLikedComments),
}));







export const categories = pgTable("categories", {
    id: serial("id").notNull().primaryKey(),
    name: varchar("name", { length: 255 }).notNull().unique(),
},
    (table) => {
        return {
            categoryNameIndex: index("categoryNameIndex").on(table.name),
        };
    })
export const categoriesRelations = relations(categories, ({ many, one }) => ({
    components: many(components)
}));








export const comments = pgTable("comments", {
    id: serial("id").notNull().primaryKey(),
    userId: serial("userId").notNull().references(() => users.id),
    componentId: varchar("componentId", { length: 255 }).notNull().references(() => components.id),
    datePosted: date('datePosted', { mode: "date" }).notNull().defaultNow(),
    message: varchar("message", { length: 255 }).notNull(),
    likes: integer("likes").notNull().default(0),
},
    (table) => {
        return {
            componentIdIndex: index("componentIdIndex").on(table.componentId),
            componentLikesIndex: index("componentLikesIndex").on(table.likes),
        }
    });
export const commentsRelations = relations(comments, ({ one, many }) => ({
    fromUser: one(users, {
        fields: [comments.userId],
        references: [users.id],
    }),
    fromComponent: one(components, {
        fields: [comments.componentId],
        references: [components.id],
    }),
    usersToLikedComments: many(usersToLikedComments),
}));



















export const usersToLikedComments = pgTable('usersToLikedComments', {
    userId: serial('userId').notNull().references(() => users.id),
    commentId: serial('commentId').notNull().references(() => comments.id),
}, (t) => ({
    pk: primaryKey({ columns: [t.userId, t.commentId] }),
}),
);
export const usersToLikedCommentsRelations = relations(usersToLikedComments, ({ one }) => ({
    user: one(users, {
        fields: [usersToLikedComments.userId],
        references: [users.id],
    }),
    comment: one(comments, {
        fields: [usersToLikedComments.commentId],
        references: [comments.id],
    }),
}));










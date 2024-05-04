import { collection, layout } from "@/types";
import { relations } from "drizzle-orm";
import { index, pgTable, integer, serial, text, varchar, jsonb, date, primaryKey, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { AdapterAccount } from "next-auth/adapters";
// type seenType = typeof users.$inferSelect;

export const userComponents = pgTable("userComponents", {
    id: varchar("id", { length: 255 }).notNull().primaryKey(), //will be the folder name on the server
    userId: varchar("userId", { length: 255 }).notNull().references(() => users.id),
    categoryId: serial("categoryId").notNull().references(() => categories.id),
    name: varchar("name", { length: 255 }).notNull(), //helps custom foldernames when devs download components
    likes: integer("likes").notNull().default(0),
    saves: integer("saves").notNull().default(0),
    currentLayout: jsonb("currentLayout").$type<layout>(),
    nextLayout: jsonb("nextLayout").$type<layout>(),
},
    (table) => {
        return {
            nextLayoutIndex: index("nextLayoutIndex").on(table.nextLayout),
            currentLayoutIndex: index("currentLayoutIndex").on(table.currentLayout),
            categoryIdIndex: index("categoryIdIndex").on(table.categoryId),
        };
    })
export const componentsRelations = relations(userComponents, ({ many, one }) => ({
    fromUser: one(users, {
        fields: [userComponents.userId],
        references: [users.id]
    }),
    fromCategory: one(categories, {
        fields: [userComponents.categoryId],
        references: [categories.id]
    }),
    comments: many(comments),
    userComponentsToProps: many(userComponentsToProps),
}));










export const props = pgTable("props", {
    id: serial("id").notNull().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(), //helps custom foldernames when devs download components
    explanation: text("explanation").notNull(),
    example: text("example").notNull(),
    typeScriptDefinition: text("typeScriptDefinition").notNull(),
    obj: jsonb("obj").$type<{ [key: string]: any }>().notNull().default({}),
},
    (table) => {
        return {
            propsNameIndex: index("propsNameIndex").on(table.name),
        };
    })
export const propsRelations = relations(props, ({ many }) => ({
    userComponentsToProps: many(userComponentsToProps),
}));












export const users = pgTable("users", {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }),
    email: text("email").notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    userName: varchar("userName", { length: 255 }).notNull().unique(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    role: varchar("role", { length: 255 }).notNull().default("normal"),
},
    (table) => {
        return {
            userNameIndex: index("userNameIndex").on(table.userName),
            userIdIndex: index("userIdIndex").on(table.id),
        };
    })
export const usersRelations = relations(users, ({ many }) => ({
    componentsAdded: many(userComponents),
    suggestions: many(suggestions),
    usersToLikedComments: many(usersToLikedComments),
}));

export const accounts = pgTable("accounts",
    {
        userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccount["type"]>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
    })
)

export const sessions = pgTable("sessions", {
    sessionToken: text("sessionToken").notNull().primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable("verificationTokens",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
    })
)












export const categories = pgTable("categories", {
    id: serial("id").notNull().primaryKey(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    order: integer("order").notNull().default(0),
},
    (table) => {
        return {
            categoryNameIndex: index("categoryNameIndex").on(table.name),
        };
    })
export const categoriesRelations = relations(categories, ({ many, one }) => ({
    components: many(userComponents)
}));






export const suggestionsTypeEnum = pgEnum('type', ['category', "prop"]);

export const suggestions = pgTable("suggestions", {
    id: serial("id").notNull().primaryKey(),
    type: suggestionsTypeEnum("type").notNull(),
    suggestion: varchar("suggestion", { length: 255 }).notNull(),
    userId: varchar("userId", { length: 255 }).notNull().references(() => users.id),
    accepted: boolean("accepted").notNull().default(false),
    datePosted: date('datePosted', { mode: "date" }).notNull().defaultNow(),
},
    (table) => {
        return {
        };
    })
export const suggestionsRelations = relations(suggestions, ({ one }) => ({
    fromUser: one(users, {
        fields: [suggestions.userId],
        references: [users.id]
    }),
}));











export const comments = pgTable("comments", {
    id: serial("id").notNull().primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull().references(() => users.id),
    componentId: varchar("componentId", { length: 255 }).notNull().references(() => userComponents.id),
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
    fromComponent: one(userComponents, {
        fields: [comments.componentId],
        references: [userComponents.id],
    }),
    usersToLikedComments: many(usersToLikedComments),
}));



















export const usersToLikedComments = pgTable('usersToLikedComments', {
    userId: varchar("userId", { length: 255 }).notNull().references(() => users.id),
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











export const userComponentsToProps = pgTable('userComponentsToProps', {
    userComponentId: varchar("userComponentId", { length: 255 }).notNull().references(() => userComponents.id),
    propId: serial('propId').notNull().references(() => props.id),
    upToDate: boolean("upToDate").notNull().default(true),
}, (t) => ({
    pk: primaryKey({ columns: [t.userComponentId, t.propId] }),
}),
);
export const userComponentsToPropsRelations = relations(userComponentsToProps, ({ one }) => ({
    userComponent: one(userComponents, {
        fields: [userComponentsToProps.userComponentId],
        references: [userComponents.id],
    }),
    prop: one(props, {
        fields: [userComponentsToProps.propId],
        references: [props.id],
    }),
}));







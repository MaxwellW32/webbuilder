import { relations } from "drizzle-orm";
import { index, pgTable, primaryKey, integer, serial, text, varchar, } from "drizzle-orm/pg-core";

export const tests = pgTable("tests", {
    id: serial("id").notNull().primaryKey(),
    text: text("text").notNull()
},
    (table) => {
        return {
        };
    })
export const foodsRelations = relations(tests, ({ many }) => ({
}));


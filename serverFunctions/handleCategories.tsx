"use server"
import { db } from "@/db";
import { eq, ilike, and } from "drizzle-orm";


import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { category, newCategoriesSchema, newCategory } from "@/types";
import { categories } from "@/db/schema";

export async function addCategory(category: newCategory) {
    const session = await getServerSession(authOptions)
    if (!session) throw new Error("not signed in")

    newCategoriesSchema.parse(category)

    await db.insert(categories).values(category);
}

export async function getCategories(seenLimit = 50, seenOffset = 0): Promise<category[]> {
    const results = await db.query.categories.findMany({
        limit: seenLimit,
        offset: seenOffset,
    });

    return results
}

export async function getSpecificCategory(infoObj: { usingId: true, search: number } | { usingId: false, search: string }): Promise<category[]> {
    if (infoObj.usingId) {//search by id
        const results = await db.query.categories.findMany({
            where: eq(categories.id, infoObj.search)
        });

        return results
    } else {//search by name
        const results = await db.query.categories.findMany({
            where: ilike(categories.name, `%${infoObj.search.toLowerCase()}%`)
        });

        return results
    }
}

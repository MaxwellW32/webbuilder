"use server"
import { db } from "@/db";
import { eq, ilike, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { newTheme, newThemeSchema, theme, themesSchema } from "@/types";
import { themes } from "@/db/schema";

export async function addTheme(newTheme: newTheme) {
    const session = await getServerSession(authOptions)
    if (!session) throw new Error("not signed in")

    newThemeSchema.parse(newTheme)

    await db.insert(themes).values(newTheme);
}

export async function getThemes(seenLimit = 50, seenOffset = 0): Promise<theme[]> {
    const results = await db.query.themes.findMany({
        limit: seenLimit,
        offset: seenOffset,
    });

    return results
}

export async function getSpecificTheme(infoObj: { usingId: true, search: number } | { usingId: false, search: string }): Promise<theme[]> {
    if (infoObj.usingId) {//search by id
        const results = await db.query.themes.findMany({
            where: eq(themes.id, infoObj.search)
        });

        return results
    } else {//search by name
        const results = await db.query.themes.findMany({
            where: ilike(themes.name, `%${infoObj.search.toLowerCase()}%`)
        });

        return results
    }
}


export async function updateTheme(newTheme: theme) {

    themesSchema.parse(newTheme)

    await db.update(themes)
        .set(newTheme)
        .where(eq(themes.id, newTheme.id));
}

export async function deleteTheme(themeId: Pick<theme, "id">) {

    themesSchema.pick({ id: true }).parse(themeId)

    await db.delete(themes).where(eq(themes.id, themeId.id));
}
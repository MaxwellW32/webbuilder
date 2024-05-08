"use server"
import { db } from "@/db";
import { eq, ilike, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { theme, themesSchema, userComponent, userComponentSchema, userComponentsToTheme } from "@/types";
import { userComponentsToThemes } from "@/db/schema";

export async function addThemeToUserComponent(themeId: Pick<theme, "id">, userComponentId: Pick<userComponent, "id">) {
    const session = await getServerSession(authOptions)
    if (!session) throw new Error("not signed in")

    themesSchema.pick({ id: true }).parse(themeId)
    userComponentSchema.pick({ id: true }).parse(userComponentId)

    await db.insert(userComponentsToThemes).values({
        userComponentId: userComponentId.id,
        themeId: themeId.id
    });
}

export async function removeThemeFromUserComponent(themeId: Pick<theme, "id">, userComponentId: Pick<userComponent, "id">) {
    const session = await getServerSession(authOptions)
    if (!session) throw new Error("not signed in")

    themesSchema.pick({ id: true }).parse(themeId)
    userComponentSchema.pick({ id: true }).parse(userComponentId)

    await db.delete(userComponentsToThemes).where(and(eq(userComponentsToThemes.themeId, themeId.id), eq(userComponentsToThemes.userComponentId, userComponentId.id)));
}

export async function getThemesFromUserComponent(userComponentId: Pick<userComponent, "id">): Promise<userComponentsToTheme[]> {
    userComponentSchema.pick({ id: true }).parse(userComponentId)

    const results = await db.query.userComponentsToThemes.findMany({
        where: eq(userComponentsToThemes.userComponentId, userComponentId.id),
        with: {
            theme: true
        }
    })

    return results
}

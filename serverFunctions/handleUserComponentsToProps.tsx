"use server"
import { db } from "@/db";
import { eq, ilike, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prop, propsSchema, userComponent, userComponentSchema } from "@/types";
import { userComponentsToProps } from "@/db/schema";

export async function addPropToUserComponent(propId: Pick<prop, "id">, userComponentId: Pick<userComponent, "id">) {
    const session = await getServerSession(authOptions)
    if (!session) throw new Error("not signed in")

    propsSchema.pick({ id: true }).parse(propId)
    userComponentSchema.pick({ id: true }).parse(userComponentId)

    await db.insert(userComponentsToProps).values({
        userComponentId: userComponentId.id,
        propId: propId.id
    });
}

export async function removePropFromUserComponent(propId: Pick<prop, "id">, userComponentId: Pick<userComponent, "id">) {
    const session = await getServerSession(authOptions)
    if (!session) throw new Error("not signed in")

    propsSchema.pick({ id: true }).parse(propId)
    userComponentSchema.pick({ id: true }).parse(userComponentId)

    await db.delete(userComponentsToProps).where(and(eq(userComponentsToProps.propId, propId.id), eq(userComponentsToProps.userComponentId, userComponentId.id)));
}


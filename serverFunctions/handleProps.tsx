"use server"
import { db } from "@/db";
import { eq, ilike, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { newProp, newPropsSchema, prop, propsSchema } from "@/types";
import { props } from "@/db/schema";

//remedy when users working
export async function addProp(newProp: newProp) {
    const session = await getServerSession(authOptions)
    if (!session) throw new Error("not signed in")

    newPropsSchema.parse(newProp)

    await db.insert(props).values(newProp);
}

export async function getProps(seenLimit = 50, seenOffset = 0): Promise<prop[]> {
    const results = await db.query.props.findMany({
        limit: seenLimit,
        offset: seenOffset,
    });

    return results
}

export async function updateProp(newProp: prop) {

    propsSchema.parse(newProp)

    await db.update(props)
        .set(newProp)
        .where(eq(props.id, newProp.id));
}

export async function deleteProp(propId: Pick<prop, "id">) {

    propsSchema.pick({ id: true }).parse(propId)

    await db.delete(props).where(eq(props.id, propId.id));
}
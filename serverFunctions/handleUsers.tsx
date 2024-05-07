"use server"

import { users } from "@/db/schema"
import { eq, like } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/types";

export async function getSpecificUser(seenStr: string, option: "id" | "username"): Promise<user | undefined> {
    if (option === "id") {
        const user = await db.query.users.findFirst({
            where: eq(users.id, seenStr),
        });

        return user

    } else if (option === "username") {
        const user = await db.query.users.findFirst({
            where: like(users.userName, `%${seenStr}%`),
        });

        return user
    }
}

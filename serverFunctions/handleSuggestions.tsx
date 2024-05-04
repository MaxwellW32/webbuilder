"use server"
import { db } from "@/db";
import { eq, ilike, and } from "drizzle-orm";


import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { newSuggestion, newSuggestionsSchema, suggestion, suggestionsSchema } from "@/types";
import { suggestions } from "@/db/schema";

//remedy when users working
export async function addSuggestion(newSuggestion: newSuggestion) {
    const session = await getServerSession(authOptions)
    if (!session) throw new Error("not signed in")

    const finalNewSuggestion = {//ensure proper user id passed
        ...newSuggestion,
        userId: session.user.id,
    }

    newSuggestionsSchema.parse(finalNewSuggestion)

    await db.insert(suggestions).values(finalNewSuggestion);
}

export async function getSuggestions(seenLimit = 50, seenOffset = 0): Promise<suggestion[]> {
    const results = await db.query.suggestions.findMany({
        limit: seenLimit,
        offset: seenOffset,
    });

    return results
}

export async function deleteSuggestion(suggesionId: Pick<suggestion, "id">) {
    suggestionsSchema.pick({ id: true }).parse(suggesionId)

    await db.delete(suggestions).where(eq(suggestions.id, suggesionId.id));
}
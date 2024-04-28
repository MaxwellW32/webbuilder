"use server"

export async function testServerFunction<T>(inputObj: T) {
    console.log(`$seeing in server function`, JSON.stringify(inputObj));
}

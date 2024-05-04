import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const config = {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
    GITHUB_ID: process.env.GITHUB_ID!,
    GITHUB_SECRET: process.env.GITHUB_SECRET!,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
}

export default config
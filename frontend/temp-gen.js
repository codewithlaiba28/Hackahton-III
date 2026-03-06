const { betterAuth } = require("better-auth");
const { Pool } = require("pg");

const auth = betterAuth({
    database: new Pool({
        connectionString: "postgresql://localhost:5432/dummy"
    }),
    emailAndPassword: {
        enabled: true
    }
});

async function main() {
    const { generateSchema } = require("better-auth/cli");
    // Better Auth might not export generateSchema this way in newer versions.
    // Let's try to just get the tables.
}

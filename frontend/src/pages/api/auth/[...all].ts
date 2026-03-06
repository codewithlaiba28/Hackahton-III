import { toNodeHandler } from "better-auth/node";
import { auth } from "@/lib/auth";

// Disable body parsing — Better Auth handles it internally
export const config = { api: { bodyParser: false } };

export default toNodeHandler(auth.handler);

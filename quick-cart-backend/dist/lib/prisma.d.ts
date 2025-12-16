import { PrismaClient } from "@prisma/client";
declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
/**
 * Graceful shutdown helper for cleanup
 * Call this when the serverless function is done
 */
export declare function disconnectPrisma(): Promise<void>;
export default prisma;
//# sourceMappingURL=prisma.d.ts.map
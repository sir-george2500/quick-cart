declare class TokenBlacklist {
    private blacklist;
    private expiryTimes;
    add(token: string, expiresInMs: number): void;
    has(token: string): boolean;
    private cleanup;
}
export declare const tokenBlacklist: TokenBlacklist;
export {};
//# sourceMappingURL=token-blacklist.service.d.ts.map
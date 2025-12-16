// Simple in-memory token blacklist (use Redis in production)
class TokenBlacklist {
    blacklist = new Set();
    expiryTimes = new Map();
    add(token, expiresInMs) {
        this.blacklist.add(token);
        this.expiryTimes.set(token, Date.now() + expiresInMs);
        // Clean up expired tokens periodically
        this.cleanup();
    }
    has(token) {
        const expiryTime = this.expiryTimes.get(token);
        if (expiryTime && Date.now() > expiryTime) {
            this.blacklist.delete(token);
            this.expiryTimes.delete(token);
            return false;
        }
        return this.blacklist.has(token);
    }
    cleanup() {
        const now = Date.now();
        for (const [token, expiryTime] of this.expiryTimes.entries()) {
            if (now > expiryTime) {
                this.blacklist.delete(token);
                this.expiryTimes.delete(token);
            }
        }
    }
}
export const tokenBlacklist = new TokenBlacklist();
//# sourceMappingURL=token-blacklist.service.js.map
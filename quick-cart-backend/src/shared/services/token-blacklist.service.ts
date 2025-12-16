// Simple in-memory token blacklist (use Redis in production)
class TokenBlacklist {
  private blacklist: Set<string> = new Set();
  private expiryTimes: Map<string, number> = new Map();

  add(token: string, expiresInMs: number): void {
    this.blacklist.add(token);
    this.expiryTimes.set(token, Date.now() + expiresInMs);

    // Clean up expired tokens periodically
    this.cleanup();
  }

  has(token: string): boolean {
    const expiryTime = this.expiryTimes.get(token);
    if (expiryTime && Date.now() > expiryTime) {
      this.blacklist.delete(token);
      this.expiryTimes.delete(token);
      return false;
    }
    return this.blacklist.has(token);
  }

  private cleanup(): void {
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

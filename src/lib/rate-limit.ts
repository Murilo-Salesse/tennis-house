type RateLimitEntry = {
  count: number;
  lastRequest: number;
};

const rateLimitMap = new Map<string, RateLimitEntry>();

export function rateLimit(ip: string, limit: number = 5, windowMs: number = 60 * 1000) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, { count: 1, lastRequest: now });
    return { success: true, remaining: limit - 1 };
  }

  // Se passou o tempo da janela, reseta o contador
  if (now - entry.lastRequest > windowMs) {
    entry.count = 1;
    entry.lastRequest = now;
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count += 1;
  return { success: true, remaining: limit - entry.count };
}

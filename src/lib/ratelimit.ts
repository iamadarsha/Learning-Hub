import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

// General API rate limit: 20 requests per 10 seconds per user
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "10s"),
  analytics: true,
  prefix: "hyvmind:ratelimit",
});

// Submit rate limit: 5 submissions per hour
export const submitRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60m"),
  analytics: true,
  prefix: "hyvmind:submit",
});

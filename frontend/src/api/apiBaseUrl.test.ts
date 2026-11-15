import { describe, expect, it } from "vitest";
import { resolveApiBaseUrl } from "./apiBaseUrl";

describe("resolveApiBaseUrl", () => {
  it("falls back to /api in development", () => {
    expect(resolveApiBaseUrl(undefined, false)).toBe("/api");
    expect(resolveApiBaseUrl("  ", false)).toBe("/api");
  });

  it("requires explicit configuration in production", () => {
    expect(() => resolveApiBaseUrl(undefined, true)).toThrow(/must be configured/);
    expect(() => resolveApiBaseUrl("", true)).toThrow(/must be configured/);
  });

  it("accepts the same-origin /api path for the on-premise installer", () => {
    expect(resolveApiBaseUrl("/api", true)).toBe("/api");
    expect(resolveApiBaseUrl("/api/", true)).toBe("/api");
  });

  it("rejects other same-origin or protocol-relative paths in production", () => {
    expect(() => resolveApiBaseUrl("/other", true)).toThrow();
    expect(() => resolveApiBaseUrl("//evil.example/api", true)).toThrow();
  });

  it("accepts an absolute HTTPS API URL for cloud", () => {
    expect(resolveApiBaseUrl("https://api.example.com/api", true)).toBe(
      "https://api.example.com/api"
    );
  });

  it("rejects insecure, malformed or wrongly-pathed absolute URLs in production", () => {
    expect(() => resolveApiBaseUrl("http://api.example.com/api", true)).toThrow(/HTTPS/);
    expect(() => resolveApiBaseUrl("https://api.example.com/v1", true)).toThrow();
    expect(() => resolveApiBaseUrl("https://api.example.com/api?x=1", true)).toThrow();
    expect(() => resolveApiBaseUrl("not a url", true)).toThrow();
  });
});

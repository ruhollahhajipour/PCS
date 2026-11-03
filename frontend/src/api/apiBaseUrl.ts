/**
 * Resolves the API base URL for the current build.
 *
 * - Development: VITE_API_URL if set, otherwise the same-origin "/api" proxy.
 * - Production must be explicit, so a Vercel build can never silently call itself:
 *   - "/api"  : same-origin. Used by the Windows on-premise installer, where
 *               PCS.API serves the SPA and the API from one origin (HTTP or HTTPS).
 *   - absolute HTTPS URL ending in "/api": used by the cloud deployment.
 */
export function resolveApiBaseUrl(
  configured: string | undefined,
  isProduction: boolean
): string {
  const value = configured?.trim();

  if (!value) {
    if (isProduction) {
      throw new Error(
        "VITE_API_URL must be configured for production builds. " +
          "Use /api for the on-premise installer or an absolute HTTPS URL ending in /api for cloud."
      );
    }

    return "/api";
  }

  if (!isProduction) {
    return value;
  }

  // Same-origin path (on-premise). Protocol-relative "//host/api" is rejected.
  if (value.startsWith("/") && !value.startsWith("//")) {
    if (value.replace(/\/+$/, "") !== "/api") {
      throw new Error(
        "A same-origin VITE_API_URL must be exactly /api."
      );
    }

    return "/api";
  }

  let parsed: URL;

  try {
    parsed = new URL(value);
  }
  catch {
    throw new Error(
      "VITE_API_URL must be /api or an absolute HTTPS URL ending in /api."
    );
  }

  if (
    parsed.protocol !== "https:" ||
    parsed.pathname.replace(/\/+$/, "") !== "/api" ||
    parsed.search ||
    parsed.hash
  ) {
    throw new Error(
      "VITE_API_URL must use HTTPS and point exactly to the API base path ending in /api."
    );
  }

  return value;
}

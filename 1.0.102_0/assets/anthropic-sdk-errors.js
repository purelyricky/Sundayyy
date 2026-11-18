/**
 * @readable-header
 * FILE:      assets/anthropic-sdk-errors.js
 * WAS:       error-C8zE-wHo.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Anthropic TypeScript SDK (version not determined)
 * WHAT:      Error classes of the bundled Anthropic API client SDK (APIError subclasses per HTTP status, abort and connection errors).
 * WHY:       Shared error layer for the bundled API client.
 * USED BY:   assets/anthropic-sdk-agent-toolset-browser-stub.js (static import)
 *            assets/anthropic-sdk-node-browser-fs-path-stub.js (static import)
 *            assets/browser-tools-and-permissions.js (static import)
 *            assets/mermaid-core.js (named in code (e.g. lazy-load list))
 *            assets/sidepanel.js (static import)
 *            sidepanel.html (html tag)
 * NEEDS:     none
 * EXPORTS:   a, c, d, f, g, h, i, l, m, n, o, p, r, s, t, u  (export names are unchanged from the original; other files import them by these names)
 */
/**
 * error (shared module): error classes and helpers
 *
 * This is the error layer of the bundled Anthropic API client SDK:
 *   - isAbortError(value)   was this error caused by an aborted/cancelled request?
 *   - toError(value)        coerce anything thrown into a real Error
 *   - AnthropicError        base class
 *   - APIError              an HTTP error response (status, headers, body,
 *                           request-id); APIError.generate() picks the subclass
 *                           from the status code (400, 401, 403, 404, 409, 422,
 *                           429, >=500)
 *   - APIUserAbortError, APIConnectionError, APIConnectionTimeoutError,
 *     RetryableError, and one subclass per HTTP status
 *
 * Pure class definitions: it makes no requests, sends no messages and touches
 * no page. (It only *reads* response headers "request-id" and
 * "anthropic-workspace-id" off a response object handed to it, to put them on
 * the error.)
 *
 * Export names (a, c, d, f, g, h, ...) are the short names the other bundled
 * chunks import; the export map at the bottom shows what each one is.
 */

/** True if the error looks like an aborted fetch (AbortError / FetchRequestCanceledException). */
function isAbortError(error) {
  return (
    "object" == typeof error &&
    null !== error &&
    (("name" in error && "AbortError" === error.name) ||
      ("message" in error &&
        String(error.message).includes("FetchRequestCanceledException")))
  );
}
var toError = (value) => {
    if (value instanceof Error) return value;
    if ("object" == typeof value && null !== value) {
      try {
        // Error-like objects from another realm (e.g. a DOMException).
        const tag = Object.prototype.toString.call(value);
        if ("[object Error]" === tag || "[object DOMException]" === tag) {
          const error = new Error(
            value.message,
            value.cause ? { cause: value.cause } : {},
          );
          return (
            value.stack && (error.stack = value.stack),
            value.cause && !error.cause && (error.cause = value.cause),
            value.name && (error.name = value.name),
            error
          );
        }
      } catch {}
      try {
        return new Error(JSON.stringify(value));
      } catch {}
    }
    return new Error(value);
  },
  AnthropicError = (() => {
    class AnthropicError extends Error {}
    return AnthropicError;
  })(),
  APIError = class APIError extends AnthropicError {
    constructor(status, error, message, headers, type) {
      super(`${APIError.makeMessage(status, error, message)}`),
        (this.status = status),
        (this.headers = headers),
        (this.requestID = headers?.get("request-id")),
        (this.workspaceID = headers?.get("anthropic-workspace-id")),
        (this.error = error),
        (this.type = type ?? null);
    }
    static makeMessage(status, error, fallbackMessage) {
      const message = error?.message
        ? "string" == typeof error.message
          ? error.message
          : JSON.stringify(error.message)
        : error
          ? JSON.stringify(error)
          : fallbackMessage;
      return status && message
        ? `${status} ${message}`
        : status
          ? `${status} status code (no body)`
          : message || "(no status code or body)";
    }
    /** Builds the right APIError subclass for an HTTP status code. */
    static generate(status, errorBody, message, headers) {
      if (!status || !headers)
        return new APIConnectionError({
          message: message,
          cause: toError(errorBody),
        });
      const body = errorBody,
        type = body?.error?.type;
      return 400 === status
        ? new BadRequestError(status, body, message, headers, type)
        : 401 === status
          ? new AuthenticationError(status, body, message, headers, type)
          : 403 === status
            ? new PermissionDeniedError(status, body, message, headers, type)
            : 404 === status
              ? new NotFoundError(status, body, message, headers, type)
              : 409 === status
                ? new ConflictError(status, body, message, headers, type)
                : 422 === status
                  ? new UnprocessableEntityError(
                      status,
                      body,
                      message,
                      headers,
                      type,
                    )
                  : 429 === status
                    ? new RateLimitError(status, body, message, headers, type)
                    : status >= 500
                      ? new InternalServerError(
                          status,
                          body,
                          message,
                          headers,
                          type,
                        )
                      : new APIError(status, body, message, headers, type);
    }
  },
  APIUserAbortError = class extends APIError {
    constructor({ message } = {}) {
      super(void 0, void 0, message || "Request was aborted.", void 0);
    }
  },
  APIConnectionError = class extends APIError {
    constructor({ message, cause }) {
      super(void 0, void 0, message || "Connection error.", void 0),
        cause && (this.cause = cause);
    }
  },
  APIConnectionTimeoutError = class extends APIConnectionError {
    constructor({ message } = {}) {
      super({ message: message ?? "Request timed out." });
    }
  },
  RetryableError = class extends AnthropicError {
    constructor(message, { cause } = {}) {
      super(message ?? "Retryable error."),
        void 0 !== cause && (this.cause = cause);
    }
  },
  BadRequestError = class extends APIError {}, // 400
  AuthenticationError = class extends APIError {}, // 401
  PermissionDeniedError = class extends APIError {}, // 403
  NotFoundError = class extends APIError {}, // 404
  ConflictError = class extends APIError {}, // 409
  UnprocessableEntityError = class extends APIError {}, // 422
  RateLimitError = class extends APIError {}, // 429
  InternalServerError = class extends APIError {}; // >= 500
export {
  AnthropicError as a,
  ConflictError as c,
  PermissionDeniedError as d,
  RateLimitError as f,
  isAbortError as g,
  toError as h,
  APIUserAbortError as i,
  InternalServerError as l,
  UnprocessableEntityError as m,
  APIConnectionTimeoutError as n,
  AuthenticationError as o,
  RetryableError as p,
  APIError as r,
  BadRequestError as s,
  APIConnectionError as t,
  NotFoundError as u,
};

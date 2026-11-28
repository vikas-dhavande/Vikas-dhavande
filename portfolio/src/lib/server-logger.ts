import "server-only";

import { after } from "next/server";
import { SeverityNumber, type AnyValueMap } from "@opentelemetry/api-logs";
import { loggerProvider } from "@/instrumentation";

const logger = loggerProvider.getLogger("portfolio");

/**
 * Emit a structured OpenTelemetry log record and flush buffered logs after the Next.js response finishes.
 */
export function emitServerLog(
  body: string,
  severityNumber: SeverityNumber,
  attributes?: AnyValueMap,
): void {
  logger.emit({
    body,
    severityNumber,
    attributes,
  });

  try {
    after(async () => {
      await loggerProvider.forceFlush();
    });
  } catch {
    // Skip after() scheduling when called outside a Next.js request context.
  }
}

export { SeverityNumber };

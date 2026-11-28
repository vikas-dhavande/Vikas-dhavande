import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { logs } from "@opentelemetry/api-logs";
import { resourceFromAttributes } from "@opentelemetry/resources";

const posthogToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim();
const rawPosthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim();
const posthogHost =
  rawPosthogHost && /^https?:\/\//i.test(rawPosthogHost)
    ? rawPosthogHost.replace(/\/+$/, "")
    : "https://us.i.posthog.com";

// Skip exporter registration when token is missing so unconfigured builds/environments do not send invalid requests.
const processors = posthogToken
  ? [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${posthogHost}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${posthogToken}`,
            "Content-Type": "application/json",
          },
        }),
      }),
    ]
  : [];

export const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({ "service.name": "portfolio" }),
  processors,
});

export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    logs.setGlobalLoggerProvider(loggerProvider);
  }
}

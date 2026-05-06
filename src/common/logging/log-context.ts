export interface LogContext {
  readonly requestId?: string;
  readonly userId?: string;
  readonly method?: string;
  readonly url?: string;
  readonly statusCode?: number;
  readonly durationMs?: number;
  readonly resourceId?: string;
  readonly params?: Record<string, unknown>;
}


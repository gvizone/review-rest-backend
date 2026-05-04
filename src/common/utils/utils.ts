function isJsonAbsent(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item): item is string => typeof item === 'string')
  );
}

export function optionalStringFromJson(value: unknown): string | undefined {
  if (isJsonAbsent(value) || value === '') {
    return undefined;
  }
  return typeof value === 'string' ? value : undefined;
}

export function stringArrayFromJson(value: unknown): string[] | undefined {
  if (isJsonAbsent(value) || !isStringArray(value)) {
    return undefined;
  }
  return value;
}

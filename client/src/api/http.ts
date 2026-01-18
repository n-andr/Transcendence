//one helper for POST requests

export async function postJson<TResponse>(
  url: string,
  body: unknown //later try to define types here
): Promise<TResponse> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    //credentials: "include", // might be important for cookies-based auth
    body: JSON.stringify(body),
  });

  // Try to parse JSON error messages too
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.message ?? `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as TResponse;
}

//one helper for GET requests

//tba
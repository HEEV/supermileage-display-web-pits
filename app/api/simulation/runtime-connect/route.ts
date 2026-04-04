export async function POST() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/runtime_con`, {
    method: "POST",
  });

  const text = await res.text();

  if (!res.ok) {
    return new Response(text, { status: res.status });
  }

  return new Response(text, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
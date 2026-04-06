export const runtime = 'edge';

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch("https://supermileage.cedarville.edu/api/run_sim", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
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
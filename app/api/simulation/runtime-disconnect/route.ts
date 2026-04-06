export const runtime = 'edge';

export async function POST() {

  const res = await fetch(`https://supermileage.cedarville.edu/api/runtime_dis`, {
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
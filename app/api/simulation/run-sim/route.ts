export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch("http://localhost:8000/run_sim", {
    //PYTHON_API_URL=https://internal-api.myapp.com
    //PYTHON_API_URL=http://python-service:8000
    //PYTHON_API_URL=http://localhost:8000
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
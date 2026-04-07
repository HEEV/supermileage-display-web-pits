export const runtime = 'edge'

export async function POST(request: Request) {
  const body = await request.json()

  try {
    const response = await fetch('https://supermileage.cedarville.edu/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return Response.json(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (_error) {
    return Response.json(
      { error: 'Failed to reach auth server' },
      { status: 500 }
    )
  }
}

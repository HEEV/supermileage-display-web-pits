export async function runPythonTest(input: string) {
  const res = await fetch("http://localhost:8000/runShort", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input }),
  });

  const text = await res.text();

  if (!res.ok) {
    console.error("Backend error:", text);
    throw new Error(`Request failed: ${res.status}`);
  }

  return JSON.parse(text);
}

export async function pyRuntimeConnect() {
  console.log(process.env.NEXT_PUBLIC_PYTHON_API_URL);
  const res = await fetch("/../api/simulation/runtime-connect", {
    method: "POST",
  });

  const text = await res.text();

  if (!res.ok) {
    console.error("Backend error:", text);
    throw new Error(`Request failed: ${res.status}`);
  }

  return JSON.parse(text);
}

export async function pyRunSimulation(output: string, car: string, driver: string, track: string, temp: number, press: number, 
                                      spd_start: number, t_time: number, fuel_burned: number, burns_used: number, lap_num: number) {
  try {
    const res = await fetch("/../api/simulation/run-sim", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ output, car, driver, track, temp, press, spd_start, t_time, fuel_burned, burns_used, lap_num }),
    });
    const text = await res.text();

    if (!res.ok) {
      console.error("Backend error:", text);
      throw new Error(`Request failed: ${res.status}`);
    }

    return JSON.parse(text);
  } catch (err) {
    console.error("Fetch crashed:", err);
    throw err;
  }
}

export async function pyRuntimeDisconnect() {
  const res = await fetch("/../api/simulation/runtime-disconnect", {
    method: "POST",
  });

  const text = await res.text();

  if (!res.ok) {
    console.error("Backend error:", text);
    throw new Error(`Request failed: ${res.status}`);
  }

  return JSON.parse(text);
}
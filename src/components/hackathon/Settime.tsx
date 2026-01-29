import { useState } from "react";

export default function SetTime() {
  const [hours, setHours] = useState(24);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const submit = async () => {
    await fetch("http://localhost:3001/settime", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hours, minutes, seconds }),
    });

    alert("Hackathon time updated!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white font-mono">
      <div className="space-y-4">
        <h1 className="text-3xl tracking-widest">SET HACKATHON TIME</h1>

        <div className="flex gap-4 text-black">
          <input type="number" value={hours} onChange={e => setHours(+e.target.value)} />
          <input type="number" value={minutes} onChange={e => setMinutes(+e.target.value)} />
          <input type="number" value={seconds} onChange={e => setSeconds(+e.target.value)} />
        </div>

        <button
          onClick={submit}
          className="px-6 py-2 bg-green-600 hover:bg-green-700"
        >
          SET TIME
        </button>
      </div>
    </div>
  );
}

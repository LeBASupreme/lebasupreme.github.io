import { useEffect, useState } from "react";

const clock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Paris",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function useParisTime() {
  const [time, setTime] = useState(() => clock.format(new Date()));

  useEffect(() => {
    const id = window.setInterval(() => setTime(clock.format(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type MouseEvent } from "react";
import { navigate } from "../navigate";
import { runCommand, type OutPart } from "./commands";

type Entry =
  | { id: number; kind: "boot"; lines: OutPart[][] }
  | { id: number; kind: "exchange"; command: string; lines: OutPart[][] };

const PROMPT = "aziz@portfolio:~$";

const BOOT: Entry = {
  id: 0,
  kind: "boot",
  lines: [
    [{ text: "Aziz Ben Amor  ·  portfolio shell", dim: true }],
    [
      { text: "Type ", dim: true },
      { text: "/help", command: "/help" },
      { text: " for commands.", dim: true },
    ],
  ],
};

function commandBody(raw: string) {
  return raw.trim().replace(/^\/+/, "");
}

function Parts({ parts, onRun }: { parts: OutPart[]; onRun: (command: string) => void }) {
  return parts.map((part, index) => {
    const className = part.dim ? "is-dim" : undefined;
    if (part.command) {
      return (
        <button
          className={`terminal-run${className ? ` ${className}` : ""}`}
          key={index}
          type="button"
          onClick={() => part.command && onRun(part.command)}
        >
          {part.text}
        </button>
      );
    }
    if (part.href) {
      return (
        <a
          className={className}
          key={index}
          href={part.href}
          target={part.href.startsWith("http") ? "_blank" : undefined}
          rel={part.href.startsWith("http") ? "noreferrer" : undefined}
        >
          {part.text}
        </a>
      );
    }
    return (
      <span className={className} key={index}>
        {part.text}
      </span>
    );
  });
}

export function Terminal() {
  const [entries, setEntries] = useState<Entry[]>([BOOT]);
  const [value, setValue] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);
  const history = useRef<string[]>([]);
  const cursor = useRef(-1);
  const draft = useRef("");

  useEffect(() => {
    const previous = document.title;
    document.title = "terminal — Aziz Ben Amor";
    inputRef.current?.focus();
    return () => {
      document.title = previous;
    };
  }, []);

  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    log.scrollTop = log.scrollHeight;
  }, [entries]);

  function recall(next: string) {
    setValue(next);
    requestAnimationFrame(() => {
      const input = inputRef.current;
      if (!input) return;
      input.setSelectionRange(next.length, next.length);
    });
  }

  function submit(raw: string) {
    const typed = raw.trim();
    if (!commandBody(typed)) return;

    const previous = history.current[history.current.length - 1];
    if (previous !== typed) history.current.push(typed);
    cursor.current = -1;
    draft.current = "";
    setValue("");

    const result = runCommand(typed);
    if (!result) return;
    if (result.type === "clear") {
      setEntries([BOOT]);
      return;
    }
    if (result.type === "home") {
      navigate("/");
      return;
    }

    const id = nextId.current++;
    setEntries((current) => [...current, { id, kind: "exchange", command: typed, lines: result.lines }]);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit(value);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    if (history.current.length === 0) return;
    event.preventDefault();

    if (event.key === "ArrowUp") {
      if (cursor.current === -1) draft.current = value;
      const next =
        cursor.current === -1 ? history.current.length - 1 : Math.max(0, cursor.current - 1);
      cursor.current = next;
      recall(history.current[next]);
      return;
    }

    if (cursor.current === -1) return;
    if (cursor.current >= history.current.length - 1) {
      cursor.current = -1;
      recall(draft.current);
      return;
    }
    cursor.current += 1;
    recall(history.current[cursor.current]);
  }

  function focusInput(event: MouseEvent<HTMLElement>) {
    const target = event.target as HTMLElement;
    if (target.closest("a, button, input")) return;
    inputRef.current?.focus();
  }

  return (
    <section className="terminal" aria-label="Terminal" onClick={focusInput}>
      <header className="terminal-bar">
        <p>portfolio — bash</p>
        <a
          className="terminal-exit"
          href="/"
          onClick={(event) => {
            event.preventDefault();
            navigate("/");
          }}
        >
          exit
        </a>
      </header>
      <div className="terminal-log" ref={logRef} role="log" aria-live="polite" aria-relevant="additions">
        {entries.map((entry) => (
          <div className={entry.kind === "boot" ? "terminal-block terminal-boot" : "terminal-block"} key={entry.id}>
            {entry.kind === "exchange" ? (
              <p className="terminal-line">
                <span className="terminal-prompt">{PROMPT}</span> {entry.command}
              </p>
            ) : null}
            {entry.lines.map((parts, index) => (
              <p className="terminal-line" key={index}>
                <Parts parts={parts} onRun={submit} />
              </p>
            ))}
          </div>
        ))}
        <form className="terminal-form" onSubmit={onSubmit}>
        <span className="terminal-prompt">{PROMPT}</span>
        <label className="terminal-field">
          <span className="visually-hidden">Command</span>
          <span className="terminal-entry">
            <span className="terminal-mirror" aria-hidden="true">{value}</span>
            <span className="terminal-caret" aria-hidden="true" />
            <input
              ref={inputRef}
              value={value}
              onChange={(event) => {
                cursor.current = -1;
                setValue(event.target.value);
              }}
              onKeyDown={onKeyDown}
              size={1}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="send"
            />
          </span>
        </label>
      </form>
      </div>
    </section>
  );
}

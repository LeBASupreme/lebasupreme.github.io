import { EMAIL, LINKS } from "../config";
import { ABOUT, JOURNEY, MARQUEE, PROJECTS } from "../content";

export type OutPart = {
  text: string;
  href?: string;
  command?: string;
  dim?: boolean;
};

export type CommandResult =
  | { type: "lines"; lines: OutPart[][] }
  | { type: "clear" }
  | { type: "home" };

const COMMANDS: { name: string; command: string; blurb: string }[] = [
  { name: "/help", command: "/help", blurb: "this list" },
  { name: "/about", command: "/about", blurb: "who I am" },
  { name: "/skills", command: "/skills", blurb: "what I use" },
  { name: "/projects", command: "/projects", blurb: "the work" },
  { name: "/project <name>", command: "", blurb: "one project" },
  { name: "/journey", command: "/journey", blurb: "the timeline" },
  { name: "/contact", command: "/contact", blurb: "how to reach me" },
  { name: "/clear", command: "/clear", blurb: "wipe the screen" },
  { name: "/home", command: "/home", blurb: "back to the site" },
];

const NAME_WIDTH = Math.max(...COMMANDS.map((command) => command.name.length)) + 2;

function line(...parts: OutPart[]): OutPart[] {
  return parts;
}

function text(value: string): OutPart[][] {
  return [line({ text: value })];
}

function helpLines(): OutPart[][] {
  return [
    line({ text: "Commands. The slash is optional." }),
    ...COMMANDS.map((command) =>
      line(
        command.command
          ? { text: command.name.padEnd(NAME_WIDTH), command: command.command }
          : { text: command.name.padEnd(NAME_WIDTH) },
        { text: command.blurb },
      ),
    ),
  ];
}

function findProjects(arg: string) {
  const query = arg.toLowerCase();
  const exact = PROJECTS.find(
    (project) =>
      project.slug === query || project.name.toLowerCase() === query || project.index === arg,
  );
  if (exact) return [exact];
  return PROJECTS.filter(
    (project) =>
      project.slug.startsWith(query) || project.name.toLowerCase().startsWith(query),
  );
}

function projectLines(arg: string): OutPart[][] {
  if (!arg) {
    return [
      line(
        { text: "Which one? Try " },
        { text: "/projects", command: "/projects" },
        { text: "." },
      ),
    ];
  }
  const matches = findProjects(arg);
  if (matches.length === 1) {
    const project = matches[0];
    return [
      line({ text: project.name }),
      line({ text: `${project.role} · ${project.year}` }),
      line({ text: project.tech }),
      line({ text: project.note }),
    ];
  }
  if (matches.length > 1) {
    return [
      line({ text: "Which one?" }),
      ...matches.map((project) =>
        line({ text: `/project ${project.slug}`, command: `/project ${project.slug}` }),
      ),
    ];
  }
  return [
    line(
      { text: `No project named “${arg}”. Try ` },
      { text: "/projects", command: "/projects" },
      { text: "." },
    ),
  ];
}

export function runCommand(raw: string): CommandResult | null {
  const body = raw.trim().replace(/^\/+/, "");
  if (!body) return null;

  const [name, ...rest] = body.split(/\s+/);
  const command = name.toLowerCase();
  const arg = rest.join(" ").trim();

  switch (command) {
    case "help":
      return { type: "lines", lines: helpLines() };
    case "about":
      return { type: "lines", lines: text(ABOUT) };
    case "skills":
      return { type: "lines", lines: text(MARQUEE.join(" · ")) };
    case "projects":
      return {
        type: "lines",
        lines: [
          ...PROJECTS.map((project) =>
            line(
              {
                text: `${project.index}  ${project.name}`,
                command: `/project ${project.slug}`,
              },
              { text: ` — ${project.role} · ${project.year}` },
            ),
          ),
          line({ text: "Tap a line, or type /project <name>." }),
        ],
      };
    case "project":
      return { type: "lines", lines: projectLines(arg) };
    case "journey":
      return {
        type: "lines",
        lines: JOURNEY.map((step) =>
          line({ text: `${step.year}  ${step.label} — ${step.detail}` }),
        ),
      };
    case "contact":
      return {
        type: "lines",
        lines: [
          line({ text: EMAIL, href: `mailto:${EMAIL}` }),
          line({ text: "LinkedIn", href: LINKS.linkedin }),
          line({ text: "GitHub", href: LINKS.github }),
        ],
      };
    case "cls":
    case "clear":
      return { type: "clear" };
    case "exit":
    case "home":
      return { type: "home" };
    default:
      return {
        type: "lines",
        lines: [
          line(
            { text: "No such command. Try " },
            { text: "/help", command: "/help" },
            { text: "." },
          ),
        ],
      };
  }
}

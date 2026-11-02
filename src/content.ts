export const MARQUEE = [
  "Python",
  "TypeScript",
  "FastAPI",
  "LangChain",
  "n8n",
  "PostGIS",
  "MCP",
  "OAuth 2.1",
  "pgTAP",
  "Padel",
  "DJing",
] as const;

export type Project = {
  index: string;
  name: string;
  role: string;
  tech: string;
  year: string;
  mobileMeta: string;
  note: string;
  longName?: boolean;
};

export const PROJECTS: Project[] = [
  {
    index: "01",
    name: "WIMBEE",
    role: "Full-stack internship",
    tech: "MCP, OAuth 2.1, PostGIS",
    year: "2026",
    mobileMeta: "Full-stack internship · 2026",
    note: "An OAuth 2.1 MCP server that gives AI agents 4 tools, a geo search that blurs your location if you ask it to, and 216 pgTAP tests so I can sleep at night.",
  },
  {
    index: "02",
    name: "Timeora",
    role: "Pre-incubated project",
    tech: "LangChain, n8n, FastAPI",
    year: "2025",
    mobileMeta: "Pre-incubated project · 2025",
    note: "A pre-incubated project built with LangChain, n8n and FastAPI.",
  },
  {
    index: "03",
    name: "InvoiceMe",
    role: "AI invoicing micro-SaaS",
    tech: "AI, SaaS",
    year: "—",
    mobileMeta: "AI invoicing micro-SaaS",
    note: "An AI invoicing micro-SaaS.",
  },
  {
    index: "04",
    name: "fast-injection-detector",
    role: "Open-source tool",
    tech: "LLM security",
    year: "—",
    mobileMeta: "Open-source · LLM security",
    note: "An open-source tool focused on LLM security.",
    longName: true,
  },
  {
    index: "05",
    name: "OnStage",
    role: "GitHub repo",
    tech: "—",
    year: "—",
    mobileMeta: "GitHub repo",
    note: "A project published on GitHub.",
  },
  {
    index: "06",
    name: "quizmusic",
    role: "GitHub repo",
    tech: "—",
    year: "—",
    mobileMeta: "GitHub repo",
    note: "A project published on GitHub.",
  },
];

export const JOURNEY = [
  {
    year: "2023",
    label: "French Baccalauréat",
    detail: "Lycée René Descartes",
  },
  {
    year: "2024",
    label: "Bachelor in Engineering & Digital",
    detail: "EFREI Paris, until 2027",
  },
  {
    year: "2025",
    label: "Internship, pre-incubated project",
    detail: "Timeora",
  },
  {
    year: "2026",
    label: "Exchange semester",
    detail: "University of Portsmouth",
  },
  {
    year: "2026",
    label: "Full-stack developer internship",
    detail: "WIMBEE",
  },
  {
    year: "2027",
    label: "AI internship, from April",
    detail: "London or Paris?",
    next: true,
  },
] as const;

export const ABOUT =
  "I’m an engineering student at EFREI Paris. I mostly build back-ends and AI agents, and I love it when an interface moves just right. This summer I interned at WIMBEE.";

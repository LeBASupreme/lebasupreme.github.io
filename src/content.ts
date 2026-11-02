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
  slug: string;
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
    slug: "wimbee",
    name: "WIMBEE",
    role: "Full-stack internship",
    tech: "MCP, OAuth 2.1, PostGIS",
    year: "2026",
    mobileMeta: "Full-stack internship · 2026",
    note: "An OAuth 2.1 MCP server that gives AI agents 4 tools, a geo search that blurs your location if you ask it to, and 216 pgTAP tests so I can sleep at night.",
  },
  {
    index: "02",
    slug: "timeora",
    name: "Timeora",
    role: "Pre-incubated project",
    tech: "LangChain, n8n, FastAPI",
    year: "2025",
    mobileMeta: "Pre-incubated project · 2025",
    note: "A pre-incubated project built with LangChain, n8n and FastAPI.",
  },
  {
    index: "03",
    slug: "invoiceme",
    name: "InvoiceMe",
    role: "AI invoicing micro-SaaS",
    tech: "AI, SaaS",
    year: "2025",
    mobileMeta: "AI invoicing micro-SaaS · 2025",
    note: "An AI invoicing micro-SaaS.",
  },
  {
    index: "04",
    slug: "fast-injection-detector",
    name: "fast-injection-detector",
    role: "Open-source tool",
    tech: "LLM security",
    year: "In progress",
    mobileMeta: "Open-source · In progress",
    note: "An open-source tool focused on LLM security.",
    longName: true,
  },
  {
    index: "05",
    slug: "onstage",
    name: "OnStage",
    role: "Events app",
    tech: "SaaS",
    year: "2025",
    mobileMeta: "Events app · SaaS · 2025",
    note: "An events SaaS.",
  },
  {
    index: "06",
    slug: "ww1-center",
    name: "WW1 Center",
    role: "Museum website",
    tech: "React, Node, Stripe",
    year: "2026",
    mobileMeta: "Museum website · 2026",
    note: "A website for the WW1 Remembrance Centre in Portsmouth, with a scroll walkthrough, a shop, donations and an admin panel.",
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
  "I’m Aziz, a full-stack developer in Paris. I build SaaS products, apps and AI agents that actually ship, from FastAPI backends to LangChain and MCP agents that automate real work. Third-year student at EFREI, looking for an AI internship from April 2027. Off screen, I DJ and play padel.";

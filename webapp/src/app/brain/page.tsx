import React from "react";
import { strapiGet, type StrapiList, type Skill, type SkillCategory } from "@/lib/strapi";

async function getSkills(): Promise<Skill[]> {
  try {
    const res = await strapiGet<StrapiList<Skill>>("/skills", {
      "sort": "name:asc",
      "pagination[pageSize]": "100",
    });
    return res.data;
  } catch {
    return [];
  }
}

const categoryLabel: Record<SkillCategory, string> = {
  frontend:  "Frontend",
  backend:   "Backend",
  module:    "Libraries",
  cloud:     "Cloud & Platforms",
  devops:    "DevOps",
  design:    "Design",
  data:      "Data",
  mobile:    "Mobile",
  testing:   "Testing",
  software:  "Software",
  other:     "Other",
};

const categoryIcon: Record<SkillCategory, React.ReactNode> = {
  frontend: (
    // Monitor / browser window
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M2 4.25A2.25 2.25 0 0 1 4.25 2h11.5A2.25 2.25 0 0 1 18 4.25v8.5A2.25 2.25 0 0 1 15.75 15h-3.105a3.501 3.501 0 0 0 1.1 1.677A.75.75 0 0 1 13.26 18H6.74a.75.75 0 0 1-.484-1.323A3.501 3.501 0 0 0 7.355 15H4.25A2.25 2.25 0 0 1 2 12.75v-8.5Zm1.5 0a.75.75 0 0 1 .75-.75h11.5a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-.75.75H4.25a.75.75 0 0 1-.75-.75v-7.5Z" clipRule="evenodd" />
    </svg>
  ),
  backend: (
    // Server stack
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M4.632 3.533A2 2 0 0 1 6.577 2h6.846a2 2 0 0 1 1.945 1.533l1.976 8.234A3.489 3.489 0 0 0 16.5 11.5H3.5c-.476 0-.93.095-1.344.267l1.476-8.234Z" />
      <path fillRule="evenodd" d="M3.5 13a2 2 0 1 0 0 4h13a2 2 0 1 0 0-4h-13Zm11.75 1.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm-2.25.75a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0Z" clipRule="evenodd" />
    </svg>
  ),
  module: (
    // Puzzle piece / light bulb
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M10 1a6 6 0 0 0-3.815 10.631C7.237 12.5 8 13.443 8 14.456v.644a.75.75 0 0 0 .572.729 6.016 6.016 0 0 0 2.856 0A.75.75 0 0 0 12 15.1v-.644c0-1.013.762-1.957 1.815-2.825A6 6 0 0 0 10 1ZM8.863 17.414a.75.75 0 0 0-.226 1.483 9.066 9.066 0 0 0 2.726 0 .75.75 0 0 0-.226-1.483 7.553 7.553 0 0 1-2.274 0Z" />
    </svg>
  ),
  cloud: (
    // Cloud
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M6.5 9A4.5 4.5 0 0 1 15 7.192 3 3 0 0 1 14.5 13H5.5a3.5 3.5 0 0 1-.197-6.987A4.5 4.5 0 0 1 6.5 9Z" />
    </svg>
  ),
  devops: (
    // Cog / gear
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25L2.795 4.48a1 1 0 0 1 1.187-.447l1.598.54A6.993 6.993 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
    </svg>
  ),
  design: (
    // Swatch / paint palette
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M3.75 3A1.75 1.75 0 0 0 2 4.75v10.5c0 .966.784 1.75 1.75 1.75h5.146a1.75 1.75 0 0 0 1.238-.513l6.364-6.364a1.75 1.75 0 0 0 0-2.474L12.74 3.951A1.75 1.75 0 0 0 11.5 3.44V3H3.75ZM11.5 4.94a.25.25 0 0 1 .177.073l3.757 3.757a.25.25 0 0 1 0 .353L9.07 15.488a.25.25 0 0 1-.177.073H3.75a.25.25 0 0 1-.25-.25V4.75a.25.25 0 0 1 .25-.25H11.5Zm-6 3.56a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm2.5 3a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" clipRule="evenodd" />
    </svg>
  ),
  data: (
    // Bar chart
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 3 0v-13A1.5 1.5 0 0 0 15.5 2ZM10 7a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 10 19a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 10 7ZM4.5 12A1.5 1.5 0 0 0 3 13.5v3A1.5 1.5 0 0 0 4.5 18 1.5 1.5 0 0 0 6 16.5v-3A1.5 1.5 0 0 0 4.5 12Z" />
    </svg>
  ),
  mobile: (
    // Phone
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M8 16.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z" />
      <path fillRule="evenodd" d="M4 4a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4Zm3-1.5h6A1.5 1.5 0 0 1 14.5 4v12a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 16V4A1.5 1.5 0 0 1 7 2.5Z" clipRule="evenodd" />
    </svg>
  ),
  testing: (
    // Checkmark
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
    </svg>
  ),
  software: (
    // Desktop app window
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M3.25 3A2.25 2.25 0 0 0 1 5.25v9.5A2.25 2.25 0 0 0 3.25 17h13.5A2.25 2.25 0 0 0 19 14.75v-9.5A2.25 2.25 0 0 0 16.75 3H3.25ZM2.5 9v5.75c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75V9h-15ZM4 6.75A.75.75 0 0 1 4.75 6h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 6.75Z" clipRule="evenodd" />
    </svg>
  ),
  other: (
    // Three dots
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
    </svg>
  ),
};


type RecencyBucket = "current" | "recent" | "past" | "dated" | "unknown";

function getRecencyBucket(lastUsed: string | null): RecencyBucket {
  if (!lastUsed) return "unknown";
  const months = (Date.now() - new Date(lastUsed).getTime()) / (1000 * 60 * 60 * 24 * 30.44);
  if (months <= 6)  return "current";
  if (months <= 18) return "recent";
  if (months <= 36) return "past";
  return "dated";
}

const recencyChipClass: Record<RecencyBucket, string> = {
  current: "border-brand-cyan/50 bg-brand-cyan/10 text-brand-dark dark:text-brand-cyan dark:bg-brand-cyan/15 dark:border-brand-cyan/40",
  recent:  "border-brand-orange/50 bg-brand-orange/10 text-brand-dark dark:text-brand-orange dark:bg-brand-orange/15 dark:border-brand-orange/40",
  past:    "border-brand-red/40 bg-brand-red/8 text-brand-red dark:bg-brand-red/12 dark:border-brand-red/50",
  dated:   "border-brand-dark/15 bg-brand-dark/5 text-brand-dark/40 dark:border-brand-white/15 dark:bg-brand-white/5 dark:text-brand-white/40",
  unknown: "border-brand-dark/15 bg-brand-white text-brand-dark/60 dark:border-brand-white/15 dark:bg-brand-white/5 dark:text-brand-white/60",
};

const recencyLabel: Record<RecencyBucket, string> = {
  current: "Active — used within 6 months",
  recent:  "Recent — used within 18 months",
  past:    "Past — used 1.5–3 years ago",
  dated:   "Dated — last used 3+ years ago",
  unknown: "Recency unknown",
};

export default async function Brain() {
  const skills = await getSkills();

  // Sort: dated skills newest-first, nulls at the end
  const sorted = [...skills].sort((a, b) => {
    if (a.lastUsed && b.lastUsed) return b.lastUsed.localeCompare(a.lastUsed);
    if (a.lastUsed) return -1;
    if (b.lastUsed) return 1;
    return 0;
  });

  return (
    <>
      <main className="px-8 py-12">
        <h1 className="font-funnel mb-6 text-4xl font-bold">Brain</h1>

        {/* Recency legend */}
        <div className="mb-10 flex flex-wrap gap-2 text-xs">
          {(["current", "recent", "past", "dated", "unknown"] as RecencyBucket[]).map((b) => (
            <span
              key={b}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 ${recencyChipClass[b]}`}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-50" />
              {recencyLabel[b]}
            </span>
          ))}
        </div>

        <ul className="flex flex-wrap gap-2">
          {sorted.map((skill) => {
            const bucket = getRecencyBucket(skill.lastUsed);
            const tooltip = [
              categoryLabel[skill.category],
              skill.lastUsed
                ? `Last used: ${new Date(skill.lastUsed).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
                : null,
              recencyLabel[bucket],
            ].filter(Boolean).join(" · ");
            return (
              <li
                key={skill.id}
                title={tooltip}
                className={`flex cursor-default items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-opacity hover:opacity-70 ${recencyChipClass[bucket]}`}
              >
                <span className="opacity-60">{categoryIcon[skill.category]}</span>
                {skill.name}
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}

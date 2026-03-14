import Header from "@/components/Header";
import { strapiGet, type StrapiList, type Skill, type SkillCategory } from "@/lib/strapi";

async function getSkills(): Promise<Skill[]> {
  try {
    const res = await strapiGet<StrapiList<Skill>>("/skills", {
      "sort": "category:asc,name:asc",
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

// Preferred display order
const categoryOrder: SkillCategory[] = [
  "frontend",
  "backend",
  "module",
  "cloud",
  "devops",
  "testing",
  "design",
  "software",
  "data",
  "mobile",
  "other",
];

export default async function Brain() {
  const skills = await getSkills();

  const grouped = skills.reduce<Partial<Record<SkillCategory, Skill[]>>>((acc, skill) => {
    (acc[skill.category] ??= []).push(skill);
    return acc;
  }, {});

  const categories = categoryOrder.filter((c) => grouped[c]?.length);

  return (
    <>
      <Header />
      <main className="px-8 py-12">
        <h1 className="font-funnel mb-10 text-4xl font-bold">Brain</h1>
        <div className="flex flex-col gap-10">
          {categories.map((cat) => (
            <section key={cat}>
              <h2 className="font-funnel mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">
                {categoryLabel[cat]}
              </h2>
              <ul className="flex flex-wrap gap-2">
                {grouped[cat]!.map((skill) => (
                  <li
                    key={skill.id}
                    className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700"
                  >
                    {skill.name}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}

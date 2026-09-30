const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function slugify(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function required(message) {
  return (value) => (String(value).trim() ? true : `${message} is required`);
}

function datePrompt(name, message, defaultValue, optional = false) {
  return {
    type: "input",
    name,
    message,
    default: defaultValue,
    validate: (value) => {
      if (optional && !value) return true;
      return /^\d{4}-\d{2}(-\d{2})?$/.test(value) || "Use YYYY-MM-DD or YYYY-MM";
    },
  };
}

function slugPrompt(source) {
  return {
    type: "input",
    name: "slug",
    message: "Filename slug:",
    default: (answers) => slugify(answers[source]),
    validate: (value) => SLUG_PATTERN.test(value) || "Use lowercase kebab-case",
  };
}

function addGenerator(plop, name, description, folder, template, prompts) {
  plop.setGenerator(name, {
    description,
    prompts,
    actions: [
      {
        type: "add",
        path: `content/${folder}/{{slug}}.mdx`,
        templateFile: `plop-templates/${template}.mdx.hbs`,
      },
    ],
  });
}

module.exports = function (plop) {
  plop.setHelper("yaml", (value) => JSON.stringify(String(value ?? "")));
  const today = new Date().toISOString().slice(0, 10);

  addGenerator(plop, "article", "Add an article", "articles", "article", [
    { type: "input", name: "title", message: "Title:", validate: required("Title") },
    { type: "input", name: "summary", message: "Summary:", validate: required("Summary") },
    slugPrompt("title"),
    datePrompt("publishedAt", "Published date:", today),
    { type: "input", name: "category", message: "Category (optional):" },
    { type: "confirm", name: "draft", message: "Start as a draft?", default: true },
  ]);

  addGenerator(plop, "project", "Add a project", "projects", "project", [
    { type: "input", name: "title", message: "Title:", validate: required("Title") },
    { type: "input", name: "summary", message: "Summary:", validate: required("Summary") },
    slugPrompt("title"),
    {
      type: "list",
      name: "stage",
      message: "Stage:",
      choices: ["concept", "in-progress", "shipped", "archived"],
    },
  ]);

  addGenerator(plop, "artwork", "Add an artwork entry", "art", "artwork", [
    { type: "input", name: "name", message: "Artwork name:", validate: required("Name") },
    slugPrompt("name"),
    {
      type: "input",
      name: "imageSrc",
      message: "R2 image path (under /art/):",
      validate: (value) => /^\/art\/.+/.test(value) || "Use a bucket-relative /art/... path",
    },
    {
      type: "input",
      name: "imageAlt",
      message: "Image alt text:",
      default: (answers) => answers.name,
      validate: required("Alt text"),
    },
    {
      type: "number",
      name: "imageWidth",
      message: "Image pixel width:",
      validate: (value) => Number.isInteger(value) && value > 0 || "Enter a positive whole number",
    },
    {
      type: "number",
      name: "imageHeight",
      message: "Image pixel height:",
      validate: (value) => Number.isInteger(value) && value > 0 || "Enter a positive whole number",
    },
    { type: "input", name: "description", message: "Description (optional):" },
    { type: "input", name: "medium", message: "Medium (optional):" },
    { type: "input", name: "materials", message: "Materials (optional):" },
    { type: "input", name: "year", message: "Year (optional):" },
    { type: "input", name: "dimensions", message: "Physical dimensions (optional):" },
    { type: "input", name: "series", message: "Series (optional):" },
    { type: "number", name: "order", message: "Display order:", default: 0 },
  ]);

  addGenerator(plop, "experience", "Add an experience entry", "experience", "experience", [
    { type: "input", name: "title", message: "Role title:", validate: required("Title") },
    { type: "input", name: "company", message: "Company:", validate: required("Company") },
    slugPrompt("title"),
    {
      type: "list",
      name: "type",
      message: "Employment type:",
      choices: ["internship", "full-time", "part-time", "contract"],
    },
    datePrompt("startDate", "Start date:", today.slice(0, 7)),
    datePrompt("endDate", "End date (leave blank if current):", "", true),
  ]);

  addGenerator(plop, "education", "Add an education entry", "education", "education", [
    { type: "input", name: "title", message: "Qualification:", validate: required("Title") },
    {
      type: "input",
      name: "institution",
      message: "Institution:",
      validate: required("Institution"),
    },
    slugPrompt("title"),
    datePrompt("startDate", "Start date:", today.slice(0, 7)),
    datePrompt("endDate", "End date (optional):", "", true),
  ]);

  addGenerator(plop, "skill", "Add a skill", "skills", "skill", [
    { type: "input", name: "name", message: "Skill name:", validate: required("Name") },
    slugPrompt("name"),
    {
      type: "list",
      name: "proficiency",
      message: "Proficiency:",
      choices: [
        { name: "Not specified", value: "" },
        "novice",
        "working",
        "fluent",
        "deep",
      ],
    },
    datePrompt("lastUsed", "Last used (optional):", "", true),
  ]);

  addGenerator(plop, "thing", "Add a thing", "things", "thing", [
    { type: "input", name: "name", message: "Name:", validate: required("Name") },
    slugPrompt("name"),
    {
      type: "list",
      name: "type",
      message: "Type:",
      choices: ["book", "record", "tool", "gear", "furniture", "other"],
    },
    { type: "confirm", name: "isSelf", message: "Did you make this?", default: false },
  ]);

  addGenerator(plop, "link", "Add a social link or bookmark", "links", "link", [
    { type: "input", name: "title", message: "Title:", validate: required("Title") },
    {
      type: "input",
      name: "url",
      message: "URL:",
      validate: (value) => {
        try {
          new URL(value);
          return true;
        } catch {
          return "Enter an absolute URL, including https://";
        }
      },
    },
    slugPrompt("title"),
    { type: "list", name: "type", message: "Link type:", choices: ["social", "bookmark"] },
    { type: "input", name: "description", message: "Description (optional):" },
  ]);
};
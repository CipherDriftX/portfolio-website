// Core copy for the whole site. Change a line here and every page follows.

export const site = {
  name: "Aryan Haghighi",
  title: "AI Engineer",
  claim: "I ship AI agents into production, with evals that prove they work.",
  drone: "Building autonomous drones.",
  offer:
    "I start with a two-week fixed-price build: one working agent in your stack, with the evals to prove it. If it works, we go month to month.",
  // What search engines and AI answers should link to the name (Person knowsAbout).
  topics: ["AI agents", "LLM evaluation", "Large language models", "LLM cost tracking", "Autonomous drones", "Robotics"],
  pageTitle: "Aryan Haghighi, AI Engineer · production AI agents + evals",
  url: "https://www.aryanhaghighi.com",
  email: "aryan@aryanhaghighi.com",
  links: {
    linkedin: "https://www.linkedin.com/in/aryan-haghighi-24b779304/",
    github: "https://github.com/CipherDriftX",
  },
  photo: {
    alt: "Aryan Haghighi sitting at a table by a window at night.",
    // Used by the Person schema and as a fallback share image.
    schema: "/photo/phone-960.jpg",
  },
} as const;

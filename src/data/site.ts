// Core copy for the whole site. Change a line here and every page follows.

export const site = {
  name: "Aryan Haghighi",
  title: "AI Engineer",
  claim: "I ship AI agents into production, with evals that prove they work.",
  // The home page's meta description: the name first, so a search for it
  // and an AI answer about it both read who this is in one sentence.
  description:
    "Aryan Haghighi is an AI engineer who ships AI agents into production, with evals that prove they work, and builds the tools that keep agents safe.",
  drone: "Building autonomous drones.",
  offer:
    "I start with a two-week fixed-price build: one working agent in your stack, with the evals to prove it. If it works, we go month to month.",
  // What search engines and AI answers should link to the name (Person knowsAbout).
  topics: ["AI agents", "LLM evaluation", "AI agent safety", "Large language models", "Autonomous drones"],
  // The day the facts in this file or the About text last changed. Bump it
  // when you change them. It feeds the sitemap and the home page schema.
  // Notes, case studies, projects and reviews move the date on their own.
  updated: "2026-11-24",
  // The day the site first went up. ProfilePage dateCreated.
  launched: "2026-11-21",
  // The public handle (GitHub, commits). Person alternateName, which Google's
  // profile page markup reads as the social media handle.
  handle: "CipherDriftX",
  // The name in Persian script, as the owner writes it (آریان, with alef).
  // People searching from Iran type it this way.
  nameFa: "آریان حقیقی",
  // schema.org disambiguatingDescription. A Gemini check on 2026-11-24
  // grouped this name with the NLP researcher Aria Haghighi (aria42.com)
  // and with other people named Aryan Haghighi.
  disambiguation:
    "AI engineer in Istanbul, CipherDriftX on GitHub, who built Wyatt and WyScan. Not the NLP researcher Aria Haghighi, and not the other people named Aryan Haghighi.",
  // Facts that tell this Aryan Haghighi apart from others with the name.
  // Same facts as the About text and the GitHub profile README; Person schema.
  bio: {
    school: { name: "Bahçeşehir University", url: "https://bau.edu.tr", wikipedia: "https://en.wikipedia.org/wiki/Bah%C3%A7e%C5%9Fehir_University" },
    city: "Istanbul, Türkiye",
    company: { name: "Plarix", url: "https://plarix.dev", github: "https://github.com/plarix-ai" },
    // schema.org award = won. RoboCup IranOpen was competed in, so it stays in the About text only.
    awards: ["FarzCup, inter-school robotics competition run by SAMPAD (team win)"],
  },
  pageTitle: "Aryan Haghighi, AI Engineer · production AI agents + evals",
  url: "https://www.aryanhaghighi.com",
  email: "aryan@aryanhaghighi.com",
  links: {
    linkedin: "https://www.linkedin.com/in/aryan-haghighi-24b779304/",
    github: "https://github.com/CipherDriftX",
    x: "https://x.com/aryanhgh",
  },
  photo: {
    alt: "Aryan Haghighi sitting at a table by a window at night.",
    // The Person schema image: Google's profile page markup wants square,
    // 4:3 and 16:9 versions (_photo/build.py cuts them).
    schema: ["/photo/aryan-haghighi-1x1.jpg", "/photo/aryan-haghighi-4x3.jpg", "/photo/aryan-haghighi-16x9.jpg"],
  },
} as const;

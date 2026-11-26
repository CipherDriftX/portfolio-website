// The Person, one record for the whole site. The home page carries it as the
// ProfilePage's main entity and /about/ as the AboutPage's; every other page
// points at it by @id, so search engines and AI answers read one person.
import { site } from "../data/site";
import { cv } from "../data/cv";

export const personId = `${site.url}/#person`;
export const websiteId = `${site.url}/#website`;

export const personSchema = {
  "@type": "Person",
  "@id": personId,
  name: site.name,
  alternateName: [site.nameFa, site.handle, "aryanhgh"],
  disambiguatingDescription: site.disambiguation,
  jobTitle: site.title,
  description: site.claim,
  url: `${site.url}/`,
  image: site.photo.schema.map((p) => `${site.url}${p}`),
  email: `mailto:${site.email}`,
  sameAs: [site.links.linkedin, site.links.github, site.links.x],
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: site.bio.school.name,
    url: site.bio.school.url,
    sameAs: site.bio.school.wikipedia,
  },
  // The current jobs on the CV (src/data/cv.ts). Plarix ended in July 2026;
  // it stays the source organization of Wyatt and WyScan.
  worksFor: [
    {
      "@type": "ResearchOrganization",
      name: "Istanbul Big Data Research Center",
      parentOrganization: { "@type": "CollegeOrUniversity", name: site.bio.school.name, url: site.bio.school.url },
    },
    { "@type": "Organization", name: "MacroLOC" },
  ],
  hasOccupation: {
    "@type": "Occupation",
    name: site.title,
    skills: cv.skills
      .filter(([label]) => label !== "Spoken")
      .map(([, value]) => value)
      .join("; "),
  },
  homeLocation: { "@type": "Place", name: site.bio.city },
  award: site.bio.awards,
  knowsAbout: site.topics,
};

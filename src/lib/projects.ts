import { ALL_SKILLS_ICONS } from "./constants";

type Project = {
  title: string;
  description: string;
  type: "web" | "mobile" | "desktop";
  liveLink?: string;
  technologies: { name: string; icon: string }[];
} & ({ isPrivate: true } | { isPrivate?: false; githubLink: string }) &
  ({ type: "web" | "desktop"; previewImage: string } | { type: "mobile" });

export const projects = [
  {
    title: "Wise App",
    description:
      "A digital healthcare platform built to connect hospitals, healthcare providers, and communities in Cameroon through remote consultations, appointment management.",
    type: "web",
    isPrivate: true,
    previewImage: "/screenshots/wiseapp-cover.png",
    liveLink: "https://app.wisecool.org/",
    technologies: [
      { name: "nextjs", icon: ALL_SKILLS_ICONS.nextjs },
      { name: "expressjs", icon: ALL_SKILLS_ICONS.express },
      { name: "Vercel", icon: ALL_SKILLS_ICONS.vercel },
    ],
  },
  {
    title: "Kinya",
    description:
      "A web application built to help tourists, internationals, and anyone interested in learning the Kinyarwanda language.",
    type: "web",
    liveLink: "https://kinya.vercel.app",
    githubLink: "https://github.com/yll0rd/kinya",
    previewImage: "/screenshots/kinya-screenshot.jpg",
    technologies: [
      { name: "Angular", icon: ALL_SKILLS_ICONS.angular },
      { name: "Springboot", icon: ALL_SKILLS_ICONS.spring },
      { name: "Vercel", icon: ALL_SKILLS_ICONS.vercel },
      { name: "Docker", icon: ALL_SKILLS_ICONS.docker },
      { name: "AWS", icon: ALL_SKILLS_ICONS.aws },
    ],
  },
  {
    title: "TiC Portal",
    description:
      "An AI-powered learning platform for young developers participating in the national hackathon.",
    type: "web",
    isPrivate: true,
    previewImage: "/screenshots/ticportal-screenshot.png",
    liveLink: "https://portal.ticsummit.org/",
    technologies: [
      { name: "nextjs", icon: ALL_SKILLS_ICONS.nextjs },
      { name: "Vercel", icon: ALL_SKILLS_ICONS.vercel },
    ],
  },
  {
    title: "Dewise Energy",
    description:
      "An online learning platform offering courses on renewable energy and the energy transition.",
    type: "web",
    isPrivate: true,
    previewImage: "/screenshots/dewise-screenshot.png",
    liveLink: "https://dewise-energy.org/",
    technologies: [
      { name: "nextjs", icon: ALL_SKILLS_ICONS.nextjs },
      { name: "Vercel", icon: ALL_SKILLS_ICONS.vercel },
    ],
  },
  {
    title: "The Amea Archives",
    description:
      "A digital archive dedicated to preserving the history and culture of the Amea region.",
    type: "web",
    githubLink: "https://github.com/TheAmeaArchives/Amea",
    previewImage: "/screenshots/ameaarchives-screenshot.jpeg",
    liveLink: "https://theameaarchives.com/",
    technologies: [
      { name: "TypeScript", icon: ALL_SKILLS_ICONS.typescript },
      { name: "nextjs", icon: ALL_SKILLS_ICONS.nextjs },
      { name: "Vercel", icon: ALL_SKILLS_ICONS.vercel },
    ],
  },
  {
    title: "Recipe Finder Mobile App",
    description:
      "A mobile app for discovering recipes and learning how to prepare them.",
    type: "mobile",
    githubLink: "https://github.com/yll0rd/recipe-finder-mobile-app",
    technologies: [
      { name: "TypeScript", icon: ALL_SKILLS_ICONS.typescript },
      { name: "React Native", icon: ALL_SKILLS_ICONS.react_native },
      { name: "Expo", icon: ALL_SKILLS_ICONS.expo },
    ],
  },
] satisfies Project[];

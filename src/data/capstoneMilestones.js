// Capstone — "Build Your Own Portfolio Site".
//
// A guided real project where the scaffolding deliberately SHRINKS milestone by
// milestone (full code → moderate hints → requirements only → zero hints). The
// gradient toward independence is the point. The user builds this in their own
// fresh React project, not inside this app.
//
// hintLevel: 'full' | 'moderate' | 'light' | 'minimal' | 'none'
export const capstoneMilestones = [
  {
    id: 'setup',
    num: 1,
    title: 'Project Setup',
    hintLevel: 'full',
    goal: 'Scaffold a fresh Vite + React project with a sensible folder structure and routing installed.',
    requirements: [
      'Create a new project: npm create vite@latest portfolio -- --template react',
      'Install routing: npm i react-router-dom',
      'Create folders: src/components, src/pages, src/data',
      'Wrap <App/> in <BrowserRouter> in main.jsx',
    ],
    acceptance: ['App runs with `npm run dev`', 'BrowserRouter is in place', 'Folders exist and are empty/stubbed'],
    code: `// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// suggested structure
src/
  components/   (Navbar, Hero, ProjectCard, ContactForm)
  pages/        (Home, About, Projects, Contact)
  data/         (projects.js)`,
  },
  {
    id: 'navbar',
    num: 2,
    title: 'Responsive Navbar',
    hintLevel: 'moderate',
    goal: 'Build a navbar with your name/logo and links, plus a hamburger menu that toggles on mobile.',
    requirements: [
      'A <Navbar> component with links (Home, About, Projects, Contact)',
      'A state-driven mobile menu that opens/closes with a hamburger button',
      'Links are visible inline on desktop, collapsed behind the toggle on mobile',
    ],
    acceptance: ['Menu toggles open/closed on click', 'Layout adapts at a breakpoint', 'No console errors'],
    code: `// Navbar.jsx — moderate hint: structure given, you fill the styling
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const links = ["Home", "About", "Projects", "Contact"];
  return (
    <nav>
      <strong>Your Name</strong>
      <button onClick={() => setOpen((o) => !o)}>☰</button>
      <ul className={open ? "open" : ""}>
        {links.map((l) => <li key={l}>{/* a <Link> to /\${l.toLowerCase()} */}</li>)}
      </ul>
    </nav>
  );
}`,
  },
  {
    id: 'hero',
    num: 3,
    title: 'Hero Section',
    hintLevel: 'light',
    goal: 'A reusable Hero component that takes name, title and tagline as props.',
    requirements: [
      '<Hero name title tagline /> renders all three props',
      'It is reused/configurable via props (no hardcoded text inside)',
      'A call-to-action button (e.g. “View my work”)',
    ],
    acceptance: ['Changing the props changes the output', 'Renders cleanly on mobile and desktop'],
    code: `// Light hint — just the signature. You write the rest.
function Hero({ name, title, tagline }) { /* ... */ }`,
  },
  {
    id: 'projects',
    num: 4,
    title: 'Projects Section',
    hintLevel: 'light',
    goal: 'Render a grid of project cards from a data array.',
    requirements: [
      'A data file exporting an array of projects ({ id, title, description, link })',
      'Map over it to render <ProjectCard> components with a stable key',
      'Each card links out to the project',
    ],
    acceptance: ['Adding an item to the array adds a card', 'Each card has key={project.id}', 'Links work'],
    code: `// Light hint
// data/projects.js -> export const projects = [{ id, title, description, link }, ...]
// {projects.map((p) => <ProjectCard key={p.id} {...p} />)}`,
  },
  {
    id: 'contact',
    num: 5,
    title: 'Contact Form',
    hintLevel: 'minimal',
    goal: 'A controlled contact form with simple validation and a submit feedback state.',
    requirements: [
      'Controlled inputs for name, email, message',
      'Inline validation (required fields, valid email)',
      'On submit: show a success message (no real backend needed)',
    ],
    acceptance: ['Submit is blocked while invalid', 'Errors show inline', 'A success state appears after submit'],
    code: null,
    tip: 'Reuse the single-state-object + computed-key pattern from Module 8, and derive errors during render.',
  },
  {
    id: 'darkmode',
    num: 6,
    title: 'Dark Mode (Context)',
    hintLevel: 'minimal',
    goal: 'A site-wide dark/light theme toggle implemented with the Context API.',
    requirements: [
      'A ThemeContext providing the current theme + a toggle',
      'A toggle button anywhere (e.g. in the navbar) flips the theme',
      'The theme visibly affects the whole site',
    ],
    acceptance: ['Toggle flips the entire site’s theme', 'No prop drilling for the theme'],
    code: null,
    tip: 'This is exactly Module 11. Provider at the top, useContext wherever you need it. Bonus: persist with localStorage (Module 13).',
  },
  {
    id: 'routing',
    num: 7,
    title: 'Routing',
    hintLevel: 'none',
    goal: 'Separate Home / About / Projects / Contact pages with client-side routing.',
    requirements: [
      'A <Route> per page and <Link>/<NavLink> navigation',
      'A catch-all 404 route',
      'No full-page reloads when navigating',
    ],
    acceptance: ['Each URL renders its page', 'Back/forward buttons work', 'Unknown URLs show a 404'],
    code: null,
  },
  {
    id: 'deploy',
    num: 8,
    title: 'Polish & Deploy',
    hintLevel: 'none',
    goal: 'Final responsive/accessibility polish, then deploy. Build this milestone entirely on your own.',
    requirements: [
      'Responsive check at mobile, tablet and desktop widths',
      'Accessibility pass: alt text, labels, keyboard focus, color contrast',
      'Run `npm run build` with no errors',
      'Deploy to Vercel or Netlify',
    ],
    acceptance: ['Production build succeeds', 'Site is live at a public URL', 'No console errors in production'],
    code: null,
    deploy: `Deploy to Vercel (fastest):
1. Push your repo to GitHub.
2. Go to vercel.com → "Add New Project" → import the repo.
3. Framework preset: Vite. Build command: npm run build. Output dir: dist.
4. Deploy → you get a live URL.

Or Netlify:
1. Push to GitHub.
2. netlify.com → "Add new site" → import from Git.
3. Build command: npm run build. Publish directory: dist.
4. Deploy.

Tip: add a SPA redirect so deep links work — Netlify: a _redirects file with
"/*  /index.html  200". Vercel handles SPA routing automatically for Vite.`,
  },
]

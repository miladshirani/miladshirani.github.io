# miladshirani.github.io

Personal academic site. Pure HTML/CSS/JS, no build step.

## Where things live

| What | Where |
|---|---|
| All content (profile, research tabs, projects, publications, honors) | `assets/data.js` |
| Rendering and motion | `assets/site.js` |
| Design | `assets/style.css` |
| Pages | `index.html`, `research.html`, `projects.html`, `publications.html`, `honors.html` |
| One page per project | `research-<name>.html` |
| Figures and GIFs, one folder per project | `Figures/<Project>/` |
| Draft theory write-ups (not published) | `Theories/` |

## Site structure

- **Home**: hero and credibility strip (`SITE.hero`, `SITE.stats`), What I Build (`SITE.build`), the one pipeline (`SITE.pipeline`), four featured project blocks (written directly in `index.html`: Differentiable FEA, Differentiable Meshless Mechanics, Data-Free Physics-Constrained GNNs, Neural Operators), the theory foundation with the two textbooks, more projects (`SITE.projects`), profile and research to product (`SITE.profile`, `SITE.product`), research themes, journey.
- **Research**: the five-stage pipeline overview, then numbered tabs (`SITE.researchTabs`). Each tab opens with four levels (`levels`: problem, method, physics and math, result); the long text (`body`) sits behind a toggle. `research.html#t11` opens a tab directly.
- **Projects**: every project page, filterable by field (`SITE.projects`, `SITE.categories`).
- **Publications / Honors**: generated from `data.js`.

## Add a project

1. Copy an existing `research-*.html` page (for example `research-pi-fno.html`) to `research-<name>.html` and edit the content. Put its figures in `Figures/<Project>/`.
2. Add one object to `SITE.projects` in `assets/data.js`:

   ```js
   { title: "My Project", href: "research-<name>.html",
     cats: ["machine-learning"],      // first one is the main field
     year: "2026", featured: false,   // featured:true also shows it on the home page
     status: { kind: "done", label: "Open source" },   // kind: "done" | "ongoing"
     why: "One sentence on why it matters.",
     struct: {                        // the four levels used across the site
       problem: "...", method: "...", physics: "...", result: "..."
     },
     summary: "One or two sentences (used when there is no struct)." }
   ```

   Keep numbers exact and scoped (what was measured, on what), and use `inFeatures: true` only for projects that already have a full block on the home page.

3. Commit and push. The page appears on **Projects**, with its field chip and count.

## Add a field

Add `{ id: "my-field", label: "My Field" }` to `SITE.categories`. Fields with no projects are hidden automatically. Home theme cards link to a field with `href: "projects.html#<id>"`.

Fields currently: theoretical mechanics, computational mechanics, Physics AI, machine learning, experimental mechanics.

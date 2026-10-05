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

- **Home**: profile, eight research themes (each links to a field on the Projects page), selected projects, academic journey.
- **Research**: the narrative, as numbered tabs (`SITE.researchTabs`).
- **Projects**: every project page, filterable by field (`SITE.projects`, `SITE.categories`).
- **Publications / Honors**: generated from `data.js`.

## Add a project

1. Copy an existing `research-*.html` page (for example `research-pi-fno.html`) to `research-<name>.html` and edit the content. Put its figures in `Figures/<Project>/`.
2. Add one object to `SITE.projects` in `assets/data.js`:

   ```js
   { title: "My Project", href: "research-<name>.html",
     cats: ["machine-learning"],      // first one is the main field
     year: "2026", featured: false,   // featured:true also shows it on the home page
     summary: "One or two sentences." }
   ```

3. Commit and push. The page appears on **Projects**, with its field chip and count.

## Add a field

Add `{ id: "my-field", label: "My Field" }` to `SITE.categories`. Fields with no projects are hidden automatically. Home theme cards link to a field with `href: "projects.html#<id>"`.

Fields currently: theoretical mechanics, computational mechanics, machine learning, soft matter and biomechanics, experimental mechanics.

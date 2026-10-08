/* =============================================================
   SITE CONTENT  —  edit THIS file to add or change anything.
   Nothing here touches design or layout; it is pure content.

   Quick guide:
     • Add a project page → add one entry to SITE.projects (see below)
     • Add a publication  → add one entry to SITE.publications.*
     • Add a research tab → add one object to SITE.researchTabs
     • Add an award       → add one object to SITE.honors
     • Add a nav link      → add one object to SITE.nav
     • Change a social URL → edit SITE.profile.links ONCE (used everywhere)

   MATH NOTE (research tabs only): write LaTeX with DOUBLE backslashes,
   e.g.  "the gradient \\( \\boldsymbol{F} \\) is ..."  MathJax renders it.
   ============================================================= */

window.SITE = {

  /* ---- PROFILE (used across every page) ---------------------- */
  profile: {
    name:      "Milad Shirani",
    shortName: "M. Shirani",
    role:      "Postdoctoral Associate · Yale University",
    roleLine:  "Continuum Mechanics &amp; Physics AI<br />Biomedical Engineering, Yale University",
    bio:       "I did not come to Physics AI from generic machine learning. I came from theoretical mechanics: constitutive modeling, thermodynamics, nonlinear elasticity, stability theory, and numerical simulation. My research spans the boundary between that continuum mechanics and physics-informed machine learning — from thermodynamically consistent models of soft biological tissues and nematic elastomers to differentiable simulation and neural constitutive laws. I build models that are mathematically provable, computationally efficient, and physically meaningful.",
    email:     "milad.shirani@yale.edu",
    photo:     "Figures/profile.jpeg",              // your photo — place it in a "Figures" folder next to the .html files
    photoFallback: "https://github.com/miladshirani.png", // shown if the local photo can't be found (e.g. in preview)
    // Absolute site URL — used for SEO / structured data.
    baseUrl:   "https://miladshirani.github.io",
    // Edit these once; they populate every footer + structured data.
    links: {
      scholar:  "https://scholar.google.com",   // TODO: replace with your Scholar profile URL
      linkedin: "https://linkedin.com",          // TODO: replace with your LinkedIn URL
      github:   "https://github.com/miladshirani",
      orcid:    "",                               // optional: e.g. https://orcid.org/0000-...
      cv:       ""                                // optional: link to a CV PDF, e.g. "assets/cv.pdf"
    }
  },

  /* ---- NAV (order = display order) --------------------------- */
  // `key` matches the page's <body data-page="..."> to highlight the active link.
  nav: [
    { label: "About",        href: "index.html#about",     key: "home" },
    { label: "Research",     href: "research.html",        key: "research" },
    { label: "Projects",     href: "projects.html",        key: "projects" },
    { label: "Publications", href: "publications.html",    key: "publications" },
    { label: "Honors",       href: "honors.html",          key: "honors" },
    { label: "Beyond Research", href: "beyond-research.html", key: "beyond" },
    { label: "Contact",      href: "mailto:milad.shirani@yale.edu", key: "contact" }
  ],

  /* ---- HOME: hero ------------------------------------------- */
  // headline + tagline = the site's identity (unchanged); desc = what a
  // technical visitor should learn in 15 seconds; chain = the physics-to-AI stack.
  hero: {
    headline: "Provable models, <em>physics</em> intelligence.",
    tagline: "Theory · Experiment · Computation — one pipeline from axioms to deployment.",
    desc: "I am a scientific AI researcher and ML engineer who builds computational models that combine the laws of physics with modern AI: from rigorous continuum theories and differentiable simulation to neural operators and matrix-free nonlinear solvers. My Physics AI grows out of computational mechanics, so the physics and the numerical method are the foundation of the model, not an add-on.",
    chain: ["Continuum mechanics", "FEM &amp; meshless methods", "Differentiable simulation", "Matrix-free solvers", "Neural operators", "Physics AI &amp; scientific ML"],
    cta: [
      { label: "What I Build",     href: "#build",        style: "primary" },
      { label: "Explore Research", href: "research.html", style: "ghost" },
      { label: "Get in Touch",     href: "mailto:milad.shirani@yale.edu", style: "ghost" }
    ]
  },

  /* ---- HOME: credibility strip (numbers = SITE.stats) ---------- */
  credibility: {
    label: "Foundation",
    text: "The Physics AI work rests on a research record in continuum mechanics and mathematical physics."
  },

  /* ---- PIPELINE (home section + research-page overview) --------
     `items` = the vocabulary of each stage; `links` open a research tab
     (tab: "tN") or point at an anchor / page (href).                  */
  pipeline: [
    { n: "01", title: "Theory",
      items: ["Continuum mechanics", "Thermodynamics", "Variational principles", "Stability"],
      links: [{ text: "Provable mechanics", href: "#foundation", tab: "t1" }, { text: "Cell monolayers", href: "research-cell-monolayers.html", tab: "t10" }] },
    { n: "02", title: "Simulation",
      items: ["FEM", "NEM", "Peridynamics"],
      links: [{ text: "Meshless mechanics", href: "#meshless", tab: "t9" }, { text: "Hydrogels &amp; LCEs", href: "research.html#t2", tab: "t2" }] },
    { n: "03", title: "Differentiable computation",
      items: ["Autodiff", "JVPs", "Matrix-free methods", "Newton–Krylov"],
      links: [{ text: "Differentiable FEA", href: "#differentiable-fea", tab: "t11" }, { text: "Meshless mechanics", href: "#meshless", tab: "t9" }] },
    { n: "04", title: "Physics AI",
      items: ["PINNs", "DeepONets", "FNOs"],
      links: [{ text: "Neural operators", href: "#operators", tab: "t4" }, { text: "PI-FNO", href: "research-pi-fno.html", tab: "t6" }] },
    { n: "05", title: "Deployment",
      items: ["Fast surrogate models", "Engineering prediction", "Scientific AI"],
      links: [{ text: "PI-FNO, open source", href: "research-pi-fno.html", tab: "t6" }, { text: "Startup", href: "research.html#t8", tab: "t8" }] }
  ],

  /* ---- HOME: What I Build ------------------------------------- */
  // Cards 01–03 sit on card 04, the foundation (rendered as a wide base card).
  build: [
    { num: "01", label: "Differentiable Simulation", flagship: true,
      title: "Differentiable FEA — Beyond the Stiffness Matrix",
      desc: "Matrix-free differentiable finite elements: weak-form residuals and Jacobian–vector products are evaluated through automatic differentiation, enabling Newton–Krylov solution without explicitly assembling the global stiffness matrix. A PyTorch solver for large-strain hyperelasticity, checked against FEniCSx. Alongside it: differentiable meshless peridynamics for fracture and peeling.",
      chips: ["Weak-form residual", "Automatic differentiation", "Jacobian–vector products", "Preconditioned Krylov", "Exact adjoint gradients", "Meshless peridynamics"],
      href: "#differentiable-fea", more: "Flagship project ↓" },
    { num: "02", label: "Physics AI",
      title: "Label-free, physics-constrained networks",
      desc: "Energy-minimizing PINNs and DeepONets trained on the total potential energy over FEM/NEM discretizations, with no labeled solution data and exactly enforced boundary conditions. The network is not fitted to simulation output; the physics itself provides the training signal.",
      chips: ["PINNs", "Energy minimization", "Variational principles", "Stability checks", "Exact boundary conditions", "PyTorch · JAX"],
      href: "#operators", more: "The operator work ↓" },
    { num: "03", label: "Neural Operators",
      title: "Learned maps between physical fields",
      desc: "DeepONets and Fourier neural operators for nonlinear mechanics and multiphysics. A traditional surrogate maps one input to one output; a neural operator learns a mapping between functions, fields, and physical conditions.",
      chips: ["DeepONets", "FNOs", "Nonlinear mechanics", "Multiphysics"],
      href: "#operators", more: "Operator results ↓" },
    { num: "04", label: "Provable Mechanics", base: true,
      title: "The foundation under all of it",
      desc: "Continuum mechanics and nonlinear elasticity, thermodynamically consistent constitutive modeling, and the stability theory of generalized continua. Quasiconvexity, rank-one convexity, and Legendre–Hadamard conditions are derived analytically for Cosserat media, fibrous materials, and liquid crystal elastomers, then used as validation criteria for FEA and neural-network output. The theory is written up in two graduate textbooks.",
      chips: ["Continuum mechanics", "Nonlinear elasticity", "Thermodynamics", "Stability", "Variational principles", "Constitutive modeling", "Quasiconvexity", "Rank-one convexity", "Legendre–Hadamard conditions", "Generalized continua", "Liquid crystal elastomers", "Fibrous materials"],
      href: "#foundation", more: "The foundation ↓" }
  ],
  capabilitiesLabel: "What this adds up to",
  capabilities: [
    "Building AI that understands physical systems, not AI that replaces the physics.",
    "Accelerating nonlinear simulation.",
    "Learning operators rather than individual solutions.",
    "Embedding physical laws into machine learning.",
    "Combining differentiable programming with classical numerical solvers."
  ],
  relevance: "Relevant wherever nonlinear physical systems must be simulated, differentiated, or learned: engineering simulation, materials, scientific computing, computational physics, robotics, and semiconductor manufacturing.",

  /* ---- HOME: research to product (startup) -------------------- */
  product: {
    label: "Research to product",
    lead: "Startup experience translating scientific ML into an engineering and product environment.",
    items: [
      "Co-founded an AI startup for cardiovascular disease detection from phonocardiograms; accepted into Berkeley SkyDeck Pad-13 and CITRIS Foundry 2023.",
      "Developed, benchmarked, and delivered CNN and transfer-learning heart-sound models: <strong>95% accuracy</strong> on held-out test sets.",
      "Managed the full model lifecycle, from data pipeline through evaluation, on a startup timeline.",
      "Mentored an undergraduate student in building a hardware digital stethoscope paired with the deployed model."
    ],
    href: "research.html#t8", more: "Read the startup story →"
  },

  /* ---- HOME: research-profile panel -------------------------- */
  // `stats` numbers left as-is; publication counts on the Publications
  // page are computed automatically so they never drift.
  stats: [
    { num: "2",   label: "Graduate Textbooks",   sub: "Continuum Mechanics · Plates &amp; Shells", href: "publications.html#books" },
    { num: "33",  label: "Journal Papers",       sub: "8 MSc · 22 PhD · 3 postdoc", href: "publications.html#journals" },
    { num: "5",   label: "Book Chapters",        href: "publications.html#chapters" },
    { num: "10+", label: "Years",                sub: "Physics-based simulation &amp; ML" }
  ],
  // Official totals (from the CV). The lists below hold the entries added so far;
  // the Publications page shows these totals plus a note on how many are listed.
  publicationTotals: { journal: 33, conference: 1, chapter: 5 },


  // Set hidden:true to keep an entry in the record but off the page.
  affiliations: [
    { title: "Postdoctoral Associate", org: "Yale University",
      sub: "Dept. of Biomedical Engineering · Advisor: Prof. Jay D. Humphrey" },
    { title: "PhD, Mechanical Engineering", org: "UC Berkeley",
      sub: "Advisor: Prof. David Steigmann · Minors: Mathematics &amp; Dynamics" },
    { title: "PhD Studies", org: "Pennsylvania State University", hidden: true,
      sub: "Experimental characterization of shape memory alloys · 2014–2016" },
    { title: "MSc, Mechanical Engineering", org: "Isfahan University of Technology",
      sub: "Best Thesis Award · Constitutive Modeling of Shape Memory Alloys" }
  ],

  /* ---- PROJECTS: categories + project list -------------------
     To add a project page:
       1. create research-<name>.html (copy an existing project page)
       2. add one object to SITE.projects below
     It then appears on the Projects page (filterable by category)
     and, if featured:true, in "Selected projects" on the home page.
     `cats` can hold several category ids; the first is the main one.
     A category with no projects is hidden automatically.            */
  categories: [
    { id: "theoretical-mechanics",    label: "Theoretical Mechanics" },
    { id: "computational-mechanics",  label: "Computational Mechanics" },
    { id: "physics-ai",               label: "Physics AI" },
    { id: "machine-learning",         label: "Machine Learning" },
    { id: "experimental-mechanics",   label: "Experimental Mechanics" }
  ],

  // Each project: `why` = one sentence on why it matters; `struct` = the four
  // levels (problem → method → physics & math → result); `status` = done/ongoing.
  // `inFeatures` = shown as a full block on the home page, so the home
  // "More projects" grid skips it. Order = display order.
  projects: [
    { title: "Differentiable FEA — Beyond the Stiffness Matrix", href: "research-differentiable-fea.html",
      cats: ["computational-mechanics"], year: "2026", featured: true, inFeatures: true,
      status: { kind: "done", label: "Open source · v0.1" },
      why: "Nonlinear FEA repeatedly forms and solves linearized systems with a global tangent matrix. Here that matrix is never assembled, and the whole solve stays differentiable.",
      struct: {
        problem: "Solving nonlinear finite-element problems without forming the global tangent matrix, with exact derivatives.",
        method: "Differentiable matrix-free Newton–Krylov FEA in PyTorch: automatic-differentiation Jacobian–vector products inside preconditioned conjugate gradients.",
        physics: "Weak-form mechanics: the residual and the tangent are the first and second derivatives of one strain-energy density.",
        result: "Agreement with FEniCSx/dolfinx below 10<sup>−13</sup>; 11.6× faster GPU tangent product after profiling; 10,000 Q4 elements solved in 2.9 s on a T4 GPU."
      },
      summary: "A differentiable finite element solver for large-strain hyperelasticity: matrix-free Newton–Krylov iteration, automatic differentiation, and exact adjoint sensitivities, matching FEniCSx to rounding level." },
    { title: "Differentiable Meshless Mechanics", href: "research-peridynamic-fracture.html",
      cats: ["computational-mechanics"], year: "2026", featured: true, inFeatures: true,
      status: { kind: "ongoing", label: "Ongoing · to be published" },
      why: "Fracture and delamination are awkward for mesh-based methods, which must track and remesh around the crack.",
      struct: {
        problem: "Brittle and hydraulic fracture and Mode I / mixed-mode peeling, without remeshing.",
        method: "Differentiable, autodiff-based peridynamics (JAX, PyTorch) with a matrix-free dynamic-relaxation scheme.",
        physics: "A nonlocal bond model: damage is bond breakage. Dynamic relaxation converges through unstable crack growth, where Newton–Raphson tangents turn singular.",
        result: "8–10× runtime speedup and 9.7×10<sup>−11</sup> agreement with a validated reference solution."
      },
      summary: "Meshless, differentiable simulation of fluid-induced fracture and peeling of solids, using automatic differentiation and dynamic relaxation. In collaboration with Prof. Ali Javili." },
    // [HIDDEN until the GNN paper is submitted: restore by removing the // prefixes]
    // { title: "Data-Free Physics-Constrained GNNs", href: "research-physics-constrained-gnns.html",
    // cats: ["physics-ai"], year: "2026", featured: true, inFeatures: true,
    // status: { kind: "done", label: "Demonstrated · 2 systems" },
    // why: "Coupled multiphysics problems rarely come with labeled solution data, but they always come with a weak form.",
    // struct: {
    // problem: "Transient, finite-strain coupled PDE systems (gel swelling, thermoelasticity) with no labeled solution fields.",
    // method: "Graph neural networks trained directly on the FEM weak-form residual as implicit time-steppers; the mesh is the graph; PyTorch and JAX.",
    // physics: "Shape functions, quadrature and boundary conditions are shared with FEM. Conservation laws and thermodynamic consistency enter through the weak form, and the residual is an intrinsic error measure.",
    // result: "PI-GCN: 0.24% displacement and 0.73% concentration error. PI-EPD-GNN: 0.14% displacement and 0.011% temperature error."
    // },
    // summary: "Graph neural networks that solve coupled multiphysics problems by minimizing the finite-element weak-form residual, with no labeled solution data." },
    { title: "Physics Enforced Operator Learning", href: "research-physics-enforced-operator-learning.html",
      cats: ["physics-ai"], year: "2026", featured: true, inFeatures: true,
      status: { kind: "ongoing", label: "Preprint · in progress" },
      why: "A simulator answers one load case at a time; a trained operator answers a whole load range.",
      struct: {
        problem: "Nematic elastomers: the deformation and director fields are coupled and nonlinear.",
        method: "Energy-trained neural network and DeepONet over FEM/NEM discretizations; no solution data; unit-director constraint built in.",
        physics: "Stationarity of the total potential energy is the training signal. Conditions derived from quasiconvexity (strong ellipticity, second variation) validate the output.",
        result: "~0.5–0.7 ms per query, ~35–250× faster per query than a warm FEM solve (156-node benchmark, CPU); ~0.7% (shear) and 1.6–3% (uniaxial) displacement error on unseen stretches."
      },
      summary: "Energy-trained neural networks and DeepONets, with the physics built into the architecture, for nematic liquid crystal elastomers; one trained operator returns the full deformation and director fields across a load ramp, checked against finite elements and stability conditions." },
    { title: "PI-FNO: Heart Sound Diagnosis", href: "research-pi-fno.html",
      cats: ["physics-ai"], year: "2026", featured: true,
      status: { kind: "done", label: "Open source" },
      why: "Diagnosis by auscultation has low agreement between examiners, and the acoustics of heart sounds are known well enough to build in.",
      struct: {
        problem: "Five-class valvular heart disease from raw phonocardiograms.",
        method: "A physics-informed Fourier neural operator (150 lowest modes) with a learnable physiological frequency mask; open source.",
        physics: "S1/S2 frequency bands, cardiac periodicity, and the S1 ≥ S2 energy hierarchy, built in as priors and as an inequality constraint.",
        result: "97.5% test accuracy on 1,000 recordings (CNN baseline 96.0%); Aortic Stenosis F1 = 1.00."
      },
      summary: "A Fourier neural operator with a learnable physiological frequency mask and physics-informed losses. 97.5% test accuracy on five heart conditions." },
    { title: "Dissipative Chemo-Elasticity", href: "research-dissipative-chemo-elasticity.html",
      cats: ["theoretical-mechanics", "computational-mechanics"], year: "2026", featured: true,
      status: { kind: "ongoing", label: "Theory · extension ongoing" },
      why: "Swelling gels couple large deformation to solvent transport, and that coupling has to respect the second law.",
      struct: {
        problem: "Swelling of an elastic network by water absorption, coupled to solvent transport.",
        method: "One free energy (elastic plus Flory–Huggins mixing); balance laws from virtual power; Coleman–Noll analysis.",
        physics: "The second law restricts the water-flux mobility tensor to be positive semi-definite.",
        result: "A thermodynamically consistent coupled mechanical–chemical theory; the flux restriction is directly usable in simulation."
      },
      summary: "A thermodynamically consistent theory of swelling driven by water absorption: coupled mechanical and chemical balance laws from one energy, and second-law restrictions on the flux." },
    { title: "Universal Behavior in Cell Monolayers", href: "research-cell-monolayers.html",
      cats: ["theoretical-mechanics"], year: "2026", featured: true,
      status: { kind: "done", label: "Accepted · Proc. R. Soc. A" },
      why: "A universal experimental observation, the edge effect, had no mathematical explanation.",
      struct: {
        problem: "Why cell polarization is tangential at the free edges of a monolayer.",
        method: "A Cosserat surface with a unit director; constrained first variation.",
        physics: "The condition d·ν = 0 follows from the boundary conditions alone; no constitutive law enters.",
        result: "A theorem valid for any cell type, any animal, even bacteria; accepted in Proc. R. Soc. A."
      },
      summary: "A mathematical proof that cell polarization stays tangential at free edges of a monolayer, independent of cell type, animal, and even for bacteria. Accepted in Proc. R. Soc. A." },
    { title: "Heart Disease Risk Prediction", href: "research-heart-disease-prediction.html",
      cats: ["machine-learning"], year: "2026",
      why: "A screening model is only useful if it is honest about what survey data can support.",
      labels: { physics: "Statistics" },
      struct: {
        problem: "Flag coronary heart disease risk from self-reported survey data (301,717 respondents after de-duplication).",
        method: "A leakage-safe pipeline; twelve configurations compared; CatBoost with class weighting; F2-tuned threshold.",
        physics: "Class weighting beat SMOTE for every algorithm, because interpolating binary indicators creates meaningless synthetic people.",
        result: "Test recall 0.791 at precision 0.225 (ROC-AUC 0.836): suitable for triage, not diagnosis."
      },
      summary: "A leakage-safe machine learning pipeline that flags coronary heart disease risk from self-reported survey data, with an honest look at its limits." }
  ],

  /* ---- HOME: research theme cards ---------------------------- */
  researchThemes: [
    { icon: "∇", cat: "theoretical-mechanics", title: "Nonlinear Continuum Mechanics", href: "projects.html#theoretical-mechanics", more: "See projects →",
      desc: "Cosserat, micropolar, and higher-gradient theories; Legendre–Hadamard and polyconvexity conditions for soft matter; variational methods for elastic rods, shells, and fibrous composites." },
    { icon: "μ", cat: "theoretical-mechanics", title: "Cell Migration", href: "projects.html#theoretical-mechanics", more: "See projects →",
      desc: "Thermodynamically consistent modeling of chemotaxis, durotaxis, and cell migration in fibrous substrates; lipid bilayers and biological tissues; universal edge behavior of polarized cell monolayers." },
    { icon: "ψ", cat: "computational-mechanics", title: "Soft Matter &amp; Hydrogels", href: "projects.html#computational-mechanics", more: "See projects →",
      desc: "Nematic liquid crystal elastomers, hydrogels, and swelling polymers. Thermodynamically consistent, finite-strain modeling and simulation of coupled mechanical, chemical, and orientational fields." },
    { icon: "∫", cat: "physics-ai", title: "Physics-Informed Machine Learning", href: "projects.html#physics-ai", more: "See projects →",
      desc: "PINNs, Deep Energy Methods, DeepONets, and ICNNs for constitutive modeling. Enforcing frame indifference, polyconvexity, and Legendre–Hadamard stability as hard constraints in neural architectures." },
    { icon: "𝒢", cat: "physics-ai", title: "Neural Operators", href: "projects.html#physics-ai", more: "See projects →",
      desc: "Fourier neural operators and DeepONets for nonlinear mechanics and multiphysics, validated against finite-element solutions." },
    { icon: "∂", cat: "computational-mechanics", title: "Computational Mechanics &amp; Differentiable Simulation", href: "projects.html#computational-mechanics", more: "See projects →",
      desc: "FEniCSx and custom finite element codes for hyperelasticity, fracture, and swelling. Differentiable, matrix-free solvers (Newton–Krylov, dynamic relaxation) in PyTorch and JAX, and meshless peridynamics." },
    { icon: "⌬", cat: "experimental-mechanics", title: "Experimental Mechanics", href: "projects.html#experimental-mechanics", more: "See projects →",
      desc: "DIC and strain-gauge characterization of composites; photoelastic full-field stress mapping; DSC thermal analysis and tensile testing of shape memory alloys; magnetomechanical experiments on FSMAs." },
    { icon: "♡", cat: "machine-learning", title: "Cardiovascular AI Startup", href: "projects.html#machine-learning", more: "See projects →",
      desc: "Co-founded AI venture (UC Berkeley SkyDeck Pad-13, CITRIS Foundry 2023) for automated heart disease detection from phonocardiograms. CNN + transfer learning achieving 95% test accuracy." }
  ],

  /* ---- HOME: timeline ---------------------------------------- */
  journey: [
    { years: "2010 – 2013", title: "MSc · Isfahan University of Technology",
      sub: "Constitutive modeling of shape memory alloys and magnetic shape memory alloys. 8 publications, Best Thesis Award. Combined experiment, theory, and numerical validation." },
    { years: "2014 – 2016", title: "Penn State University", hidden: true,
      sub: "Experimental characterization of shape memory alloys. Transitioned to UC Berkeley to pursue research in theoretical mechanics." },
    { years: "2016 – 2023", title: "PhD · UC Berkeley · Dept. of Mechanical Engineering",
      sub: "Advisor: Prof. David Steigmann. Minors in Mathematics and Dynamics. Co-authored two graduate textbooks on continuum mechanics and theories of plates &amp; shells. 22 journal papers and 5 book chapters. Derived stability conditions (Legendre–Hadamard, rank-one convexity, quasiconvexity) for Cosserat media, fibrous materials, and liquid crystal elastomers." },
    { years: "2022 – 2023", title: "Co-Founder &amp; ML Engineer — Berkeley AI Startup",
      sub: "Co-founded cardiovascular AI startup accepted into UC Berkeley SkyDeck Pad-13 and CITRIS Foundry 2023. Built CNN + transfer learning models for multi-class heart sound classification achieving 95% accuracy. Mentored undergraduate hardware development." },
    { years: "2023 – Present", title: "Postdoctoral Associate · Yale University",
      sub: "Advisor: Prof. Jay D. Humphrey. Biomedical Engineering. 3 publications. Research on fibrous tissues, thermodynamically consistent chemotaxis, fracture, differentiable simulation with matrix-free solvers, and physics-informed neural networks and operators for soft matter." }
  ],

  /* ---- RESEARCH: intro + philosophy -------------------------- */
  researchIntro: "<strong>Physics is the foundation of the AI, not a separate topic.</strong> My research is driven by a single conviction: that a deep understanding of physical systems demands mathematical rigor, experimental honesty, and computational power working together. From the thermodynamics of a swelling hydrogel to the stability conditions of a fiber-reinforced elastic solid, from the migration of cells on a soft substrate to the design of neural networks that provably satisfy the laws of mechanics — each project begins with the same question: <em>what does the physics actually require?</em>",
  philosophy: {
    quote: "\"The laws of nature produce the data, not the other way around. My models <em>obey</em> those laws; they do not imitate them.\"",
    attr:  "Research Philosophy · M. Shirani"
  },

  /* ---- RESEARCH TABS ----------------------------------------- */
  // Optional per tab: `lead` (short summary shown first; the full `body` then
  // sits in a collapsed "technical account"), `status` ({completed, ongoing,
  // next} lists).
  // To add a tab: copy one block, give it a new id + roman numeral.
  // Tab button + panel are generated together — no need to edit two places.
  researchTabs: [
    {
      id: "t1", cat: "theoretical-mechanics", num: "I", label: "Continuum Mechanics<br>&amp; Stability",
      title: "Nonlinear Continuum Mechanics &amp; Stability Theory",
      levels: {
        problem: "Which deformation states of a nonlinear, generalized continuum can be stable energy minimizers?",
        method: "Analytical derivation of necessary conditions (Legendre–Hadamard, rank-one convexity, quasiconvexity) for Cosserat media, fiber-reinforced solids and shells, and liquid crystal elastomers.",
        physics: "Variational principles. The acoustic tensor of a Cosserat medium couples translational and rotational degrees of freedom.",
        result: "Closed-form stability conditions for these material classes, including a coupled Legendre–Hadamard inequality for fiber-reinforced shells. They serve as validation criteria for FEA and neural-network output."
      },
      body: [
        "My doctoral work, carried out under Prof. David Steigmann at UC Berkeley, established a systematic framework for stability analysis in generalized continua. The central objects of study were the Legendre–Hadamard condition, rank-one convexity, and quasiconvexity — necessary conditions for energy minimizers that govern whether a body can sustain localized failure modes such as shear bands or surface instabilities.",
        "In classical elasticity these conditions are well understood, but for <em>Cosserat media</em> — where material points carry both position and orientation — the analysis is fundamentally richer. The acoustic tensor acquires a block structure, coupling the translational and rotational degrees of freedom, and the admissible wave speeds depend on both the elastic and couple-stress moduli. I derived these conditions analytically for Cosserat solids, lattice structures, fiber-reinforced materials with one, two, and three fiber families, liquid crystal elastomers, and elastic shells with intrinsic fiber bending and twist stiffness. A key contribution was proving the <em>coupled</em> Legendre–Hadamard inequality for fiber-reinforced shells, where the fiber's own Kirchhoff-rod energy interacts with the shell's membrane-bending response.",
        "More recently, I showed that fibrous biological tissues simultaneously exhibit <em>strain-gradient</em> and <em>Cosserat</em> effects — a consequence of the finite thickness and curvature of individual fibers — and that this dual nonlocality can produce macroscopic Poynting effects with no classical analogue."
      ],
      keyPoints: [
        "Analytical Legendre–Hadamard conditions for Cosserat elasticity, fiber-reinforced solids, and elastic shells",
        "Quasiconvexity and rank-one convexity in Cosserat models for lattice and fiber-reinforced materials",
        "Maxwell–Eshelby relation and its generalization in Cosserat and 6-parameter shell theories",
        "Mixed Cosserat/strain-gradient formulation for fibrous tissues; prediction of Poynting effects",
        "Elastic-plastic response of hemitropic Cosserat solids"
      ],
      links: [ { text: "Article · Coming Soon", comingSoon: true } ]
    },
    {
      id: "t11", cat: "computational-mechanics", num: "XI", label: "Differentiable<br>FEA",
      title: "Differentiable FEA — Beyond the Stiffness Matrix",
      levels: {
        problem: "Solving nonlinear finite-element problems without forming the global tangent matrix, with exact derivatives.",
        method: "Differentiable matrix-free Newton–Krylov FEA in PyTorch: automatic-differentiation Jacobian–vector products inside preconditioned conjugate gradients.",
        physics: "Weak-form mechanics: the residual and the tangent are the first and second derivatives of one strain-energy density.",
        result: "Agreement with FEniCSx/dolfinx below 10<sup>−13</sup>; 11.6× faster GPU tangent product after profiling; 10,000 Q4 elements solved in 2.9 s on a T4 GPU."
      },
      body: [
        "Traditional nonlinear FEA repeatedly forms and solves large linearized systems involving a global stiffness (Jacobian) matrix. My approach evaluates the weak-form residual directly and obtains Jacobian–vector products through automatic differentiation, which enables a matrix-free Newton–Krylov solution. The solver is written in purely functional PyTorch, and each Newton step is solved inexactly by preconditioned conjugate gradients (Jacobi or block-Jacobi), using only Jacobian–vector products.",
        "A linear system is still solved at every Newton step; what is avoided is assembling and storing the global matrix. Design gradients follow from the implicit function theorem with one extra linear solve, so the solver can be placed inside optimization and learning loops. Solutions match FEniCSx/dolfinx to rounding level, and a 10,000-element Q4 problem solves in 2.9 s on a T4 GPU.",
        "<strong>Scope.</strong> This is an early release (v0.1) for 2D plane strain. On a CPU in 2D, an assembled sparse matrix is still faster per product; the matrix-free advantage is expected for high-order elements, 3D, and GPU memory, and has not been measured there yet."
      ],
      keyPoints: [
        "Matrix-free inexact Newton–Krylov iteration; Q4, Q8, Q9, Tri3 and Tri6 elements, several hyperelastic laws",
        "Exact adjoint sensitivities by the implicit function theorem, checked against finite differences",
        "Agreement with FEniCSx to rounding level; cantilever and plate-with-hole benchmarks within 1-3% of theory",
        "11.6× faster GPU tangent product from an element-wise operator variant (40,000 Q4 elements, T4); 10,000 Q4 elements solved in 2.9 s; 194 automated tests"
      ],
      status: {
        completed: [
          "Version 0.1 released as open source (PyTorch)",
          "Validated against FEniCSx/dolfinx and analytic beam and Kirsch/Heywood solutions",
          "Exact adjoint sensitivities, checked against finite differences"
        ],
        next: [
          "3D elements, where matrix-free methods and GPUs are expected to pay off",
          "Scalable preconditioning (p-multigrid) and distributed, multi-GPU execution",
          "Plasticity and contact"
        ]
      },
      links: [
        { text: "Read · Differentiable FEA", href: "research-differentiable-fea.html" },
        { text: "GitHub · Differentiable-FEA Repository", href: "https://github.com/miladshirani/Differentiable-FEA", external: true }
      ]
    },
    {
      id: "t9", cat: "computational-mechanics", num: "IX", label: "Differentiable<br>Meshless Mechanics",
      title: "Differentiable Meshless Mechanics: Peridynamic Fracture &amp; Peeling",
      levels: {
        problem: "Brittle and hydraulic fracture and Mode I / mixed-mode peeling, without remeshing or crack-tracking rules.",
        method: "Differentiable, autodiff-based meshless peridynamics (JAX, PyTorch) with a matrix-free dynamic-relaxation scheme.",
        physics: "A nonlocal bond model: damage is bond breakage. Dynamic relaxation converges through unstable crack growth, where Newton–Raphson tangents turn singular.",
        result: "8–10× runtime speedup and 9.7×10<sup>−11</sup> agreement with a validated reference solution. In collaboration with Prof. Ali Javili; results to be published."
      },
      body: [
        "We have implemented brittle fracture, fluid-induced (hydraulic) fracture, and delamination (the Mode I and mixed-mode peeling test) using <em>peridynamics</em>, a nonlocal, meshless continuum theory in which material points interact through bonds within a finite horizon. Cracks nucleate and propagate as bonds break, with no remeshing and no crack-tracking rules.",
        "The framework is differentiable through automatic differentiation in JAX and PyTorch, and equilibrium is computed with a matrix-free dynamic relaxation scheme, which avoids the singular tangents that stall Newton–Raphson during unstable crack propagation. The solver reaches an 8–10× runtime speedup and 9.7×10<sup>−11</sup> agreement with a validated reference solution; the full study will be published soon. This is a collaboration with <a href=\"https://www.nahalab.com/\" target=\"_blank\" rel=\"noopener\">Prof. Ali Javili</a> (Bilkent University)."
      ],
      keyPoints: [
        "Brittle fracture, hydraulic fracture, and delamination (Mode I / mixed-mode peel) without remeshing",
        "Differentiable via automatic differentiation in JAX and PyTorch",
        "Matrix-free dynamic relaxation, to converge through unstable crack propagation where Newton–Raphson tangents turn singular",
        "8–10× runtime speedup and 9.7×10<sup>−11</sup> agreement with a validated reference solution"
      ],
      links: [ { text: "Read · Differentiable Meshless Mechanics", href: "research-peridynamic-fracture.html" } ]
    },
    {
      id: "t2", cat: "computational-mechanics", num: "II", label: "Soft Matter:<br>Hydrogels &amp; LCEs",
      title: "Soft Matter: Hydrogels, Polymers &amp; Liquid Crystal Elastomers",
      levels: {
        problem: "Large-strain swelling gels and liquid crystal elastomers, whose deformation is coupled to chemical or orientational fields.",
        method: "Variational continuum models and Coleman–Noll analysis; energy-minimizing neural networks trained over FEM/NEM discretizations (see operator learning).",
        physics: "One free energy (elastic plus Flory–Huggins mixing) gives the mechanical and chemical balance laws; the second law restricts the flux; Legendre–Hadamard conditions govern stability under deformation and director perturbations.",
        result: "The water-flux mobility tensor must be positive semi-definite; stability conditions for nematic LCEs, used as validation criteria for neural models of the same materials."
      },
      body: [
        "Soft materials present a distinct class of challenges: they undergo large, geometrically nonlinear deformations; they often couple mechanical response to chemical, thermal, or electromagnetic fields; and their constitutive behavior is governed by entropy as much as by internal energy. My work in this area addresses both the mathematical structure of such coupled theories and their computational implementation.",
        "For hydrogels, I developed a thermodynamically consistent continuum model for swelling driven by water absorption, grounding the Flory–Huggins mixing energy within a variational framework and deriving the coupled mechanical and chemical balance laws via the principle of virtual power. The Coleman–Noll procedure shows that the reduced dissipation inequality constrains the water-flux mobility tensor to be positive semi-definite — a result that is both physically necessary and computationally actionable. The model is currently being extended to biological tissues and to delamination problems in layered hydrogel systems.",
        "For <em>nematic liquid crystal elastomers</em> (LCEs), where a rubber-like polymer network is coupled to an orientational order parameter \\( \\boldsymbol{n} \\), I derived the Legendre–Hadamard inequalities governing stability with respect to both deformation and director-field perturbations. I then used these as validation criteria — rather than loss-function penalties — when training physics-consistent neural networks to predict the deformation and director fields. This distinction matters: a loss penalty can be violated during inference, while an architectural constraint cannot."
      ],
      keyPoints: [
        "Variational continuum model for hydrogel swelling; thermodynamic restrictions on the water flux",
        "Stability conditions for nematic LCEs under coupled mechanical-orientational perturbations",
        "Deep Energy Method for LCEs: two coupled MLPs for deformation and director fields, validated against FEA",
        "Variational and data-driven DeepONets for nematic materials",
        "Wrinkling of incompressible anisotropic sheets with wavy fibers"
      ],
      links: [
        { text: "Read · Dissipative Chemo-Elasticity", href: "research-dissipative-chemo-elasticity.html" },
        { text: "See · Physics Enforced Operator Learning", href: "research-physics-enforced-operator-learning.html" }
      ]
    },
    {
      id: "t3", cat: "theoretical-mechanics", num: "III", label: "Cell<br>Migration",
      title: "Cell Migration",
      levels: {
        problem: "Collective cell migration under chemical gradients, substrate stiffness, and tension.",
        method: "A thermodynamically consistent continuum framework covering chemotaxis, durotaxis, and taxis toward tension; a Cosserat-surface analysis of polarity at free boundaries.",
        physics: "Second-law consistency. The Keller–Segel chemotaxis model violates it, and a corrected formulation is given.",
        result: "Proof that the Keller–Segel model is thermodynamically inconsistent, a corrected model, and the universal tangentiality of polarity at free edges (accepted, Proc. R. Soc. A)."
      },
      body: [
        "At Yale, working with Prof. Jay D. Humphrey, my research has focused on the mechanics of living soft matter — fibrous biological tissues, cell monolayers, lipid bilayers, and hydrogel scaffolds. These systems are distinguished by their capacity for active response, growth, remodeling, and self-organization, phenomena that classical passive elasticity cannot capture.",
        "I developed a continuum model for collective cell migration driven by <em>chemotaxis</em> (response to chemical gradients), <em>durotaxis</em> (response to substrate stiffness), and <em>taxis</em> toward tension, unifying these into a single thermodynamically consistent framework applicable to multiple cell families and chemoattractants simultaneously. A significant theoretical finding was demonstrating that the Keller–Segel chemotaxis model — widely used in mathematical biology — violates thermodynamic consistency, and providing a corrected formulation.",
        "A separate line of work concerned the geometry of cell polarization near free boundaries. I proved that in any polarized cell monolayer, the polarity vector must remain tangential to free boundaries — a result that is <em>universal</em> in the sense that it depends only on the boundary geometry and the continuity of the polarity field, not on the specific constitutive model for polarization dynamics.",
        "Earlier work at Berkeley addressed the equilibrium mechanics of lipid bilayers, including asymmetric and tilted bilayers and bilayers with a conforming cytoskeletal membrane, where the coupling between membrane curvature and cytoskeletal tension produces nontrivial shape transitions."
      ],
      keyPoints: [
        "Thermodynamically consistent model for collective cell migration under chemo-mechanical stimuli",
        "Proof of thermodynamic inconsistency in the Keller–Segel model; corrected continuum formulation",
        "Universal tangentiality of cell polarity at free boundaries of cell monolayers",
        "Equilibrium theory for asymmetric tilted lipid bilayers and bilayers with cytoskeletal coupling",
        "Finite elastic deformations of incompressible fiber-reinforced biological plates"
      ],
      links: [
        { text: "Article · Cell Migration Model — Coming Soon", comingSoon: true },
        { text: "Article · Cell Polarity at Boundaries — Coming Soon", comingSoon: true }
      ]
    },
    {
      id: "t10", cat: "theoretical-mechanics", num: "X", label: "Universal Behavior:<br>Cell Monolayers",
      title: "Proof of a Universal Behavior in Cell Biology",
      levels: {
        problem: "Why cell polarization is tangential at the free edges of a monolayer, for any cell type.",
        method: "A Cosserat surface with a unit director; constrained first variation with Lagrange multipliers.",
        physics: "The condition d·ν = 0 follows from the boundary conditions with no constitutive assumption; Legendre–Hadamard inequalities for the problem.",
        result: "A theorem valid for any cell type, any animal, even bacteria. Accepted in Proceedings of the Royal Society A."
      },
      body: [
        "Cells at the free edge of a polarized monolayer align tangentially to the edge. Using Cosserat elasticity for a planar unit director, I proved this mathematically: the condition \\( \\boldsymbol{d}\\cdot\\boldsymbol{\\nu}_t=0 \\) follows from the boundary conditions without any constitutive assumption, so it holds regardless of cell type, animal, or even for bacteria. The work, with J. D. Humphrey, is accepted in <em>Proceedings of the Royal Society A</em> for the special issue in honor of Prof. K. R. Rajagopal.",
        "I also obtained Legendre–Hadamard inequalities for the problem. Loss of ellipticity marks the bifurcation at which defects and patterns form, and it is the key to shape programming of living surfaces."
      ],
      keyPoints: [
        "Edge effect proved for any constitutive law: polarization stays tangential to free boundaries",
        "Independent of cell type, animal, and valid for bacteria",
        "Legendre–Hadamard inequalities; loss of ellipticity and shape programming"
      ],
      links: [ { text: "Read · Proof of a Universal Behavior in Cell Biology", href: "research-cell-monolayers.html" } ]
    },
    {
      id: "t5", cat: "theoretical-mechanics", num: "V", label: "Shape Memory<br>Alloys &amp; FSMAs",
      title: "Shape Memory Alloys &amp; Ferromagnetic Smart Materials",
      levels: {
        problem: "Constitutive models of shape memory and ferromagnetic shape memory alloys that respect the second law.",
        method: "Thermodynamic analysis; 3-D transformation and reorientation surfaces; single-reference calibration; purpose-built thermomechanical and magnetomechanical experiments.",
        physics: "The second law of thermodynamics, with loading history entering the transformation criterion.",
        result: "Proof that phase-diagram models (including Brinson 1993) violate the second law; one calibration reproduced 12 datasets; biaxial-compression pseudoelasticity predicted, then confirmed experimentally 18 months later."
      },
      body: [
        "My earliest research, carried out during my MSc at Isfahan University of Technology, focused on the constitutive modeling of shape memory alloys (SMAs) and ferromagnetic shape memory alloys (FSMAs), also referred to as magnetic shape memory alloys (MSMAs). SMAs such as NiTi memorize a reference shape and recover it upon heating through a reversible martensitic phase transition between austenite and martensite. Their applications range from medical devices and aerospace actuators to shock absorbers. FSMAs extend this behavior: in the martensitic phase, an applied magnetic field drives <em>martensite variant reorientation</em>, producing large inelastic strains without thermal cycling.",
        "<strong>Thermodynamic consistency of SMA phase diagrams.</strong> The dominant modeling paradigm at the time relied on phase diagrams in stress-temperature space to determine when transformation initiates and completes. I showed that this class of models — including the widely used Brinson (1993) model — violates the second law of thermodynamics. The argument was constructive: I designed a thought experiment involving a sequence of <em>interrupted phase transformations</em> and showed that, in the limit as the number of interruptions tends to infinity, phase-diagram-based models predict that transformation ends without the phase fraction satisfying the completion condition. This paradox arises because such models exclude loading history from the transformation initiation criterion, which is thermodynamically inadmissible. I designed and carried out multiple thermomechanical experiments to confirm the discrepancy between model predictions and physical behavior.",
        "<strong>Corrected 3-D transformation surfaces and continuation conditions.</strong> Enforcing the second law of thermodynamics, I generalized the conventional 2-D phase diagrams in stress-temperature space to 3-D <em>transformation surfaces</em> in stress-temperature-loading history space. On these surfaces the loading history is encoded in the surface's evolution, so the transformation-start criterion properly depends on the accumulated thermomechanical path. I further exploited the geometric fact that the gradient of a surface is normal to it: this constraint yields explicit <em>transformation continuation conditions</em> — inequalities that must hold throughout an ongoing transformation. Their violation signals an elastic regime in which the inelastic contribution of phase transformation is inactive.",
        "<strong>Ferromagnetic SMAs: unique parameter calibration.</strong> A critical shortcoming of existing FSMA models was that their parameters could not be determined uniquely without curve-fitting to each individual experiment — making predictions for new loading protocols unreliable. I proposed a systematic calibration procedure that extracts all model parameters from a single reference experiment. To demonstrate generality, I calibrated the model once and reproduced 12 independent experimental datasets without recalibration. Enforcing the second law, I then derived a constitutive relation for the coupled magneto-mechanical response of these alloys under general magnetomechanical loading, and, mirroring the SMA approach, introduced both 2-D reorientation diagrams and their 3-D generalizations — together with the corresponding <em>reorientation start and continuation conditions</em>. All predictions were validated against purpose-designed magnetomechanical tests.",
        "<strong>Biaxial compression and theoretically predicted pseudoelasticity.</strong> Using thermodynamic arguments alone, I predicted that FSMAs subjected to biaxial compressive stress should exhibit inelastic behavior from variant reorientation, with hysteresis and pseudoelasticity whose character depends on the magnitude of the transverse stress component. At the time, no experimental data existed to validate this prediction, and I was unable to publish the result. Eighteen months later, an independent experimental paper appeared observing precisely the behavior I had forecast — enabling publication and providing post-hoc validation of the thermodynamic approach."
      ],
      keyPoints: [
        "Proved thermodynamic inconsistency of phase-diagram-based SMA models via an interrupted-transformation thought experiment; validated with thermomechanical experiments",
        "Generalized 2-D phase diagrams in stress-temperature space to 3-D transformation surfaces in stress-temperature-loading history space; derived continuation conditions from surface-gradient geometry",
        "Unique parameter calibration for FSMA constitutive models; single calibration reproduces 12 experimental datasets",
        "3-D reorientation surfaces and continuation conditions for magnetically driven martensite variant reorientation in FSMAs",
        "Theoretical prediction — confirmed experimentally 18 months later — of hysteresis and pseudoelasticity in Ni-Mn-Ga FSMAs under biaxial compression",
        "Designed and executed thermomechanical and magnetomechanical experiments for model validation",
        "8 publications (7 journals + 1 conference); Best Graduate Thesis Award, Isfahan University of Technology (2014)"
      ],
      links: [ { text: "Articles · SMA &amp; FSMA Constitutive Modeling — See Publications", comingSoon: true } ]
    },
    {
      id: "t4", cat: "physics-ai", num: "IV", label: "Physics-Informed<br>Machine Learning",
      title: "Physics-Informed Machine Learning &amp; Neural Constitutive Models",
      levels: {
        problem: "Neural models that cannot violate the mechanics they describe, and that do not depend on labeled solution data.",
        method: "Polyconvex ICNN energies; energy-trained PINNs and DeepONets over FEM/NEM discretizations (PyTorch, JAX).",
        physics: "Frame indifference, material symmetry, and polyconvexity built into the architecture; variational (total-energy) training; Legendre–Hadamard checks on the output.",
        result: "One DeepONet benchmark ~35–250× faster per query than a warm FEM solve at ~0.7–3% displacement error; polyconvexity conditions proved analytically for fibrous tissues with two fiber families."
      },
      body: [
        "The convergence of mechanics and machine learning opens a genuinely new frontier — not merely fitting data faster, but building computational models that are constrained by physical law from the ground up. My work in this area is grounded in the conviction that the laws of mechanics are not soft regularizers to be traded against data fit; they are hard constraints that any admissible model must satisfy exactly.",
        "For hyperelastic constitutive modeling, I develop neural networks whose outputs are guaranteed to satisfy <em>frame indifference</em>, <em>material symmetry</em>, and the <em>Legendre–Hadamard condition</em> — not by penalizing violations during training, but by architectural design. Input Convex Neural Networks (ICNNs) provide polyconvex energy densities by construction. For fibrous biological tissues with two fiber families, I have proved analytically the polyconvexity conditions that existing approaches verify only numerically — a distinction that matters for guaranteeing stability at <em>any</em> deformation state, not just those seen during training.",
        "For operator learning — mapping loading conditions to full displacement or director fields — I work with Deep Operator Networks (DeepONets) and Physics-Informed Neural Networks (PINNs), enforcing the governing PDEs either through the loss function or directly in the architecture. Most recently, I trained physics-consistent neural networks for microstructured media (Cosserat continua) where both the deformation gradient \\( \\boldsymbol{F} \\) and the director field \\( \\boldsymbol{d} \\) are learned simultaneously, with the Legendre–Hadamard tensor retained in the computational graph for post-training stability verification.",
        // [HIDDEN until the GNN paper is submitted]
        // "<strong>Physics-constrained GNNs.</strong> For coupled multiphysics, I train graph neural networks as implicit time-steppers by minimizing the finite-element weak-form residual directly, with no labeled solution data. The graph is the mesh (or its Voronoi dual), and the network shares shape functions, quadrature, and boundary conditions with the finite-element solver, so the weak-form residual doubles as an error monitor. The method is demonstrated on finite-strain gel swelling (four coupled fields) and on thermoelasticity, against Newton–Raphson reference solutions.",
        "<strong>An active research direction.</strong> I am building end-to-end differentiable scientific-computing pipelines in JAX and PyTorch that connect weak-form physics, automatic differentiation, nonlinear solvers, and neural models, combining custom finite element solvers, neural constitutive models, and neural surrogates. The components exist and are validated one by one (see the status below). Applications such as soft robotics, surgical simulation, and materials design are the longer-term motivation, not results."
      ],
      keyPoints: [
        "Deep Energy Method for nematic LCEs with LH conditions as architectural constraints",
        "Physics-consistent neural networks for Cosserat media; LH verification in the computational graph",
        "Analytical proof of polyconvexity conditions for fibrous tissues with two fiber families",
        "Variational and data-driven DeepONets for nematic materials",
        // [hidden] "Physics-informed GNNs (PI-GCN, PI-EPD-GNN) trained on the FEM weak-form residual with no labeled data; final-state errors of 0.011–0.73% against Newton–Raphson FEM",
        "Differentiable FEA in JAX: T3/Q9 elements, Neo-Hookean and SVK materials, autodiff tangent stiffness",
        "Differentiable FEA in PyTorch: matrix-free Newton–Krylov with exact adjoint sensitivities (open source)"
      ],
      statusLabel: "Where the pipeline stands",
      status: {
        completed: [
          "Energy-trained neural networks and DeepONets for nematic LCEs, checked against FEM and stability conditions (arXiv:2603.06939)",
        // [hidden] "Physics-informed GNNs for gel swelling and thermoelasticity, compared node by node with FEM",
          "Open-source matrix-free differentiable FEA solver, validated against FEniCSx",
          "PI-FNO, open source"
        ],
        ongoing: [
          "Connecting solver, neural constitutive models, and neural surrogates into end-to-end differentiable pipelines",
          "DeepONet operator learning for LCEs (work in progress)",
          "Differentiable peridynamics: results to be published"
        ],
        next: [
          "Operators over geometry, boundary conditions, and material, not only load",
          "3D elements, scalable preconditioning, and multi-GPU execution for the solver",
          "Applications: soft robotics, surgical simulation, materials design"
        ]
      },
      links: [
        // [hidden] { text: "Read · Physics-Constrained GNNs", href: "research-physics-constrained-gnns.html" },
        { text: "Read · Differentiable FEA", href: "research-differentiable-fea.html" },
        { text: "Article · ICNN Constitutive Models — Coming Soon", comingSoon: true }
      ]
    },
    {
      id: "t6", cat: "physics-ai", num: "VI", label: "PI-FNO: Cardiac<br>Acoustics",
      title: "PI-FNO: Physics-Informed Neural Operators for Cardiac Acoustics",
      levels: {
        problem: "Five-class valvular heart disease classification from raw phonocardiograms.",
        method: "A Fourier neural operator (150 lowest modes) with a learnable physiological frequency mask and physics-informed losses; open source.",
        physics: "S1/S2 frequency bands (25–45 Hz, 50–70 Hz), heart-rate periodicity, and the S1 ≥ S2 energy hierarchy as an inequality constraint.",
        result: "97.5% test accuracy on 1,000 recordings against 96.0% for a CNN baseline; Aortic Stenosis F1 = 1.00."
      },
      body: [
        "The same design principles that govern physics-consistent constitutive modeling in continuum mechanics — encoding known structure as inductive biases, enforcing inequalities as hard or hinge constraints, and using interpretable learned parameters — transfer naturally to biomedical signal classification. This project applies that philosophy to the automated diagnosis of valvular heart disease from raw phonocardiogram (PCG) recordings.",
        "The primary model is a <em>Fourier Neural Operator (FNO)</em> operating directly on raw waveforms, with physiological structure encoded at three levels. First, a learnable <em>physiological frequency mask</em> is initialized from known S1 (25-45 Hz) and S2 (50-70 Hz) cardiac sound bands and parameterized in logit space to keep weights in \\( (0,1) \\). Second, spectral convolutions retain only the \\( M = 150 \\) lowest Fourier modes — a band-limited inductive bias matching the sub-1 kHz frequency content of cardiac acoustics. Third, the training loss augments cross-entropy with two physiologically motivated terms: a <em>periodicity loss</em> penalizing energy away from heart-rate harmonics, and a <em>frequency hierarchy loss</em> enforcing \\( E_{S1} \\geq E_{S2} \\) via a hinge penalty — directly analogous to Legendre–Hadamard enforcement in hyperelastic constitutive modeling.",
        "The model classifies five clinically distinct conditions — Aortic Stenosis, Mitral Regurgitation, Mitral Stenosis, Mitral Valve Prolapse, and Normal — from 1,000 PCG recordings. The FNO achieves <strong>97.5% test accuracy</strong> (against 96.0% for a CNN baseline) with perfect classification of Aortic Stenosis (F1 = 1.00). After training, the learned mask weights autonomously recover the S1/S2 bands while also discovering additional murmur-frequency modes — providing direct clinical interpretability with no post-hoc attribution required."
      ],
      keyLabel: "Key Results",
      keyPoints: [
        "97.5% five-class test accuracy on 1,000 PCG recordings (AS / MR / MS / MVP / Normal)",
        "Perfect Aortic Stenosis classification (F1 = 1.00, against 0.90 for the CNN); hardest class MR at F1 = 0.92",
        "Learnable physiological frequency mask autonomously recovers S1 and S2 bands post-training",
        "Hinge-form frequency hierarchy loss enforces \\( E_{S1} \\geq E_{S2} \\) — exact analogue of LH inequality enforcement in mechanics",
        "Well-separated t-SNE clusters for all five classes; Normal class clearly isolated from the pathologies"
      ],
      table: {
        label: "Performance Summary",
        head: ["Model", "Val Acc", "Test Acc", "Convergence"],
        rows: [
          { cells: ["FNO (physio-constrained)", "98.50%", "<strong>97.50%</strong>", "Epoch 40"], highlight: true },
          { cells: ["CNN Baseline (Mel spectrogram)", "99.50%", "<strong>96.00%</strong>", "Epoch 30"] }
        ]
      },
      links: [
        { text: "Read · PI-FNO for Cardiac Disease Detection", href: "research-pi-fno.html" },
        { text: "GitHub · PI-FNO Repository", href: "https://github.com/miladshirani/PI-FNO", external: true },
        { text: "Article · Coming Soon", comingSoon: true }
      ]
    },
    {
      id: "t7", cat: "experimental-mechanics", num: "VII", label: "Experimental<br>Mechanics",
      title: "Experimental Mechanics",
      levels: {
        problem: "Grounding and validating theoretical and computational models with measurements.",
        method: "Strain gauges and digital image correlation on composites; thermomechanical and magnetomechanical testing of SMAs and FSMAs; DSC; photoelasticity.",
        physics: "Full-field strain and stress measurements compared with analytical and numerical predictions.",
        result: "Full-field strain maps resolving failure initiation sites and tensile strength bounds; experiments confirming thermodynamic predictions for shape memory alloys."
      },
      body: [
        "Alongside my theoretical and computational work, I have designed and executed experimental programs in structural mechanics, smart materials, and composite failure — grounding analytical predictions in physical measurement and providing the experimental baselines against which models are validated.",
        "<strong>Composites — strain gauges and Digital Image Correlation (DIC).</strong> Tensile failure in carbon fiber and fiberglass composites involves localized strain concentrations that coupon-average measurements cannot resolve. To characterize failure initiation sites and tensile strength under combined loading with full-field ground truth, I designed and executed tensile failure tests on composite specimens, instrumented with strain gauges for local strain measurement at anticipated failure sites, and deployed DIC for simultaneous full-field strain mapping. I designed acceptance criteria and loading protocols to isolate failure modes and avoid confounding effects. The result was full-field strain maps resolving failure initiation sites and tensile strength bounds under combined loading, with model predictions validated directly against experimental ground truth.",
        "<strong>Shape memory alloys — thermomechanical and magnetomechanical testing.</strong> During my MSc at Isfahan University of Technology, I designed and executed thermomechanical experiments to characterize phase transformation behavior in NiTi SMAs — including interrupted transformation sequences that exposed the thermodynamic inconsistency of existing phase-diagram-based models — and magnetomechanical tests on Ni-Mn-Ga FSMAs to validate constitutive models for magnetically driven martensite variant reorientation. I also performed DSC thermal characterization to measure phase transformation temperatures and stresses under varying thermal histories, and tensile testing on iron-based SMA specimens.",
        "<strong>Photoelastic stress analysis.</strong> I conducted photoelastic experiments for full-field stress distributions in complex-geometry specimens, obtaining fringe patterns validated against analytical and numerical model predictions under small-strain deformation — reinforcing the complementarity between experimental observation and theoretical modeling."
      ],
      keyPoints: [
        "Tensile failure characterization of carbon fiber and fiberglass composites via strain gauges and DIC; full-field strain maps resolving failure initiation sites and tensile strength bounds",
        "Thermomechanical experiments on NiTi SMAs exposing thermodynamic inconsistency of phase-diagram models",
        "Magnetomechanical testing of Ni-Mn-Ga FSMAs; validated reorientation constitutive models including biaxial compression predictions",
        "DSC thermal characterization and tensile testing of iron-based SMA specimens",
        "Photoelastic full-field stress mapping in complex geometries; validated against small-strain model predictions"
      ],
      links: [ { text: "Publications — See SMA &amp; FSMA Tab", comingSoon: true } ]
    },
    {
      id: "t8", cat: "machine-learning", num: "VIII", label: "Cardiovascular<br>AI Startup",
      title: "Cardiovascular AI Startup — UC Berkeley",
      levels: {
        problem: "Automated cardiovascular disease detection from phonocardiograms, on a startup timeline.",
        method: "CNN with transfer learning; the full model lifecycle from data pipeline through evaluation; a hardware digital stethoscope built by a mentored undergraduate student.",
        physics: "Heart-sound acoustics (S1/S2), which later became the physical prior in PI-FNO.",
        result: "95% accuracy on held-out test sets; accepted into Berkeley SkyDeck Pad-13 and CITRIS Foundry 2023."
      },
      body: [
        "During the final year of my PhD at UC Berkeley, I co-founded an AI startup focused on the automated detection of cardiovascular disease from phonocardiogram (PCG) recordings. The startup was accepted into two competitive Berkeley incubator programs: <strong>UC Berkeley SkyDeck Pad-13</strong> and the <strong>CITRIS Foundry 2023</strong> cohort, providing mentorship, infrastructure, and a translational development environment.",
        "<strong>Model development.</strong> Operating under startup timelines and constraints, I developed, benchmarked, and delivered a convolutional neural network (CNN) with transfer learning for multi-class heart sound classification — distinguishing normal cardiac function from pathological conditions including aortic stenosis, mitral regurgitation, mitral stenosis, and mitral valve prolapse. The pipeline covered the full model lifecycle: raw PCG data ingestion, preprocessing and segmentation, feature extraction, model training and cross-validation, and evaluation on held-out test sets. The final model achieved <strong>95% accuracy</strong> on held-out data, meeting the startup's clinical deployment target.",
        "<strong>Hardware integration.</strong> I mentored an undergraduate student in designing and building a hardware digital stethoscope — a custom data acquisition device that interfaces with the deployed classification model, enabling point-of-care cardiac screening without specialized clinical equipment. This hardware-software integration bridged the gap between research prototype and deployable medical instrument.",
        "<strong>Connection to PI-FNO.</strong> The startup provided the clinical motivation and domain expertise that later informed the PI-FNO project (see the PI-FNO tab), where I revisited the same five-class cardiac classification problem using a Fourier Neural Operator with explicit physiological constraints — moving from an engineering-driven CNN baseline to a physics-principled architecture grounded in the known frequency structure of cardiac acoustics."
      ],
      keyPoints: [
        "Co-founded cardiovascular AI startup; accepted into UC Berkeley SkyDeck Pad-13 and CITRIS Foundry 2023",
        "Developed CNN + transfer learning pipeline for multi-class heart sound classification; 95% accuracy on held-out test sets",
        "Managed full model lifecycle: data pipeline, preprocessing, training, cross-validation, and evaluation on a startup timeline",
        "Mentored undergraduate student in building a hardware digital stethoscope paired with the deployed model",
        "Startup work directly motivated the subsequent PI-FNO physics-constrained approach"
      ],
      links: [
        { text: "Related Work · PI-FNO Cardiac Disease Detection", href: "research-pi-fno.html" },
        { text: "Related Work · Heart Disease Risk Prediction", href: "research-heart-disease-prediction.html" }
      ]
    }
  ],

  /* ---- PUBLICATIONS ------------------------------------------ */
  // Order within each list = newest first (top of the printed list).
  // Numbering is generated automatically. To add: paste a new object
  // at the TOP of the relevant list.
  //   authors : HTML string; wrap your own name in <strong>…</strong>
  //   venue   : journal name / publisher / book title
  //   details : year + volume/pages/id
  //   href    : DOI or publisher link (optional)
  //   tag / tagClass : optional badge, e.g. tag:"In Press" or tag:"Under Review", tagClass:"under-review"
  publications: {
    books: [
      { authors: "Steigmann, D. J. &amp; <strong>Shirani, M.</strong>",
        title: "Principles of Continuum Mechanics",
        venue: "World Scientific", details: "2025",
        href: "https://doi.org/10.1142/14150",
        cover: "Figures/Books/principles-of-continuum-mechanics.jpg" },
      { authors: "Steigmann, D. J., Bîrsan, M. &amp; <strong>Shirani, M.</strong>",
        title: "Lecture Notes on the Theory of Plates and Shells",
        venue: "Springer", details: "2023",
        href: "https://link.springer.com/book/9783031256738",
        cover: "Figures/Books/lecture-notes-plates-and-shells.jpg" }
    ],
    journals: [
      { authors: "<strong>Shirani, M.</strong> &amp; Humphrey, J. D.",
        title: "A universal behavior in polarized cell monolayers",
        venue: "Proceedings of the Royal Society A", details: "2026 · accepted",
        tag: "In Press" },
      { authors: "Steigmann, D. J., <strong>Shirani, M.</strong> &amp; La Valle, G.",
        title: "Extended Cosserat elasticity theory incorporating the second gradient of the rotation field",
        venue: "Mathematics and Mechanics of Complex Systems", details: "2026 · accepted",
        tag: "In Press" },
      { authors: "Bîrsan, M. &amp; <strong>Shirani, M.</strong>",
        title: "Legendre-Hadamard inequalities for Cosserat elastic shells with a single deformable director",
        venue: "Journal of Applied Mechanics", details: "2026 · 93(9) · 091006",
        href: "https://asmedigitalcollection.asme.org/appliedmechanics/article/93/9/091006/1232707/Legendre-Hadamard-Inequalities-for-Cosserat" },
      { authors: "<strong>Shirani, M.</strong> &amp; Humphrey, J. D.",
        title: "A continuum model for collective cell migration in tissues and biomaterials in response to chemo-mechanical stimuli",
        venue: "International Journal of Engineering Science", details: "2026 · 104502",
        href: "https://www.sciencedirect.com/science/article/pii/S0020722526000406" },
      { authors: "Steigmann, D. J., <strong>Shirani, M.</strong> &amp; Sigaroudi, M. J.",
        title: "On the elastic-plastic response of hemitropic Cosserat solids",
        venue: "Journal of Mathematics and Mechanics of Solids", details: "2026 · 10812865251397027",
        href: "https://journals.sagepub.com/doi/abs/10.1177/10812865251397027" },
      { authors: "<strong>Shirani, M.</strong>, Giorgio, I., Astori, D. &amp; Humphrey, J. D.",
        title: "A mixed Cosserat and higher gradient formulation for fibrous tissues and biomaterials",
        venue: "International Journal of Solids and Structures", details: "2025 · 113671",
        href: "https://www.sciencedirect.com/science/article/abs/pii/S0020768325004573" },
      { authors: "<strong>Shirani, M.</strong> &amp; Bîrsan, M.",
        title: "Necessary conditions for stable equilibrium states of lattice solids based on the Cosserat elasticity theory",
        venue: "Mechanics of Materials", details: "2025 · 105292",
        href: "https://www.sciencedirect.com/science/article/pii/S0167663625000547" },
      { authors: "Bîrsan, M. &amp; <strong>Shirani, M.</strong>",
        title: "On the Maxwell–Eshelby relation in the theory of 6-parameter elastic shells",
        venue: "Mechanics Research Communications", details: "2025 · 104451",
        href: "https://www.sciencedirect.com/science/article/pii/S0093641325000849" },
      { authors: "McAvoy, R. C. &amp; <strong>Shirani, M.</strong>",
        title: "Asymptotic theory for thin nonlinear second-gradient elastic plates",
        venue: "Mathematics and Mechanics of Complex Systems", details: "2025 · 13(4), 391–416",
        href: "https://msp.org/memocs/2025/13-4/p01.xhtml" },
      { authors: "Bîrsan, M., <strong>Shirani, M.</strong> &amp; Steigmann, D. J.",
        title: "The coupled Legendre-Hadamard condition for fiber-reinforced materials: three-dimensional solids and two-dimensional shells",
        venue: "Continuum Mechanics and Thermodynamics", details: "2025 · 37(2), 26",
        href: "https://link.springer.com/article/10.1007/s00161-025-01357-0" },
      { authors: "Bîrsan, M., <strong>Shirani, M.</strong> &amp; Steigmann, D. J.",
        title: "Convexity conditions for fiber-reinforced elastic shells",
        venue: "Journal of Mathematics and Mechanics of Solids", details: "2024",
        href: "https://journals.sagepub.com/doi/abs/10.1177/10812865241261485" },
      { authors: "<strong>Shirani, M.</strong>, Bîrsan, M. &amp; Steigmann, D. J.",
        title: "Quasiconvexity in a Cosserat theory of fiber-reinforced elastic solids",
        venue: "Journal of Mathematics and Mechanics of Solids", details: "2024",
        href: "https://journals.sagepub.com/eprint/H7AUPXMG2FBDFJBUNFTM/full" },
      { authors: "<strong>Shirani, M.</strong> &amp; Steigmann, D. J.",
        title: "Asymptotic theory for the inextensional flexure and twist of plastically deformed thin rods",
        venue: "Journal of Mathematics and Mechanics of Solids", details: "2024 · 29(6), 1053–1063",
        href: "https://journals.sagepub.com/doi/full/10.1177/10812865221124524" },
      { authors: "Steigmann, D. J., Bîrsan, M. &amp; <strong>Shirani, M.</strong>",
        title: "Thin shells reinforced by fibers with intrinsic flexural and torsional elasticity",
        venue: "International Journal of Solids and Structures", details: "2023 · 85, 112550",
        href: "https://www.sciencedirect.com/science/article/abs/pii/S002076832300447X" },
      { authors: "<strong>Shirani, M.</strong>, Steigmann, D. J. &amp; Bîrsan, M.",
        title: "Legendre-Hadamard conditions for fiber-reinforced materials with one, two or three families of fibers",
        venue: "Mechanics of Materials", details: "2023 · 104745",
        href: "https://www.sciencedirect.com/science/article/pii/S0167663623001916" },
      { authors: "Khozeimeh, F., Alizadehsani, R., <strong>Shirani, M.</strong>, Tartibi, M., et al.",
        title: "ALEC: Active learning with ensemble of classifiers for clinical diagnosis of coronary artery disease",
        venue: "Computers in Biology and Medicine", details: "2023 · 158, 106841",
        href: "https://www.sciencedirect.com/science/article/pii/S0010482523003062" },
      { authors: "<strong>Shirani, M.</strong> &amp; Steigmann, D. J.",
        title: "Convexity and quasiconvexity in a Cosserat model for fiber-reinforced elastic solids",
        venue: "Journal of Elasticity", details: "2022 · 1–13",
        href: "https://link.springer.com/article/10.1007/s10659-022-09963-8" },
      { authors: "<strong>Shirani, M.</strong>",
        title: "Maxwell-Eshelby relation in Cosserat elasticity theory",
        venue: "Journal of Mathematics and Mechanics of Solids", details: "2022 · 27(10), 2085–2098",
        href: "https://journals.sagepub.com/doi/abs/10.1177/10812865221077456" },
      { authors: "<strong>Shirani, M.</strong> &amp; Steigmann, D. J.",
        title: "Cosserat elasticity of lattice solids",
        venue: "Journal of Elasticity", details: "2021 · 1–16",
        href: "https://link.springer.com/article/10.1007/s10659-021-09859-z" },
      { authors: "Hendrickson, B., <strong>Shirani, M.</strong> &amp; Steigmann, D. J.",
        title: "On the equations of equilibrium for asymmetric tilted lipid bilayers",
        venue: "Mathematics and Mechanics of Complex Systems", details: "2021 · 9(2), 153–166",
        href: "https://msp.org/memocs/2021/9-2/p04.xhtml" },
      { authors: "<strong>Shirani, M.</strong>, Steigmann, D. J. &amp; Neff, P.",
        title: "The Legendre-Hadamard condition in Cosserat elasticity theory",
        venue: "The Quarterly Journal of Mechanics and Applied Mathematics", details: "2020 · 73(4), 293–303",
        href: "https://academic.oup.com/qjmam/article-abstract/73/4/293/5934913" },
      { authors: "Taylor, M. &amp; <strong>Shirani, M.</strong>",
        title: "Simulation of wrinkling in incompressible anisotropic thin sheets with wavy fibers",
        venue: "International Journal of Non-Linear Mechanics", details: "2020 · 127, 103610",
        href: "https://www.sciencedirect.com/science/article/abs/pii/S0020746220302729" },
      { authors: "<strong>Shirani, M.</strong> &amp; Steigmann, D. J.",
        title: "A Cosserat model of elastic solids reinforced by a family of curved and twisted fibers",
        venue: "Symmetry", details: "2020 · 12(7), 1133",
        href: "https://www.mdpi.com/2073-8994/12/7/1133" },
      { authors: "Hendrickson, B., <strong>Shirani, M.</strong> &amp; Steigmann, D. J.",
        title: "Equilibrium theory for a lipid bilayer with a conforming cytoskeletal membrane",
        venue: "Mathematics and Mechanics of Complex Systems", details: "2020 · 8(1), 69–99",
        href: "https://msp.org/memocs/2020/8-1/p04.xhtml" },
      { authors: "Taylor, M., <strong>Shirani, M.</strong>, Dabiri, Y., Guccione, J. &amp; Steigmann, D. J.",
        title: "Finite elastic deformations of incompressible fiber-reinforced plates",
        venue: "International Journal of Engineering Science", details: "2019 · 144, 103138",
        href: "https://www.sciencedirect.com/science/article/abs/pii/S0020722519316039" },
      { authors: "Jafarzadeh, S., <strong>Shirani, M.</strong>, Kadkhodaei, M. &amp; Gheibgholami, E.",
        title: "Phenomenological constitutive modeling of ferromagnetic shape memory alloys considering the effects of loading history on reorientation start conditions",
        venue: "Continuum Mechanics and Thermodynamics", details: "2018 · 31(4), 1065–1085",
        href: "https://link.springer.com/article/10.1007/s00161-018-0704-0" },
      { authors: "<strong>Shirani, M.</strong>, Luo, C. &amp; Steigmann, D. J.",
        title: "Cosserat elasticity of lattice shells with kinematically independent flexure and twist",
        venue: "Continuum Mechanics and Thermodynamics", details: "2018 · 31(4), 1087–1097",
        href: "https://link.springer.com/article/10.1007/s00161-018-0679-x" },
      { authors: "<strong>Shirani, M.</strong>, Andani, M. T., Kadkhodaei, M. &amp; Elahinia, M.",
        title: "Effect of loading history on phase transition and martensitic detwinning in shape memory alloys: Limitations of current approaches and development of a 1D constitutive model",
        venue: "Journal of Alloys and Compounds", details: "2017 · 729, 390–406",
        href: "https://www.sciencedirect.com/science/article/abs/pii/S092583881733178X" },
      { authors: "<strong>Shirani, M.</strong> &amp; Kadkhodaei, M.",
        title: "One dimensional constitutive model with transformation surfaces for phase transition in shape memory alloys considering the effect of loading history",
        venue: "International Journal of Solids and Structures", details: "2016 · 81, 117–129",
        href: "https://www.sciencedirect.com/science/article/pii/S0020768315004813" },
      { authors: "<strong>Shirani, M.</strong> &amp; Kadkhodaei, M.",
        title: "Constitutive modeling of Ni–Mn–Ga ferromagnetic shape memory alloys under biaxial compression",
        venue: "Journal of Intelligent Material Systems and Structures", details: "2016 · 27(11), 1547–1564",
        href: "https://journals.sagepub.com/doi/abs/10.1177/1045389x15596850" },
      { authors: "<strong>Shirani, M.</strong> &amp; Kadkhodaei, M.",
        title: "A modified constitutive model with an enhanced phase diagram for ferromagnetic shape memory alloys",
        venue: "Journal of Intelligent Material Systems and Structures", details: "2015 · 26(1), 56–68",
        href: "https://journals.sagepub.com/doi/abs/10.1177/1045389X14521704" },
      { authors: "Mehrabi, R., <strong>Shirani, M.</strong>, Kadkhodaei, M. &amp; Elahinia, M.",
        title: "Constitutive modeling of cyclic behavior in shape memory alloys",
        venue: "International Journal of Mechanical Sciences", details: "2015 · 103, 181–188",
        href: "https://www.sciencedirect.com/science/article/abs/pii/S0020740315002829" },
      { authors: "<strong>Shirani, M.</strong> &amp; Kadkhodaei, M.",
        title: "A geometrical approach to determine reorientation start and continuation conditions in ferromagnetic shape memory alloys considering the effects of loading history",
        venue: "Smart Materials and Structures", details: "2014 · 23(12), 125008",
        href: "https://iopscience.iop.org/article/10.1088/0964-1726/23/12/125008/meta" }
    ],
    chapters: [
      { authors: "Steigmann, D. J., Bîrsan, M. &amp; <strong>Shirani, M.</strong>",
        title: "A Cosserat model for fiber-reinforced elastic plates",
        venue: "Sixty Shades of Generalized Continua, Advanced Structured Materials vol. 170",
        details: "Springer · 2023",
        href: "https://link.springer.com/chapter/10.1007/978-3-031-26186-2_41" },
      { authors: "<strong>Shirani, M.</strong> &amp; Steigmann, D. J.",
        title: "Necessary conditions for energy minimizers in a Cosserat model of fiber-reinforced elastic solids",
        venue: "Recent Approaches in the Theory of Plates and Plate-Like Structures, pp. 253–266",
        details: "Springer · 2022",
        href: "https://link.springer.com/chapter/10.1007/978-3-030-87185-7_19" },
      { authors: "<strong>Shirani, M.</strong> &amp; Steigmann, D. J.",
        title: "Quasiconvexity and rank-one convexity in Cosserat elasticity theory",
        venue: "Theoretical Analyses, Computations, and Experiments of Multiscale Materials, pp. 273–283",
        details: "Springer · 2022",
        href: "https://link.springer.com/chapter/10.1007/978-3-031-04548-6_13" },
      { authors: "<strong>Shirani, M.</strong> &amp; Steigmann, D. J.",
        title: "Asymptotic estimate of the potential energy of a plastically deformed thin shell",
        venue: "Analysis of Shells, Plates, and Beams, pp. 409–420",
        details: "Springer · 2020",
        href: "https://link.springer.com/chapter/10.1007/978-3-030-47491-1_22" },
      { authors: "<strong>Shirani, M.</strong> &amp; Steigmann, D. J.",
        title: "Asymptotic derivation of nonlinear plate models from three-dimensional elasticity theory",
        venue: "Recent Developments in the Theory of Shells, Advanced Structured Materials, pp. 591–614",
        details: "Springer · 2019",
        href: "https://link.springer.com/chapter/10.1007/978-3-030-17747-8_30" }
    ],
    conference: [
      { authors: "<strong>Shirani, M.</strong>, Mehrabi, R., Andani, M. T., Kadkhodaei, M. &amp; Elahinia, M.",
        title: "A modified microplane model using transformation surfaces to consider loading history on phase transition in shape memory alloys",
        venue: "Smart Materials, Adaptive Structures and Intelligent Systems",
        details: "ASME · 2014 · Vol. 46148, V001T01A001",
        href: "https://asmedigitalcollection.asme.org/SMASIS/proceedings-abstract/SMASIS2014/V001T01A001/286324" }
    ],
    review: [],
    // [HIDDEN: "Under Review" is not shown on the site. Move an entry back into review: [...] to show it.]
    // { authors: "<strong>Shirani, M.</strong>, Gueldner, P. H., Khidoyatov, M., Warren, J. &amp; Ninno, F.",
    // title: "Physics-Consistent Neural Networks for Learning Deformation and Director Fields in Microstructured Media with Loss-Based Validation Criteria",
    // details: "2026", tag: "Under Review", tagClass: "under-review",
    // href: "https://arxiv.org/abs/2603.06939", linkLabel: "arXiv" }
  },

  /* ---- HONORS ------------------------------------------------ */
  // Newest first. tagClass options: "" (default gold) | "fellowship" | "travel" | "scholarship"
  honors: [
    { year: "2026", name: "ICERM Hot Topics Workshop Travel Grant — Agentic Scientific Computing &amp; Scientific Machine Learning",
      inst: "Institute for Computational and Experimental Research in Mathematics (ICERM)",
      loc: "Providence, RI", tag: "Travel Grant", tagClass: "travel" },
    { year: "2025", name: "Society of Engineering Science (SES) Postdoc Travel Award",
      inst: "Society of Engineering Science", loc: "Georgia, USA", tag: "Travel Award", tagClass: "travel" },
    { year: "2023", name: "Outstanding Graduate Student Instructor (OGSI) Award",
      inst: "University of California, Berkeley", loc: "Berkeley, CA · 2022–2023", tag: "Teaching Award", tagClass: "" },
    { year: "2022", name: "Graduate Division Block Grant Award",
      inst: "University of California, Berkeley",
      loc: "Berkeley, CA · Summer 2022 · Spring &amp; Summer 2021 · Spring &amp; Summer 2020 · Summer 2019 · Summer 2018",
      tag: "Research Grant", tagClass: "fellowship" },
    { year: "2021", name: "Bob Steidel Fellowship",
      inst: "University of California, Berkeley", loc: "Berkeley, CA", tag: "Fellowship", tagClass: "fellowship" },
    { year: "2020", name: "Paul M. Naghdi Fellowship",
      inst: "University of California, Berkeley", loc: "Berkeley, CA", tag: "Fellowship", tagClass: "fellowship" },
    { year: "2019", name: "Society for Natural Philosophy (SNP) Travel Grant",
      inst: "Society for Natural Philosophy", loc: "Illinois, USA", tag: "Travel Grant", tagClass: "travel" },
    { year: "2015", name: "Theodore Holden Thomas, Jr Memorial Scholarship",
      inst: "Engineering Science and Mechanics, Pennsylvania State University", loc: "University Park, PA", tag: "Scholarship", tagClass: "scholarship" },
    { year: "2015", name: "Dr. Richard E. Llorens Graduate Award",
      inst: "Engineering Science and Mechanics, Pennsylvania State University", loc: "University Park, PA", tag: "Graduate Award", tagClass: "scholarship" },
    { year: "2014", name: "Best Graduate Thesis Award",
      inst: "Isfahan University of Technology", loc: "Isfahan, Iran", tag: "Best Thesis", tagClass: "fellowship" }
  ]
};

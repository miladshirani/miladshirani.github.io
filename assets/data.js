/* =============================================================
   SITE CONTENT  —  edit THIS file to add or change anything.
   Nothing here touches design or layout; it is pure content.

   Quick guide:
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
    roleLine:  "Continuum Mechanics &amp; Physical AI<br />Biomedical Engineering, Yale University",
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
    { label: "About",        href: "index.html#home-hero", key: "home" },
    { label: "Research",     href: "research.html",        key: "research" },
    { label: "Publications", href: "publications.html",    key: "publications" },
    { label: "Honors",       href: "honors.html",          key: "honors" },
    { label: "Contact",      href: "mailto:milad.shirani@yale.edu", key: "contact" }
  ],

  /* ---- HOME: hero ------------------------------------------- */
  hero: {
    desc: "My research spans the boundary between rigorous continuum mechanics and physics-informed machine learning — from thermodynamically consistent models of soft biological tissues and nematic elastomers, to differentiable simulation and neural constitutive laws for Physical AI. I build models that are mathematically provable, computationally efficient, and physically meaningful.",
    cta: [
      { label: "Explore Research", href: "research.html", style: "primary" },
      { label: "Get in Touch",     href: "mailto:milad.shirani@yale.edu", style: "ghost" }
    ]
  },

  /* ---- HOME: research-profile panel -------------------------- */
  // `stats` numbers left as-is; publication counts on the Publications
  // page are computed automatically so they never drift.
  stats: [
    { num: "31", label: "Journal Papers" },
    { num: "2",  label: "Co-authored Books" },
    { num: "5",  label: "Book Chapters" },
    { num: "3",  label: "Years at Yale" }
  ],
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

  /* ---- HOME: research theme cards ---------------------------- */
  researchThemes: [
    { icon: "∇", title: "Nonlinear Continuum Mechanics",
      desc: "Cosserat, micropolar, and higher-gradient theories; Legendre–Hadamard and polyconvexity conditions for soft matter; variational methods for elastic rods, shells, and fibrous composites." },
    { icon: "ψ", title: "Soft Matter &amp; Biomechanics",
      desc: "Nematic liquid crystal elastomers, hydrogels, lipid bilayers, biological tissues. Thermodynamically consistent modeling of chemotaxis, durotaxis, and cell migration in fibrous substrates." },
    { icon: "∫", title: "Physics-Informed Machine Learning",
      desc: "PINNs, Deep Energy Methods, DeepONets, and ICNNs for constitutive modeling. Enforcing frame indifference, polyconvexity, and Legendre–Hadamard stability as hard constraints in neural architectures." },
    { icon: "𝒢", title: "Neural Operators &amp; GNNs",
      desc: "Fourier Neural Operators, MeshGraphNets, and transformer-based operator learning for mesh-dependent PDE surrogates. Differentiable simulation pipelines in JAX and PyTorch for Physical AI." },
    { icon: "∂", title: "Computational Mechanics",
      desc: "FEniCSx, JAX-FEM, and custom finite element codes for hyperelasticity, phase-field fracture, and swelling. End-to-end differentiable simulation targeting real-time physical AI applications." },
    { icon: "Σ", title: "Agentic Scientific Computing",
      desc: "Closed-loop agentic pipelines (LangGraph) for constitutive model discovery. Bridging symbolic reasoning, PDE solving, and data-driven learning in automated scientific workflows." },
    { icon: "⌬", title: "Experimental Mechanics",
      desc: "DIC and strain-gauge characterization of composites; photoelastic full-field stress mapping; DSC thermal analysis and tensile testing of shape memory alloys; magnetomechanical experiments on FSMAs." },
    { icon: "♡", title: "Cardiovascular AI Startup",
      desc: "Co-founded AI venture (UC Berkeley SkyDeck Pad-13, CITRIS Foundry 2023) for automated heart disease detection from phonocardiograms. CNN + transfer learning achieving 95% test accuracy." }
  ],

  /* ---- HOME: timeline ---------------------------------------- */
  journey: [
    { years: "2010 – 2013", title: "MSc · Isfahan University of Technology",
      sub: "Constitutive modeling of shape memory alloys and magnetic shape memory alloys. 8 publications, Best Thesis Award. Combined experiment, theory, and numerical validation." },
    { years: "2014 – 2016", title: "Penn State University", hidden: true,
      sub: "Experimental characterization of shape memory alloys. Transitioned to UC Berkeley to pursue research in theoretical mechanics." },
    { years: "2014 – 2023", title: "PhD · UC Berkeley · Dept. of Mechanical Engineering",
      sub: "Advisor: Prof. David Steigmann. Minors in Mathematics and Dynamics. Co-authored two graduate textbooks on continuum mechanics and theories of plates &amp; shells. 21 journal papers and 5 book chapters. Derived stability conditions (Legendre–Hadamard, rank-one convexity, quasiconvexity) for Cosserat media, fibrous materials, and liquid crystal elastomers." },
    { years: "2022 – 2023", title: "Co-Founder &amp; ML Engineer — Berkeley AI Startup",
      sub: "Co-founded cardiovascular AI startup accepted into UC Berkeley SkyDeck Pad-13 and CITRIS Foundry 2023. Built CNN + transfer learning models for multi-class heart sound classification achieving 95% accuracy. Mentored undergraduate hardware development." },
    { years: "2023 – Present", title: "Postdoctoral Associate · Yale University",
      sub: "Advisor: Prof. Jay D. Humphrey. Biomedical Engineering. 3 publications. Research on fibrous tissues, thermodynamically consistent chemotaxis, phase-field fracture, and physics-informed neural networks for soft matter." }
  ],

  /* ---- RESEARCH: intro + philosophy -------------------------- */
  researchIntro: "My research is driven by a single conviction: that a deep understanding of physical systems demands mathematical rigor, experimental honesty, and computational power working together. From the thermodynamics of a swelling hydrogel to the stability conditions of a fiber-reinforced elastic solid, from the migration of cells on a soft substrate to the design of neural networks that provably satisfy the laws of mechanics — each project begins with the same question: <em>what does the physics actually require?</em>",
  philosophy: {
    quote: "\"Nature does not negotiate its laws — it conceals them. My work is the art of unraveling those concealments: finding the <em>mathematical necessities</em> hidden in physical phenomena, and building models <em>rigorous enough to outlast</em> the data they were never meant to merely fit.\"",
    attr:  "Research Philosophy · M. Shirani"
  },

  /* ---- RESEARCH TABS ----------------------------------------- */
  // To add a tab: copy one block, give it a new id + roman numeral.
  // Tab button + panel are generated together — no need to edit two places.
  researchTabs: [
    {
      id: "t1", num: "I", label: "Continuum Mechanics<br>&amp; Stability",
      title: "Nonlinear Continuum Mechanics &amp; Stability Theory",
      body: [
        "My doctoral work, carried out under Prof. David Steigmann at UC Berkeley, established a systematic framework for stability analysis in generalized continua. The central objects of study were the Legendre-Hadamard condition, rank-one convexity, and quasiconvexity — necessary conditions for energy minimizers that govern whether a body can sustain localized failure modes such as shear bands or surface instabilities.",
        "In classical elasticity these conditions are well understood, but for <em>Cosserat media</em> — where material points carry both position and orientation — the analysis is fundamentally richer. The acoustic tensor acquires a block structure, coupling the translational and rotational degrees of freedom, and the admissible wave speeds depend on both the elastic and couple-stress moduli. I derived these conditions analytically for Cosserat solids, lattice structures, fiber-reinforced materials with one, two, and three fiber families, liquid crystal elastomers, and elastic shells with intrinsic fiber bending and twist stiffness. A key contribution was proving the <em>coupled</em> Legendre-Hadamard inequality for fiber-reinforced shells, where the fiber's own Kirchhoff-rod energy interacts with the shell's membrane-bending response.",
        "More recently, I showed that fibrous biological tissues simultaneously exhibit <em>strain-gradient</em> and <em>Cosserat</em> effects — a consequence of the finite thickness and curvature of individual fibers — and that this dual nonlocality can produce macroscopic Poynting effects with no classical analogue."
      ],
      keyPoints: [
        "Analytical Legendre-Hadamard conditions for Cosserat elasticity, fiber-reinforced solids, and elastic shells",
        "Quasiconvexity and rank-one convexity in Cosserat models for lattice and fiber-reinforced materials",
        "Maxwell-Eshelby relation and its generalization in Cosserat and 6-parameter shell theories",
        "Mixed Cosserat/strain-gradient formulation for fibrous tissues; prediction of Poynting effects",
        "Elastic-plastic response of hemitropic Cosserat solids"
      ],
      links: [ { text: "Article · Coming Soon", comingSoon: true } ]
    },
    {
      id: "t2", num: "II", label: "Soft Matter:<br>Hydrogels &amp; LCEs",
      title: "Soft Matter: Hydrogels, Polymers &amp; Liquid Crystal Elastomers",
      body: [
        "Soft materials present a distinct class of challenges: they undergo large, geometrically nonlinear deformations; they often couple mechanical response to chemical, thermal, or electromagnetic fields; and their constitutive behavior is governed by entropy as much as by internal energy. My work in this area addresses both the mathematical structure of such coupled theories and their computational implementation.",
        "For hydrogels, I developed a thermodynamically consistent continuum model for swelling driven by water absorption, grounding the Flory-Huggins mixing energy within a variational framework and deriving the coupled mechanical and chemical balance laws via the principle of virtual power. The Coleman-Noll procedure shows that the reduced dissipation inequality constrains the water-flux mobility tensor to be positive semi-definite — a result that is both physically necessary and computationally actionable. The model is currently being extended to biological tissues and to delamination problems in layered hydrogel systems.",
        "For <em>nematic liquid crystal elastomers</em> (LCEs), where a rubber-like polymer network is coupled to an orientational order parameter \\( \\boldsymbol{n} \\), I derived the Legendre-Hadamard inequalities governing stability with respect to both deformation and director-field perturbations. I then used these as validation criteria — rather than loss-function penalties — when training physics-consistent neural networks to predict the deformation and director fields. This distinction matters: a loss penalty can be violated during inference, while an architectural constraint cannot."
      ],
      keyPoints: [
        "Variational continuum model for hydrogel swelling; thermodynamic restrictions on the water flux",
        "Stability conditions for nematic LCEs under coupled mechanical-orientational perturbations",
        "Deep Energy Method for LCEs: two coupled MLPs for deformation and director fields, validated against FEA",
        "Variational and data-driven DeepONets for nematic materials",
        "Wrinkling of incompressible anisotropic sheets with wavy fibers"
      ],
      links: [
        { text: "Read · Hydrogel Swelling Model", href: "research-hydrogel-swelling.html" },
        { text: "Article · LCE Stability &amp; Neural Networks — Coming Soon", comingSoon: true }
      ]
    },
    {
      id: "t3", num: "III", label: "Biomechanics:<br>Cells &amp; Tissues",
      title: "Biomechanics: Cell Migration, Tissues &amp; Membranes",
      body: [
        "At Yale, working with Prof. Jay D. Humphrey, my research has focused on the mechanics of living soft matter — fibrous biological tissues, cell monolayers, lipid bilayers, and hydrogel scaffolds. These systems are distinguished by their capacity for active response, growth, remodeling, and self-organization, phenomena that classical passive elasticity cannot capture.",
        "I developed a continuum model for collective cell migration driven by <em>chemotaxis</em> (response to chemical gradients), <em>durotaxis</em> (response to substrate stiffness), and <em>taxis</em> toward tension, unifying these into a single thermodynamically consistent framework applicable to multiple cell families and chemoattractants simultaneously. A significant theoretical finding was demonstrating that the Keller-Segel chemotaxis model — widely used in mathematical biology — violates thermodynamic consistency, and providing a corrected formulation.",
        "A separate line of work concerned the geometry of cell polarization near free boundaries. I proved that in any polarized cell monolayer, the polarity vector must remain tangential to free boundaries — a result that is <em>universal</em> in the sense that it depends only on the boundary geometry and the continuity of the polarity field, not on the specific constitutive model for polarization dynamics.",
        "Earlier work at Berkeley addressed the equilibrium mechanics of lipid bilayers, including asymmetric and tilted bilayers and bilayers with a conforming cytoskeletal membrane, where the coupling between membrane curvature and cytoskeletal tension produces nontrivial shape transitions."
      ],
      keyPoints: [
        "Thermodynamically consistent model for collective cell migration under chemo-mechanical stimuli",
        "Proof of thermodynamic inconsistency in the Keller-Segel model; corrected continuum formulation",
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
      id: "t4", num: "IV", label: "Physics-Informed<br>Machine Learning",
      title: "Physics-Informed Machine Learning &amp; Neural Constitutive Models",
      body: [
        "The convergence of mechanics and machine learning opens a genuinely new frontier — not merely fitting data faster, but building computational models that are constrained by physical law from the ground up. My work in this area is grounded in the conviction that the laws of mechanics are not soft regularizers to be traded against data fit; they are hard constraints that any admissible model must satisfy exactly.",
        "For hyperelastic constitutive modeling, I develop neural networks whose outputs are guaranteed to satisfy <em>frame indifference</em>, <em>material symmetry</em>, and the <em>Legendre-Hadamard condition</em> — not by penalizing violations during training, but by architectural design. Input Convex Neural Networks (ICNNs) provide polyconvex energy densities by construction. For fibrous biological tissues with two fiber families, I have proved analytically the polyconvexity conditions that existing approaches verify only numerically — a distinction that matters for guaranteeing stability at <em>any</em> deformation state, not just those seen during training.",
        "For operator learning — mapping loading conditions to full displacement or director fields — I work with Deep Operator Networks (DeepONets) and Physics-Informed Neural Networks (PINNs), enforcing the governing PDEs either through the loss function or directly in the architecture. Most recently, in work currently under review, I trained physics-consistent neural networks for microstructured media (Cosserat continua) where both the deformation gradient \\( \\boldsymbol{F} \\) and the director field \\( \\boldsymbol{d} \\) are learned simultaneously, with the Legendre-Hadamard tensor retained in the computational graph for post-training stability verification.",
        "Looking forward, I am building end-to-end differentiable simulation pipelines in JAX and PyTorch — combining custom finite element solvers, neural constitutive models, and MeshGraphNet-based surrogates — as the foundation for Physical AI applications in soft robotics, surgical simulation, and materials design."
      ],
      keyPoints: [
        "Deep Energy Method for nematic LCEs with LH conditions as architectural constraints",
        "Physics-consistent neural networks for Cosserat media; LH verification in the computational graph",
        "Analytical proof of polyconvexity conditions for fibrous tissues with two fiber families",
        "Variational and data-driven DeepONets for nematic materials",
        "Differentiable FEA in JAX: T3/Q9 elements, Neo-Hookean and SVK materials, autodiff tangent stiffness",
        "Agentic constitutive model discovery pipelines using LangGraph with JAX and PyTorch backends"
      ],
      links: [
        { text: "Article · ICNN Constitutive Models — Coming Soon", comingSoon: true },
        { text: "Article · Differentiable Simulation — Coming Soon", comingSoon: true }
      ]
    },
    {
      id: "t5", num: "V", label: "Shape Memory<br>Alloys &amp; FSMAs",
      title: "Shape Memory Alloys &amp; Ferromagnetic Smart Materials",
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
      id: "t6", num: "VI", label: "PI-FNO: Cardiac<br>Acoustics",
      title: "PI-FNO: Physics-Informed Neural Operators for Cardiac Acoustics",
      body: [
        "The same design principles that govern physics-consistent constitutive modeling in continuum mechanics — encoding known structure as inductive biases, enforcing inequalities as hard or hinge constraints, and using interpretable learned parameters — transfer naturally to biomedical signal classification. This project applies that philosophy to the automated diagnosis of valvular heart disease from raw phonocardiogram (PCG) recordings.",
        "The primary model is a <em>Fourier Neural Operator (FNO)</em> operating directly on raw waveforms, with physiological structure encoded at three levels. First, a learnable <em>physiological frequency mask</em> is initialized from known S1 (25-45 Hz) and S2 (50-70 Hz) cardiac sound bands and parameterized in logit space to keep weights in \\( (0,1) \\). Second, spectral convolutions retain only the \\( M = 20 \\) lowest Fourier modes — a band-limited inductive bias matching the sub-1 kHz frequency content of cardiac acoustics. Third, the training loss augments cross-entropy with two physiologically motivated terms: a <em>periodicity loss</em> penalizing energy away from heart-rate harmonics, and a <em>frequency hierarchy loss</em> enforcing \\( E_{S1} \\geq E_{S2} \\) via a hinge penalty — directly analogous to Legendre-Hadamard enforcement in hyperelastic constitutive modeling.",
        "The model classifies five clinically distinct conditions — Aortic Stenosis, Mitral Regurgitation, Mitral Stenosis, Mitral Valve Prolapse, and Normal — from 1,000 PCG recordings. The FNO achieves <strong>97.3% test accuracy</strong> with perfect classification of Mitral Stenosis (F1 = 1.00). After training, the learned mask weights autonomously recover the S1/S2 bands while also discovering additional murmur-frequency modes — providing direct clinical interpretability with no post-hoc attribution required."
      ],
      keyLabel: "Key Results",
      keyPoints: [
        "97.3% five-class test accuracy on 1,000 PCG recordings (AS / MR / MS / MVP / Normal)",
        "Perfect Mitral Stenosis classification (F1 = 1.00); hardest class MR at F1 = 0.92",
        "Learnable physiological frequency mask autonomously recovers S1 and S2 bands post-training",
        "Hinge-form frequency hierarchy loss enforces \\( E_{S1} \\geq E_{S2} \\) — exact analogue of LH inequality enforcement in mechanics",
        "Well-separated t-SNE clusters for all five classes; Normal class fully isolated from all pathologies"
      ],
      table: {
        label: "Performance Summary",
        head: ["Model", "Val Acc", "Test Acc", "Convergence"],
        rows: [
          { cells: ["FNO (physio-constrained)", "98.00%", "<strong>97.33%</strong>", "Epoch 30"], highlight: true },
          { cells: ["CNN Baseline (Mel spectrogram)", "98.67%", "<strong>97.33%</strong>", "Epoch 20"] }
        ]
      },
      links: [
        { text: "GitHub · PI-FNO Repository", href: "https://github.com/miladshirani/PI-FNO", external: true },
        { text: "Article · Coming Soon", comingSoon: true }
      ]
    },
    {
      id: "t7", num: "VII", label: "Experimental<br>Mechanics",
      title: "Experimental Mechanics",
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
      id: "t8", num: "VIII", label: "Cardiovascular<br>AI Startup",
      title: "Cardiovascular AI Startup — UC Berkeley",
      body: [
        "During the final year of my PhD at UC Berkeley, I co-founded an AI startup focused on the automated detection of cardiovascular disease from phonocardiogram (PCG) recordings. The startup was accepted into two competitive Berkeley incubator programs: <strong>UC Berkeley SkyDeck Pad-13</strong> and the <strong>CITRIS Foundry 2023</strong> cohort, providing mentorship, infrastructure, and a translational development environment.",
        "<strong>Model development.</strong> Operating under startup timelines and constraints, I developed, benchmarked, and delivered a convolutional neural network (CNN) with transfer learning for multi-class heart sound classification — distinguishing normal cardiac function from pathological conditions including aortic stenosis, mitral regurgitation, mitral stenosis, and mitral valve prolapse. The pipeline covered the full model lifecycle: raw PCG data ingestion, preprocessing and segmentation, feature extraction, model training and cross-validation, and evaluation on held-out test sets. The final model achieved <strong>95% accuracy</strong> on held-out data, meeting the startup's clinical deployment target.",
        "<strong>Hardware integration.</strong> I mentored an undergraduate student in designing and building a hardware digital stethoscope — a custom data acquisition device that interfaces with the deployed classification model, enabling point-of-care cardiac screening without specialized clinical equipment. This hardware-software integration bridged the gap between research prototype and deployable medical instrument.",
        "<strong>Connection to PI-FNO.</strong> The startup provided the clinical motivation and domain expertise that later informed the PI-FNO project (Tab VI), where I revisited the same five-class cardiac classification problem using a Fourier Neural Operator with explicit physiological constraints — moving from an engineering-driven CNN baseline to a physics-principled architecture grounded in the known frequency structure of cardiac acoustics."
      ],
      keyPoints: [
        "Co-founded cardiovascular AI startup; accepted into UC Berkeley SkyDeck Pad-13 and CITRIS Foundry 2023",
        "Developed CNN + transfer learning pipeline for multi-class heart sound classification; 95% accuracy on held-out test sets",
        "Managed full model lifecycle: data pipeline, preprocessing, training, cross-validation, and evaluation on a startup timeline",
        "Mentored undergraduate student in building a hardware digital stethoscope paired with the deployed model",
        "Startup work directly motivated the subsequent PI-FNO physics-constrained approach (Tab VI)"
      ],
      links: [ { text: "Related Work · PI-FNO (Tab VI)", comingSoon: true } ]
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
        href: "https://doi.org/10.1142/14150" },
      { authors: "Steigmann, D. J., Bîrsan, M. &amp; <strong>Shirani, M.</strong>",
        title: "Lecture Notes on the Theory of Plates and Shells. Classical and Modern Developments",
        venue: "Springer", details: "2023",
        href: "https://link.springer.com/book/9783031256738" }
    ],
    journals: [
      { authors: "Bîrsan, M. &amp; <strong>Shirani, M.</strong>",
        title: "Legendre-Hadamard inequalities for Cosserat elastic shells with a single deformable director",
        venue: "Journal of Applied Mechanics", details: "2026 · accepted",
        tag: "In Press" },
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
    review: [
      { authors: "<strong>Shirani, M.</strong>, Gueldner, P. H., Khidoyatov, M., Warren, J. &amp; Ninno, F.",
        title: "Physics-Consistent Neural Networks for Learning Deformation and Director Fields in Microstructured Media with Loss-Based Validation Criteria",
        details: "2026", tag: "Under Review", tagClass: "under-review",
        href: "https://arxiv.org/abs/2603.06939", linkLabel: "arXiv" },
      { authors: "<strong>Shirani, M.</strong> &amp; Humphrey, J. D.",
        title: "A universal behavior in polarized cell monolayers",
        tag: "Under Review", tagClass: "under-review" }
    ]
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

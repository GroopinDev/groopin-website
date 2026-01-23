import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Playfair_Display } from "next/font/google";
import AnimatedLogo from "../components/ui/animated-logo";
import LanguageSync from "../components/language-sync";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap"
});

const translations = {
  en: {
    languageLabel: "Language",
    tagline: "Find your people fast",
    nav: {
      discover: "Discover",
      groops: "Groops",
      trust: "Trust",
      stories: "Stories"
    },
    buttons: {
      openApp: "Open the app",
      startGroop: "Start a Groop",
      openWebApp: "Open the web app",
      seeHow: "See how it works"
    },
    hero: {
      pill: "Real people. Real moments.",
      title: "Where paths cross, adventures begin.",
      description:
        "Groopin helps you build small groups around the experiences you want. Meet people who already share your interests, pace, and intent.",
      imageAlt: "Friends meeting through Groopin",
      badges: {
        live: "+340 Groops live today",
        quote: "Best way to meet new people",
        verified: "Verified hosts & tickets"
      }
    },
    stats: [
      { label: "Active cities", value: "30+" },
      { label: "Groops formed", value: "12k" },
      { label: "Meetups hosted", value: "58k" }
    ],
    marqueeItems: [
      "Sunrise runs in Rabat",
      "Road trips to Essaouira",
      "Casablanca food labs",
      "Golden hour hikes",
      "Coastal surf sessions",
      "Creative studio nights",
      "Book club meetups",
      "Festival squads"
    ],
    sections: {
      discoverLabel: "How Groopin works",
      discoverTitle: "Designed for connection, built for action.",
      groopsLabel: "Groops for every energy",
      groopsTitle: "Build a calendar that actually feels like you.",
      trustLabel: "Trust by design",
      trustTitle: "Confidence before you step out the door.",
      trustDescription: "Groopin keeps the energy aligned, so every meetup feels intentional."
    },
    steps: [
      {
        title: "Set your vibe",
        description:
          "Pick what you want to do, how you want to feel, and who you want to meet."
      },
      {
        title: "Create or join a Groop",
        description:
          "Open an activity or jump into one that matches your energy and schedule."
      },
      {
        title: "Show up together",
        description:
          "Connect with people who already care about the same things you do."
      }
    ],
    activityGrid: [
      { title: "Movement", detail: "Runs, hikes, surf sessions", tone: "bg-[#F6C6A9]" },
      { title: "Culture", detail: "Film nights, books, museums", tone: "bg-[#F1E3B7]" },
      { title: "Travel", detail: "Road trips, escapes, city breaks", tone: "bg-[#BFE6E8]" },
      { title: "Food", detail: "Cafes, tastings, cooking labs", tone: "bg-[#D9F2C2]" },
      { title: "Creation", detail: "Workshops, arts, studios", tone: "bg-[#EAD4F2]" },
      { title: "Nightlife", detail: "Concerts, festivals, lights", tone: "bg-[#F4B9D6]" }
    ],
    signals: [
      "Profiles with stories, not just stats.",
      "Ticketing for verified events.",
      "Smart filters that match energy and timing.",
      "Real conversations before you meet."
    ],
    trustCards: [
      {
        kicker: "Groove match",
        title: "A short quiz tunes the people you meet.",
        description: "Interests, pace, and mood align before anyone says hello."
      },
      {
        kicker: "Presence matters",
        title: "Check-ins keep events smooth.",
        description: "Hosts know who is coming, and participants know it is real."
      }
    ],
    stories: [
      {
        quote: "I found people who hike at my pace. It feels like we already know each other.",
        name: "Hana",
        detail: "Marrakech"
      },
      {
        quote:
          "Groopin is the only place I can mix creativity with travel and meet great humans.",
        name: "Youssef",
        detail: "Casablanca"
      },
      {
        quote: "We built a weekly rhythm with our Groop. The city feels smaller and warmer.",
        name: "Salma",
        detail: "Rabat"
      }
    ],
    cta: {
      label: "Ready to move",
      title: "Plan your next story with a Groop.",
      description: "Open the app and see what is happening near you right now.",
      openApp: "Open the app",
      createOffer: "Create an offer"
    },
    footer: {
      whoWeAre: "Who we are",
      terms: "Terms & conditions",
      contact: "Contact us"
    }
  },
  fr: {
    languageLabel: "Langue",
    tagline: "Trouvez vos gens, vite",
    nav: {
      discover: "Découvrir",
      groops: "Groops",
      trust: "Confiance",
      stories: "Histoires"
    },
    buttons: {
      openApp: "Ouvrir l'app",
      startGroop: "Créer un Groop",
      openWebApp: "Ouvrir l'app web",
      seeHow: "Voir comment ça marche"
    },
    hero: {
      pill: "Des gens vrais. Des moments vrais.",
      title: "Là où les chemins se croisent, l'aventure commence.",
      description:
        "Groopin vous aide à créer de petits groupes autour des expériences qui vous font envie. Rencontrez des personnes qui partagent déjà vos centres d'intérêt, votre rythme et votre état d'esprit.",
      imageAlt: "Des amis qui se rencontrent grâce à Groopin",
      badges: {
        live: "+340 Groops en cours aujourd'hui",
        quote: "La meilleure façon de rencontrer du monde",
        verified: "Hôtes vérifiés & billets"
      }
    },
    stats: [
      { label: "Villes actives", value: "30+" },
      { label: "Groops créés", value: "12k" },
      { label: "Rencontres organisées", value: "58k" }
    ],
    marqueeItems: [
      "Runs au lever du soleil à Rabat",
      "Road trips vers Essaouira",
      "Food labs à Casablanca",
      "Randos à l'heure dorée",
      "Sessions de surf sur la côte",
      "Soirées studio créatives",
      "Rencontres de club de lecture",
      "Groupes de festival"
    ],
    sections: {
      discoverLabel: "Comment Groopin fonctionne",
      discoverTitle: "Pensé pour la connexion, conçu pour l'action.",
      groopsLabel: "Des Groops pour chaque énergie",
      groopsTitle: "Construisez un agenda qui vous ressemble vraiment.",
      trustLabel: "La confiance, par design",
      trustTitle: "La confiance avant même de sortir.",
      trustDescription: "Groopin aligne l'énergie, pour que chaque rencontre soit intentionnelle."
    },
    steps: [
      {
        title: "Définissez votre vibe",
        description:
          "Choisissez ce que vous voulez faire, comment vous voulez vous sentir, et qui vous voulez rencontrer."
      },
      {
        title: "Créez ou rejoignez un Groop",
        description:
          "Créez une activité ou rejoignez-en une qui correspond à votre énergie et votre timing."
      },
      {
        title: "Venez ensemble",
        description:
          "Connectez-vous à des personnes qui se soucient déjà des mêmes choses que vous."
      }
    ],
    activityGrid: [
      { title: "Mouvement", detail: "Runs, randos, sessions de surf", tone: "bg-[#F6C6A9]" },
      { title: "Culture", detail: "Soirées films, livres, musées", tone: "bg-[#F1E3B7]" },
      { title: "Voyage", detail: "Road trips, escapades, breaks urbains", tone: "bg-[#BFE6E8]" },
      { title: "Cuisine", detail: "Cafés, dégustations, ateliers cuisine", tone: "bg-[#D9F2C2]" },
      { title: "Création", detail: "Ateliers, arts, studios", tone: "bg-[#EAD4F2]" },
      { title: "Vie nocturne", detail: "Concerts, festivals, nuits", tone: "bg-[#F4B9D6]" }
    ],
    signals: [
      "Des profils avec des histoires, pas seulement des stats.",
      "Billetterie pour des événements vérifiés.",
      "Des filtres malins qui alignent énergie et timing.",
      "De vraies conversations avant de se rencontrer."
    ],
    trustCards: [
      {
        kicker: "Match d'énergie",
        title: "Un court quiz ajuste les personnes que vous rencontrez.",
        description: "Intérêts, rythme et humeur s'alignent avant même le premier bonjour."
      },
      {
        kicker: "La présence compte",
        title: "Les check-ins fluidifient les événements.",
        description: "Les hôtes savent qui vient, et les participants savent que c'est réel."
      }
    ],
    stories: [
      {
        quote: "J'ai trouvé des personnes qui randonnent à mon rythme. On dirait qu'on se connaît déjà.",
        name: "Hana",
        detail: "Marrakech"
      },
      {
        quote:
          "Groopin est le seul endroit où je peux mêler créativité et voyage, et rencontrer de belles personnes.",
        name: "Youssef",
        detail: "Casablanca"
      },
      {
        quote:
          "On a construit un rythme hebdo avec notre Groop. La ville paraît plus petite et plus chaleureuse.",
        name: "Salma",
        detail: "Rabat"
      }
    ],
    cta: {
      label: "Prêt à bouger",
      title: "Planifiez votre prochaine histoire avec un Groop.",
      description: "Ouvrez l'app et voyez ce qui se passe près de vous, maintenant.",
      openApp: "Ouvrir l'app",
      createOffer: "Créer une offre"
    },
    footer: {
      whoWeAre: "Qui sommes-nous",
      terms: "Conditions générales",
      contact: "Contact"
    }
  }
};

const languageOptions = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" }
];

export default function Home({ searchParams }) {
  const landingFlag = (process.env.LANDING_PAGE ?? process.env.landing_page ?? "")
    .toString()
    .toLowerCase();

  if (landingFlag !== "true") {
    redirect("/app");
  }

  const rawLang = searchParams?.lang;
  const langParam = Array.isArray(rawLang) ? rawLang[0] : rawLang;
  const language = langParam === "en" ? "en" : "fr";
  const content = translations[language];
  const basePath = `/?lang=${language}`;
  const anchorHref = (hash) => `${basePath}${hash}`;
  const whoWeAreHref = `/who-we-are?lang=${language}`;
  const termsHref = `/app/guest/terms-and-conditions?lang=${language}`;
  const marqueeLoop = [...content.marqueeItems, ...content.marqueeItems];

  return (
    <div
      className="min-h-screen bg-[#F4EFEA] text-charcoal-900"
      style={{
        "--brand": "#B12587",
        "--ink": "#1E1E1E",
        "--sand": "#F4EFEA",
        "--sun": "#F6C6A9",
        "--sky": "#BFE6E8",
        "--leaf": "#D9F2C2",
        "--dusk": "#2B2B2B",
        background:
          "radial-gradient(circle at 20% 10%, rgba(177,37,135,0.24), transparent 55%), radial-gradient(circle at 85% 20%, rgba(177,37,135,0.16), transparent 50%), radial-gradient(circle at 15% 35%, rgba(246,198,169,0.35), transparent 55%), linear-gradient(135deg, #F7E1F0 0%, #F4EFEA 45%, #E2F5F6 100%)"
      }}
    >
      <LanguageSync locale={language} />
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(circle at 18% 22%, rgba(177, 37, 135, 0.18), transparent 55%), radial-gradient(circle at 82% 18%, rgba(246, 198, 169, 0.28), transparent 55%), radial-gradient(circle at 42% 78%, rgba(191, 230, 232, 0.28), transparent 55%)"
            }}
          />
          <div className="absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[var(--brand)]/12 blur-[120px]" />
          <div className="absolute -top-32 -right-10 h-72 w-72 rounded-full bg-[var(--sun)]/55 blur-3xl" />
          <div className="absolute top-32 -left-24 h-96 w-96 rounded-full bg-[var(--sky)]/45 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-[var(--leaf)]/45 blur-3xl" />
          <div className="absolute bottom-24 left-1/4 h-44 w-44 rounded-full bg-white/65 blur-3xl" />
          <div className="pointer-events-none absolute left-[12%] top-[58%] h-3 w-3 rounded-full bg-[var(--brand)]/40" />
          <div className="pointer-events-none absolute right-[22%] bottom-[18%] h-4 w-4 rounded-full bg-[var(--sun)]/60" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--sand)]/90 to-transparent" />
        </div>

        <div className="relative z-10">
          <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pb-6 pt-8 lg:px-10">
            <Link href={basePath} className="flex items-center">
              <div className="leading-none">
                <AnimatedLogo width={132} height={34} />
                <p className="text-[11px] uppercase tracking-[0.28em] text-charcoal-500">
                  {content.tagline}
                </p>
              </div>
            </Link>
            <nav className="hidden items-center gap-8 text-sm font-semibold text-charcoal-700 md:flex">
              <Link href={anchorHref("#discover")} className="hover:text-charcoal-900">
                {content.nav.discover}
              </Link>
              <Link href={anchorHref("#groops")} className="hover:text-charcoal-900">
                {content.nav.groops}
              </Link>
              <Link href={anchorHref("#signals")} className="hover:text-charcoal-900">
                {content.nav.trust}
              </Link>
              <Link href={anchorHref("#stories")} className="hover:text-charcoal-900">
                {content.nav.stories}
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <div
                aria-label={content.languageLabel}
                className="inline-flex items-center rounded-full border border-charcoal-900/15 bg-white/70 p-1 text-[11px] font-semibold text-charcoal-700"
              >
                <span className="sr-only">{content.languageLabel}</span>
                {languageOptions.map((option) => (
                  <Link
                    key={option.code}
                    href={`/?lang=${option.code}`}
                    className={`rounded-full px-3 py-1 transition ${
                      language === option.code
                        ? "bg-charcoal-900 text-white"
                        : "text-charcoal-700 hover:text-charcoal-900"
                    }`}
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
              <Link
                href="/app/guest/login"
                className="hidden rounded-full border border-charcoal-900/20 px-4 py-2 text-sm font-semibold text-charcoal-800 transition hover:border-charcoal-900 hover:text-charcoal-900 md:inline-flex"
              >
                {content.buttons.openApp}
              </Link>
              <Link
                href="/app/guest/login"
                className="rounded-full bg-charcoal-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-charcoal-900/20 transition hover:-translate-y-0.5"
              >
                {content.buttons.startGroop}
              </Link>
            </div>
          </header>

          <main className="mx-auto w-full max-w-6xl px-6 pb-20 lg:px-10">
            <section className="grid items-center gap-12 pb-16 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-6 reveal-up">
                <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-600">
                  {content.hero.pill}
                </p>
                <h1 className={`${playfair.className} text-4xl font-semibold leading-tight text-charcoal-900 sm:text-5xl`}>
                  {content.hero.title}
                </h1>
                <p className="max-w-xl text-base text-charcoal-600 sm:text-lg">
                  {content.hero.description}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/app/guest/login"
                    className="rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(177,37,135,0.25)] transition hover:-translate-y-0.5"
                  >
                    {content.buttons.openWebApp}
                  </Link>
                  <Link
                    href={anchorHref("#discover")}
                    className="rounded-full border border-charcoal-900/20 px-6 py-3 text-sm font-semibold text-charcoal-800 transition hover:border-charcoal-900 hover:text-charcoal-900"
                  >
                    {content.buttons.seeHow}
                  </Link>
                </div>
                <div className="grid max-w-xl gap-6 pt-6 sm:grid-cols-3">
                  {content.stats.map((item) => (
                    <div key={item.label} className="space-y-1">
                      <p className="text-2xl font-semibold text-charcoal-900">{item.value}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-charcoal-500">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-8 hidden h-[88%] w-[88%] rounded-[32px] border border-charcoal-900/10 bg-white/70 backdrop-blur md:block" />
                <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/90 p-4 shadow-2xl shadow-charcoal-900/10">
                  <div className="relative overflow-hidden rounded-3xl">
                    <Image
                      src="/assets/images/website_picture.jpg"
                      alt={content.hero.imageAlt}
                      width={860}
                      height={980}
                      className="h-full w-full object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  </div>
                  <div className="absolute left-8 top-10 rounded-2xl bg-white/90 px-4 py-3 text-xs font-semibold text-charcoal-800 shadow-lg glow-pulse">
                    {content.hero.badges.live}
                  </div>
                  <div className="absolute bottom-8 left-8 rounded-2xl bg-white/90 px-4 py-3 text-xs font-semibold text-charcoal-800 shadow-lg">
                    "{content.hero.badges.quote}"
                  </div>
                  <div className="absolute bottom-10 right-6 hidden rounded-2xl bg-white/90 px-4 py-3 text-xs font-semibold text-charcoal-800 shadow-lg float-medium md:block">
                    {content.hero.badges.verified}
                  </div>
                </div>
              </div>
            </section>

            <section className="pb-16">
              <div className="relative overflow-hidden rounded-full border border-white/60 bg-white/75 py-3 shadow-lg shadow-charcoal-900/5">
                <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--sand)] to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--sand)] to-transparent" />
                <div className="marquee-track px-6 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-500">
                  {marqueeLoop.map((item, index) => (
                    <span key={`${item}-${index}`} className="flex items-center gap-3 whitespace-nowrap">
                      <span className="h-2 w-2 rounded-full bg-[var(--brand)]/70" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section id="discover" className="space-y-10 pb-16">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-500">
                  {content.sections.discoverLabel}
                </p>
                <h2 className={`${playfair.className} text-3xl font-semibold text-charcoal-900`}>
                  {content.sections.discoverTitle}
                </h2>
              </div>
              <div className="grid gap-6 lg:grid-cols-3">
                {content.steps.map((step, index) => (
                  <div
                    key={step.title}
                    className={`reveal-up rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg shadow-charcoal-900/5 ${
                      index === 1 ? "reveal-delay-1" : index === 2 ? "reveal-delay-2" : ""
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--brand)]/10 text-[var(--brand)] text-sm font-semibold">
                      0{index + 1}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-charcoal-900">{step.title}</h3>
                    <p className="mt-2 text-sm text-charcoal-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="groops" className="space-y-10 pb-16">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-500">
                  {content.sections.groopsLabel}
                </p>
                <h2 className={`${playfair.className} text-3xl font-semibold text-charcoal-900`}>
                  {content.sections.groopsTitle}
                </h2>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {content.activityGrid.map((card, index) => (
                  <div
                    key={card.title}
                    className={`reveal-up overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-lg shadow-charcoal-900/5 ${
                      index % 3 === 1 ? "reveal-delay-1" : index % 3 === 2 ? "reveal-delay-2" : ""
                    }`}
                  >
                    <div className={`h-2 ${card.tone}`} />
                    <div className="space-y-2 p-6">
                      <h3 className="text-lg font-semibold text-charcoal-900">{card.title}</h3>
                      <p className="text-sm text-charcoal-600">{card.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="signals" className="grid gap-10 pb-16 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-lg shadow-charcoal-900/5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-500">
                  {content.sections.trustLabel}
                </p>
                <h2 className={`${playfair.className} mt-3 text-3xl font-semibold text-charcoal-900`}>
                  {content.sections.trustTitle}
                </h2>
                <p className="mt-3 text-sm text-charcoal-600">
                  {content.sections.trustDescription}
                </p>
                <div className="mt-6 space-y-3 text-sm text-charcoal-700">
                  {content.signals.map((signal) => (
                    <div key={signal} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[var(--brand)]" />
                      <span>{signal}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-4">
                <div className="rounded-[28px] border border-white/70 bg-gradient-to-br from-white via-white/80 to-transparent p-6 shadow-lg shadow-charcoal-900/5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-500">
                    {content.trustCards[0].kicker}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-charcoal-900">
                    {content.trustCards[0].title}
                  </p>
                  <p className="mt-2 text-sm text-charcoal-600">
                    {content.trustCards[0].description}
                  </p>
                </div>
                <div className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-lg shadow-charcoal-900/5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-500">
                    {content.trustCards[1].kicker}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-charcoal-900">
                    {content.trustCards[1].title}
                  </p>
                  <p className="mt-2 text-sm text-charcoal-600">
                    {content.trustCards[1].description}
                  </p>
                </div>
              </div>
            </section>

            <section id="stories" className="grid gap-8 pb-16 lg:grid-cols-3">
              {content.stories.map((story, index) => (
                <div
                  key={story.name}
                  className={`reveal-up rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-lg shadow-charcoal-900/5 ${
                    index === 1 ? "reveal-delay-1" : index === 2 ? "reveal-delay-2" : ""
                  }`}
                >
                  <p className="text-sm text-charcoal-700">"{story.quote}"</p>
                  <div className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-500">
                    {story.name} - {story.detail}
                  </div>
                </div>
              ))}
            </section>

            <section className="rounded-[36px] border border-white/70 bg-charcoal-900 px-8 py-10 text-white shadow-2xl shadow-charcoal-900/20">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                    {content.cta.label}
                  </p>
                  <h2 className={`${playfair.className} mt-3 text-3xl font-semibold`}>
                    {content.cta.title}
                  </h2>
                  <p className="mt-3 text-sm text-white/70">
                    {content.cta.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/app/guest/login"
                    className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-charcoal-900 transition hover:-translate-y-0.5"
                  >
                    {content.cta.openApp}
                  </Link>
                  <Link
                    href="/app/guest/login"
                    className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
                  >
                    {content.cta.createOffer}
                  </Link>
                </div>
              </div>
            </section>

            <footer className="mt-14 border-t border-white/70 pt-10 pb-12">
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3">
                  <AnimatedLogo width={132} height={34} />
                  <p className="max-w-xs text-xs uppercase tracking-[0.28em] text-charcoal-500">
                    {content.tagline}
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-charcoal-700">
                  <Link href={whoWeAreHref} className="hover:text-charcoal-900">
                    {content.footer.whoWeAre}
                  </Link>
                  <Link href={termsHref} className="hover:text-charcoal-900">
                    {content.footer.terms}
                  </Link>
                  <a href="mailto:contact@groopin.io" className="hover:text-charcoal-900">
                    {content.footer.contact}
                  </a>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}

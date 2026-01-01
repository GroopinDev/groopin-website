import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Playfair_Display } from "next/font/google";
import AnimatedLogo from "../components/ui/animated-logo";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap"
});

const steps = [
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
];

const activityGrid = [
  { title: "Movement", detail: "Runs, hikes, surf sessions", tone: "bg-[#F6C6A9]" },
  { title: "Culture", detail: "Film nights, books, museums", tone: "bg-[#F1E3B7]" },
  { title: "Travel", detail: "Road trips, escapes, city breaks", tone: "bg-[#BFE6E8]" },
  { title: "Food", detail: "Cafes, tastings, cooking labs", tone: "bg-[#D9F2C2]" },
  { title: "Creation", detail: "Workshops, arts, studios", tone: "bg-[#EAD4F2]" },
  { title: "Nightlife", detail: "Concerts, festivals, lights", tone: "bg-[#F4B9D6]" }
];

const signals = [
  "Profiles with stories, not just stats.",
  "Ticketing for verified events.",
  "Smart filters that match energy and timing.",
  "Real conversations before you meet."
];

const marqueeItems = [
  "Sunrise runs in Rabat",
  "Road trips to Essaouira",
  "Casablanca food labs",
  "Golden hour hikes",
  "Coastal surf sessions",
  "Creative studio nights",
  "Book club meetups",
  "Festival squads"
];

const marqueeLoop = [...marqueeItems, ...marqueeItems];

export default function Home() {
  const landingFlag = (process.env.LANDING_PAGE ?? process.env.landing_page ?? "")
    .toString()
    .toLowerCase();

  if (landingFlag !== "true") {
    redirect("/app");
  }

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
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-multiply logo-drift"
            style={{
              backgroundImage: "url('/assets/images/logo.png')",
              backgroundRepeat: "repeat",
              backgroundSize: "220px 220px"
            }}
          />
          <div className="pointer-events-none absolute inset-0 opacity-70 aurora" />
          <div className="absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[var(--brand)]/15 blur-[120px] float-slow" />
          <div className="absolute -top-32 -right-10 h-72 w-72 rounded-full bg-[var(--sun)]/60 blur-3xl drift-right" />
          <div className="absolute top-32 -left-24 h-96 w-96 rounded-full bg-[var(--sky)]/50 blur-3xl drift-left" />
          <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-[var(--leaf)]/50 blur-3xl float-medium" />
          <div className="absolute bottom-24 left-1/4 h-44 w-44 rounded-full bg-white/70 blur-3xl glow-pulse" />
          <div className="pointer-events-none absolute right-[12%] top-16 h-28 w-28 rounded-full border border-white/70/80 rotate-slow" />
          <div className="pointer-events-none absolute left-[12%] top-[58%] h-3 w-3 rounded-full bg-[var(--brand)]/50 float-fast" />
          <div className="pointer-events-none absolute right-[22%] bottom-[18%] h-4 w-4 rounded-full bg-[var(--sun)]/70 float-medium" />
          <Image
            src="/assets/images/logo.png"
            alt="Groopin logo watermark"
            width={420}
            height={420}
            className="pointer-events-none absolute -left-20 top-12 w-[260px] opacity-10 rotate-slow"
          />
          <Image
            src="/assets/images/groopin-splash.png"
            alt="Groopin splash watermark"
            width={520}
            height={520}
            className="pointer-events-none absolute right-[-140px] top-[30%] hidden w-[380px] opacity-10 rotate-slow md:block"
          />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--sand)]/90 to-transparent" />
        </div>

        <div className="relative z-10">
          <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pb-6 pt-8 lg:px-10">
            <Link href="/" className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-lg shadow-charcoal-900/10">
                <Image src="/assets/images/logo.png" alt="Groopin" width={32} height={32} />
              </span>
              <div className="leading-none">
                <AnimatedLogo width={120} height={32} />
                <p className="text-xs text-charcoal-500">Find your people fast</p>
              </div>
            </Link>
            <nav className="hidden items-center gap-8 text-sm font-semibold text-charcoal-700 md:flex">
              <Link href="#discover" className="hover:text-charcoal-900">
                Discover
              </Link>
              <Link href="#groops" className="hover:text-charcoal-900">
                Groops
              </Link>
              <Link href="#signals" className="hover:text-charcoal-900">
                Trust
              </Link>
              <Link href="#stories" className="hover:text-charcoal-900">
                Stories
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/app/guest/login"
                className="hidden rounded-full border border-charcoal-900/20 px-4 py-2 text-sm font-semibold text-charcoal-800 transition hover:border-charcoal-900 hover:text-charcoal-900 md:inline-flex"
              >
                Open the app
              </Link>
              <Link
                href="/app/guest/login"
                className="rounded-full bg-charcoal-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-charcoal-900/20 transition hover:-translate-y-0.5"
              >
                Start a Groop
              </Link>
            </div>
          </header>

          <main className="mx-auto w-full max-w-6xl px-6 pb-20 lg:px-10">
            <section className="grid items-center gap-12 pb-16 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-6 reveal-up">
                <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-600">
                  Real people. Real moments.
                </p>
                <h1 className={`${playfair.className} text-4xl font-semibold leading-tight text-charcoal-900 sm:text-5xl`}>
                  Where paths cross, adventures begin.
                </h1>
                <p className="max-w-xl text-base text-charcoal-600 sm:text-lg">
                  Groopin helps you build small groups around the experiences you want.
                  Meet people who already share your interests, pace, and intent.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/app/guest/login"
                    className="rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(177,37,135,0.25)] transition hover:-translate-y-0.5"
                  >
                    Open the web app
                  </Link>
                  <Link
                    href="#discover"
                    className="rounded-full border border-charcoal-900/20 px-6 py-3 text-sm font-semibold text-charcoal-800 transition hover:border-charcoal-900 hover:text-charcoal-900"
                  >
                    See how it works
                  </Link>
                </div>
                <div className="grid max-w-xl gap-6 pt-6 sm:grid-cols-3">
                  {[
                    { label: "Active cities", value: "30+" },
                    { label: "Groops formed", value: "12k" },
                    { label: "Meetups hosted", value: "58k" }
                  ].map((item) => (
                    <div key={item.label} className="space-y-1">
                      <p className="text-2xl font-semibold text-charcoal-900">{item.value}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-charcoal-500">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative float-slow">
                <div className="absolute -left-6 top-8 hidden h-[88%] w-[88%] rounded-[32px] border border-charcoal-900/10 bg-white/70 backdrop-blur md:block" />
                <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/90 p-4 shadow-2xl shadow-charcoal-900/10">
                  <div className="relative overflow-hidden rounded-3xl">
                    <Image
                      src="/assets/images/website_picture.jpg"
                      alt="Friends meeting through Groopin"
                      width={860}
                      height={980}
                      className="h-full w-full object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  </div>
                  <div className="absolute left-8 top-10 rounded-2xl bg-white/90 px-4 py-3 text-xs font-semibold text-charcoal-800 shadow-lg glow-pulse">
                    +340 Groops live today
                  </div>
                  <div className="absolute bottom-8 left-8 rounded-2xl bg-white/90 px-4 py-3 text-xs font-semibold text-charcoal-800 shadow-lg">
                    "Best way to meet new people"
                  </div>
                  <div className="absolute bottom-10 right-6 hidden rounded-2xl bg-white/90 px-4 py-3 text-xs font-semibold text-charcoal-800 shadow-lg float-medium md:block">
                    Verified hosts & tickets
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
                  How Groopin works
                </p>
                <h2 className={`${playfair.className} text-3xl font-semibold text-charcoal-900`}>
                  Designed for connection, built for action.
                </h2>
              </div>
              <div className="grid gap-6 lg:grid-cols-3">
                {steps.map((step, index) => (
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
                  Groops for every energy
                </p>
                <h2 className={`${playfair.className} text-3xl font-semibold text-charcoal-900`}>
                  Build a calendar that actually feels like you.
                </h2>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {activityGrid.map((card, index) => (
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
                  Trust by design
                </p>
                <h2 className={`${playfair.className} mt-3 text-3xl font-semibold text-charcoal-900`}>
                  Confidence before you step out the door.
                </h2>
                <p className="mt-3 text-sm text-charcoal-600">
                  Groopin keeps the energy aligned, so every meetup feels intentional.
                </p>
                <div className="mt-6 space-y-3 text-sm text-charcoal-700">
                  {signals.map((signal) => (
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
                    Groove match
                  </p>
                  <p className="mt-2 text-lg font-semibold text-charcoal-900">
                    A short quiz tunes the people you meet.
                  </p>
                  <p className="mt-2 text-sm text-charcoal-600">
                    Interests, pace, and mood align before anyone says hello.
                  </p>
                </div>
                <div className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-lg shadow-charcoal-900/5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-500">
                    Presence matters
                  </p>
                  <p className="mt-2 text-lg font-semibold text-charcoal-900">
                    Check-ins keep events smooth.
                  </p>
                  <p className="mt-2 text-sm text-charcoal-600">
                    Hosts know who is coming, and participants know it is real.
                  </p>
                </div>
              </div>
            </section>

            <section id="stories" className="grid gap-8 pb-16 lg:grid-cols-3">
              {[
                {
                  quote:
                    "I found people who hike at my pace. It feels like we already know each other.",
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
                  quote:
                    "We built a weekly rhythm with our Groop. The city feels smaller and warmer.",
                  name: "Salma",
                  detail: "Rabat"
                }
              ].map((story, index) => (
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
                    Ready to move
                  </p>
                  <h2 className={`${playfair.className} mt-3 text-3xl font-semibold`}>
                    Plan your next story with a Groop.
                  </h2>
                  <p className="mt-3 text-sm text-white/70">
                    Open the app and see what is happening near you right now.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/app/guest/login"
                    className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-charcoal-900 transition hover:-translate-y-0.5"
                  >
                    Open the app
                  </Link>
                  <Link
                    href="/app/guest/login"
                    className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
                  >
                    Create an offer
                  </Link>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import AnimatedLogo from "../../components/ui/animated-logo";
import LanguageSync from "../../components/language-sync";
import { getTranslationValue, normalizeLocale } from "../lib/i18n";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap"
});

const translations = {
  en: {
    languageLabel: "Language",
    nav: {
      home: "Home"
    },
    buttons: {
      openApp: "Open the app"
    },
    sectionKicker: "About Groopin",
    cards: {
      missionKicker: "Mission",
      visionKicker: "Vision"
    },
    cta: {
      label: "Ready to connect",
      title: "Build your next real-life moment.",
      description: "Create or join a Groop and meet people who share your energy.",
      openApp: "Open the app",
      backHome: "Back to home"
    }
  },
  fr: {
    languageLabel: "Langue",
    nav: {
      home: "Accueil"
    },
    buttons: {
      openApp: "Ouvrir l'app"
    },
    sectionKicker: "À propos de Groopin",
    cards: {
      missionKicker: "Mission",
      visionKicker: "Vision"
    },
    cta: {
      label: "Prêt à se connecter",
      title: "Créez votre prochain moment en vrai.",
      description: "Créez ou rejoignez un Groop et rencontrez des personnes qui partagent votre énergie.",
      openApp: "Ouvrir l'app",
      backHome: "Retour à l'accueil"
    }
  }
};

const languageOptions = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" }
];

export default function WhoWeArePage({ searchParams }) {
  const rawLang = searchParams?.lang;
  const langParam = Array.isArray(rawLang) ? rawLang[0] : rawLang;
  const normalized = normalizeLocale(langParam || "fr");
  const language = normalized === "en" ? "en" : "fr";
  const content = translations[language];
  const about = getTranslationValue(language, "about") || {};
  const homeHref = `/?lang=${language}`;

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
        background:
          "radial-gradient(circle at 20% 10%, rgba(177,37,135,0.18), transparent 60%), radial-gradient(circle at 85% 18%, rgba(246,198,169,0.25), transparent 60%), radial-gradient(circle at 12% 70%, rgba(191,230,232,0.25), transparent 55%), linear-gradient(140deg, #F7E1F0 0%, #F4EFEA 45%, #E2F5F6 100%)"
      }}
    >
      <div className="relative">
        <LanguageSync locale={language} />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--sand)]/80 to-transparent" />
        <div className="relative z-10">
          <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pb-6 pt-8 lg:px-10">
            <Link href={homeHref} className="flex items-center">
              <AnimatedLogo width={132} height={34} />
            </Link>
            <div className="flex items-center gap-3">
              <div
                aria-label={content.languageLabel}
                className="inline-flex items-center rounded-full border border-charcoal-900/15 bg-white/70 p-1 text-[11px] font-semibold text-charcoal-700"
              >
                <span className="sr-only">{content.languageLabel}</span>
                {languageOptions.map((option) => (
                  <Link
                    key={option.code}
                    href={`/who-we-are?lang=${option.code}`}
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
              <div className="flex items-center gap-3 text-sm font-semibold text-charcoal-700">
                <Link href={homeHref} className="hidden hover:text-charcoal-900 md:inline-flex">
                  {content.nav.home}
                </Link>
                <Link
                  href="/app/guest/login"
                  className="rounded-full border border-charcoal-900/20 px-4 py-2 transition hover:border-charcoal-900 hover:text-charcoal-900"
                >
                  {content.buttons.openApp}
                </Link>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-6xl px-6 pb-20 lg:px-10">
            <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-500">
                  {content.sectionKicker}
                </p>
                <h1 className={`${playfair.className} text-4xl font-semibold text-charcoal-900 sm:text-5xl`}>
                  {about?.title || "Who are we?"}
                </h1>
                <p className="max-w-2xl text-base text-charcoal-700 sm:text-lg">
                  {about?.paragraph1}
                </p>
                <p className="max-w-2xl text-base text-charcoal-700 sm:text-lg">
                  {about?.paragraph2}
                </p>
              </div>

              <div className="space-y-5">
                <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-lg shadow-charcoal-900/5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-500">
                    {content.cards.missionKicker}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-charcoal-900">
                    {about?.missionTitle}
                  </p>
                  <p className="mt-2 text-sm text-charcoal-600">
                    {about?.missionText}
                  </p>
                </div>
                <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-lg shadow-charcoal-900/5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-500">
                    {content.cards.visionKicker}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-charcoal-900">
                    {about?.goalTitle}
                  </p>
                  <p className="mt-2 text-sm text-charcoal-600">
                    {about?.goalText}
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-16 rounded-[32px] border border-white/70 bg-charcoal-900 px-8 py-10 text-white shadow-2xl shadow-charcoal-900/20">
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
                    href={homeHref}
                    className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
                  >
                    {content.cta.backHome}
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

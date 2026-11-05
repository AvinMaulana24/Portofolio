import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Mail, Github, Linkedin, Instagram, MessageCircle } from "lucide-react";
import { Reveal, SplitText, Magnetic } from "../components/ui";
import { P } from "../data";
const links = [
  [Mail, "Email", "mailto:" + P.email],
  [MessageCircle, "WhatsApp", P.wa],
  [Github, "GitHub", P.github],
  [Linkedin, "LinkedIn", P.linkedin],
  [Instagram, "Instagram", P.instagram],
];
const F = [
  ["name", "Name", "text"],
  ["email", "Email", "email"],
  ["subject", "Subject", "text"],
];
const empty = { name: "", email: "", subject: "", message: "" };
export default function Contact() {
  const [f, setF] = useState(empty),
    [er, setEr] = useState({}),
    [st, setSt] = useState("idle");
  const val = () => {
    const e = {};
    if (f.name.trim().length < 2) e.name = "Isi nama minimal 2 karakter.";
    if (!/^\S+@\S+\.\S+$/.test(f.email))
      e.email = "Masukkan alamat email yang valid.";
    if (f.subject.trim().length < 3)
      e.subject = "Isi subjek minimal 3 karakter.";
    if (f.message.trim().length < 10)
      e.message = "Isi pesan minimal 10 karakter.";
    return e;
  };
  const send = async (ev) => {
    ev.preventDefault();
    const v = val();
    setEr(v);
    if (Object.keys(v).length) return;
    setSt("loading");
    try {
      const E = import.meta.env;
      await emailjs.send(
        E.VITE_EMAILJS_SERVICE_ID,
        E.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: f.name,
          reply_to: f.email,
          subject: f.subject,
          message: f.message,
        },
        { publicKey: E.VITE_EMAILJS_PUBLIC_KEY },
      );
      setSt("ok");
      setF(empty);
    } catch {
      setSt("err");
    }
  };
  const c =
    "min-h-11 w-full appearance-none rounded-none border-b border-bg/40 bg-transparent py-3 text-base outline-none transition-colors focus:border-sun";
  return (
    <section id="contact" className="bg-accent text-bg">
      <div className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-40">
        <h2 className="max-w-5xl font-display text-[clamp(2.4rem,7vw,6rem)] font-extrabold leading-[.95]">
          <SplitText text="Have an Idea? Let's Build Something Great." />
        </h2>
        <div className="mt-16 grid gap-16 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="text-bg/80">
              Terbuka untuk peluang kolaborasi, pengembangan proyek, dan
              kesempatan profesional.
            </p>
            <ul className="mt-10 space-y-3">
              {links.map(([I, l, h]) => (
                <li key={l}>
                  <Magnetic s={0.15}>
                    <a
                      href={h}
                      target="_blank"
                      rel="noreferrer"
                      className="flex min-h-11 items-center gap-3 py-1 hover:underline"
                    >
                      <I size={18} />
                      {l}
                    </a>
                  </Magnetic>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7">
            <form onSubmit={send} noValidate className="space-y-7">
              {F.map(([k, l, t]) => (
                <div key={k}>
                  <label htmlFor={k} className="text-sm text-bg/70">
                    {l}
                  </label>
                  <input
                    id={k}
                    type={t}
                    value={f[k]}
                    onChange={(e) => setF({ ...f, [k]: e.target.value })}
                    aria-invalid={!!er[k]}
                    autoComplete={k === "subject" ? "off" : k}
                    inputMode={k === "email" ? "email" : undefined}
                    className={c}
                  />
                  {er[k] && (
                    <p role="alert" className="mt-1 text-xs text-sun">
                      {er[k]}
                    </p>
                  )}
                </div>
              ))}
              <div>
                <label htmlFor="message" className="text-sm text-bg/70">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  value={f.message}
                  onChange={(e) => setF({ ...f, message: e.target.value })}
                  aria-invalid={!!er.message}
                  className={c + " resize-none"}
                />
                {er.message && (
                  <p role="alert" className="mt-1 text-xs text-sun">
                    {er.message}
                  </p>
                )}
              </div>
              <button
                disabled={st === "loading"}
                className="min-h-12 w-full rounded-full bg-bg px-8 py-3.5 text-sm font-medium text-ink disabled:opacity-50 sm:w-auto"
              >
                {st === "loading" ? "Sending…" : "Send Message"}
              </button>
              <p
                aria-live="polite"
                className={`text-sm ${st === "ok" ? "text-bg" : "text-sun"}`}
              >
                {st === "ok" &&
                  "Pesan terkirim. Saya akan membalas lewat email."}
                {st === "err" &&
                  "Pesan gagal terkirim. Periksa konfigurasi EmailJS di file .env, lalu coba lagi."}
              </p>
            </form>
          </Reveal>
        </div>
        <footer className="relative z-20 border-t border-[#8880D6]/20 bg-[#08090d]/90 backdrop-blur-md pt-12 pb-10 mt-16 overflow-hidden">
          <div className="wrap max-w-7xl mx-auto px-4 sm:px-6 md:px-10 flex flex-col items-center justify-between gap-6 text-center md:text-left md:flex-row">
            {/* Identitas Brand / Logo */}
            <div className="flex flex-col items-center md:items-start gap-1 w-full md:w-auto">
              <p className="text-xs sm:text-sm text-[#A49BEE]/80 font-mono">
                Software Developer &amp; Creative Programmer
              </p>
            </div>

            {/* Copyright */}
            <div className="text-xs font-mono text-[#A49BEE]/60 text-center">
              © 2026 Muhammad Avin Maulana. All rights reserved.
            </div>

            {/* Navigasi Sosial & Tombol Kembali ke Atas */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 w-full md:w-auto">
              <nav
                aria-label="Social"
                className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-mono text-[#DCD7FF]/80"
              >
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FFC21A] transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FFC21A] transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FFC21A] transition-colors"
                >
                  Instagram
                </a>
              </nav>

              <Mag
                as="a"
                href="#home"
                className="p-2.5 sm:p-3 rounded-2xl bg-[#39326D]/60 border border-[#8880D6]/30 text-[#DCD7FF] hover:text-[#FFC21A] transition-colors flex items-center justify-center"
              >
                <ArrowUp size={16} />
              </Mag>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}

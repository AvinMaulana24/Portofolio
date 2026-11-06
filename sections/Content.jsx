import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal, SplitText, Counter, Tilt } from "../components/ui";
import { tech, projects, journey } from "../data";
gsap.registerPlugin(ScrollTrigger);
const W = "mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-40";
const H =
  "font-display text-[clamp(2.6rem,8vw,7rem)] font-extrabold leading-[.9]";
const Art = ({ n }) => {
  const S = [
    <>
      <rect width="400" height="300" fill="#E8452C" />
      <circle cx="140" cy="150" r="110" fill="#1C2BD9" />
      <rect x="200" y="40" width="120" height="220" fill="#FFC21A" />
      <circle cx="260" cy="150" r="46" fill="#141414" />
    </>,
    <>
      <rect width="400" height="300" fill="#FFC21A" />
      <path d="M0 300A300 300 0 0 1 300 0V300Z" fill="#141414" />
      <circle cx="300" cy="90" r="60" fill="#E8452C" />
      <rect x="40" y="40" width="90" height="90" fill="#1C2BD9" />
    </>,
    <>
      <rect width="400" height="300" fill="#1C2BD9" />
      <circle
        cx="200"
        cy="150"
        r="120"
        fill="none"
        stroke="#ECEAE4"
        strokeWidth="26"
      />
      <circle cx="200" cy="150" r="60" fill="#FFC21A" />
      <rect y="230" width="400" height="14" fill="#E8452C" />
    </>,
  ];
  return (
    <svg
      viewBox="0 0 400 300"
      className="block h-full w-full"
      role="img"
      aria-label="Ilustrasi abstrak sebagai placeholder proyek"
    >
      {S[n]}
    </svg>
  );
};
export function About() {
  return (
    <section id="about" className="relative overflow-hidden py-28 md:py-44">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-40 h-72 w-72 rounded-full bg-sun mix-blend-multiply md:h-[28rem] md:w-[28rem]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-10 top-24 h-48 w-48 bg-verm mix-blend-multiply md:h-72 md:w-72 md:rotate-12"
      />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <h2 className="font-display text-[clamp(3.5rem,13vw,12rem)] font-extrabold leading-[.82]">
          <span className="block">
            <SplitText text="Beyond" />
          </span>
          <span className="block md:ml-[22%]">
            <SplitText text="The Code." />
          </span>
        </h2>
        <div className="mt-20 grid items-start gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-5 md:col-start-2">
            <p className="font-display text-2xl font-bold leading-snug">
              Saya merupakan lulusan Rekayasa Perangkat Lunak dengan
              ketertarikan pada software development, web development, mobile
              application development, database management, dan problem solving.
            </p>
            <p className="mt-5 text-mute">
              Saya menikmati proses mengubah ide menjadi produk digital melalui
              kombinasi logika pemrograman, kreativitas, dan teknologi.
            </p>
            <dl className="mt-10 flex gap-8">
              {[
                [3, "Proyek unggulan"],
                [4, "Bahasa pemrograman"],
                [2, "Platform web & mobile"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-display text-5xl font-bold">
                    <Counter to={n} />
                  </dt>
                  <dd className="text-xs text-mute">{l}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal
            delay={0.1}
            className="md:col-span-4 md:col-start-8 md:-mt-24"
          >
            <div className="grid h-64 w-64 -rotate-6 place-items-center rounded-full bg-ink p-6 text-center text-bg md:h-80 md:w-80">
              <div>
                <div className="font-display text-7xl font-extrabold">
                  <Counter to={3.68} dec={2} />
                </div>
                <p className="text-sm">IPK, Rekayasa Perangkat Lunak</p>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="mt-20 grid gap-8 md:grid-cols-2">
          <Reveal>
            <div className="-rotate-2 bg-sun p-6 shadow-lg md:max-w-sm">
              <b className="font-display text-lg">Cara kerja</b>
              <p className="mt-2 text-sm">
                Mengubah ide menjadi produk digital lewat logika, kreativitas,
                dan teknologi. [Tambahkan filosofi kerja pribadi]
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rotate-2 bg-white p-6 shadow-lg md:ml-auto md:max-w-sm">
              <b className="font-display text-lg">Minat saat ini</b>
              <p className="mt-2 text-sm">
                Web development, mobile app, database, dan problem solving.
                [Tambahkan minat terbaru]
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
const sw = [
    "bg-accent text-bg",
    "bg-sun text-ink",
    "bg-verm text-bg",
    "bg-ink text-bg",
    "border border-ink bg-bg2 text-ink",
  ],
  rot = ["-8deg", "-3deg", "2deg", "6deg", "-5deg"];
export function Skills() {
  return (
    <section id="skills" className="overflow-hidden">
      <div className={W}>
        <h2 className={H}>
          <SplitText text="The Palette." />
        </h2>
        <p className="mt-5 max-w-md text-mute">
          Teknologi yang saya pakai, disusun seperti kartu swatch cat. Arahkan
          kursor untuk meluruskannya.
        </p>
        <ul className="mt-20 flex flex-wrap justify-center gap-4 pb-10 md:flex-nowrap md:gap-0">
          {Object.entries(tech).map(([g, items], i) => (
            <motion.li
              key={g}
              data-cursor
              style={{
                rotate: rot[i],
                zIndex: i,
                marginTop: i % 2 ? "2.5rem" : 0,
              }}
              whileHover={{ rotate: 0, y: -28, scale: 1.05, zIndex: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className={`flex h-72 w-44 shrink-0 flex-col justify-between p-5 shadow-xl md:-ml-5 md:h-[26rem] md:w-60 md:first:ml-0 ${sw[i]}`}
            >
              <h3 className="font-display text-xl font-bold">{g}</h3>
              <ul className="space-y-1">
                {items.map((t) => (
                  <li
                    key={t}
                    className="border-t border-current/30 pt-1 text-sm"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
const off = ["md:-mt-24", "md:mt-28", "md:-mt-8"];
export function Projects() {
  const r = useRef(),
    t = useRef();
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width:768px) and (prefers-reduced-motion:no-preference)",
      () => {
        const d = () => t.current.scrollWidth - innerWidth;
        gsap.to(t.current, {
          x: () => -d(),
          ease: "none",
          scrollTrigger: {
            trigger: r.current,
            start: "top top",
            end: () => "+=" + d(),
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      },
    );
    return () => mm.revert();
  }, []);
  return (
    <section
      id="projects"
      ref={r}
      className="overflow-hidden bg-bg2 md:h-screen"
    >
      <div
        ref={t}
        className="flex flex-col gap-24 px-6 py-28 md:h-full md:w-max md:flex-row md:items-center md:gap-0 md:px-0 md:py-0"
      >
        <div className="md:w-[42vw] md:shrink-0 md:px-10">
          <h2 className={H}>
            <SplitText text="Selected" />
            <br />
            <SplitText text="Works." />
          </h2>
          <p className="mt-6 max-w-xs text-mute">
            Berjalanlah di galeri: scroll ke bawah dan karya bergeser ke
            samping.
          </p>
        </div>
        {projects.map((p, i) => (
          <article
            key={p.t}
            className={`md:w-[52vw] md:shrink-0 md:px-[3vw] ${off[i]}`}
          >
            <Tilt>
              <motion.div
                data-cursor
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                className="bg-white p-3 shadow-[0_30px_60px_-25px_rgba(20,20,20,.5)] md:w-[34vw] md:p-5"
              >
                <div className="aspect-[4/3]">
                  <Art n={i} />
                </div>
              </motion.div>
            </Tilt>
            <div className="relative -mt-6 ml-6 w-72 border border-ink bg-white p-4 md:ml-[18vw]">
              <h3 className="font-display text-xl font-bold">
                {p.t}, <span className="font-normal text-mute">[Tahun]</span>
              </h3>
              <p className="text-xs text-mute">{p.tags.join(", ")}</p>
              <p className="mt-2 text-sm">{p.d}</p>
              <div className="mt-3 flex gap-5 text-sm font-medium">
                <a
                  href={p.view}
                  className="underline underline-offset-4 hover:text-accent"
                >
                  View Project
                </a>
                <a
                  href={p.src}
                  className="underline underline-offset-4 hover:text-accent"
                >
                  Source Code
                </a>
              </div>
            </div>
          </article>
        ))}
        <div className="hidden w-[10vw] shrink-0 md:block" />
      </div>
    </section>
  );
}
export function Journey() {
  return (
    <section id="journey" className={W}>
      <h2 className={H}>
        <SplitText text="Biography." />
      </h2>
      <ul className="mt-16">
        {journey.map((j, i) => (
          <Reveal key={j.t}>
            <li
              style={{ "--o": i * 9 + "%" }}
              className={`border-t border-line py-8 md:ml-[var(--o)] md:w-3/5 ${j.real ? "" : "text-mute"}`}
            >
              <span className="text-sm">{j.y}</span>
              <h3
                className={`font-display text-3xl font-bold md:text-5xl ${j.real ? "text-ink" : ""}`}
              >
                {j.t}
              </h3>
              <p className="mt-1">{j.d}</p>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

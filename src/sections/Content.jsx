import { motion } from "framer-motion";
import { Reveal, SplitText, Counter, Tilt } from "../components/ui";
import { tech, projects, journey } from "../data";

const W = "mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-40";

const Art = ({ n }) => {
  const S = [
    <>
      <rect width="400" height="300" fill="#625E91" />
      <circle cx="140" cy="150" r="110" fill="#39326D" />
      <rect x="200" y="40" width="120" height="220" fill="#FFC21A" rx="30" />
      <circle cx="260" cy="150" r="46" fill="#141414" />
    </>,
    <>
      <rect width="400" height="300" fill="#FFC21A" />
      <path d="M0 300A300 300 0 0 1 300 0V300Z" fill="#29264D" />
      <circle cx="300" cy="90" r="60" fill="#8880D6" />
      <rect x="40" y="40" width="90" height="90" fill="#A49BEE" rx="20" />
    </>,
    <>
      <rect width="400" height="300" fill="#39326D" />
      <circle
        cx="200"
        cy="150"
        r="120"
        fill="none"
        stroke="#DCD7FF"
        strokeWidth="26"
      />
      <circle cx="200" cy="150" r="60" fill="#FFC21A" />
      <rect y="230" width="400" height="14" fill="#8880D6" rx="7" />
    </>,
  ];
  return (
    <svg
      viewBox="0 0 400 300"
      className="block h-full w-full"
      role="img"
      aria-label="Ilustrasi abstrak organik"
    >
      {S[n]}
    </svg>
  );
};

export function About() {
  return (
    <section id="about" className={`${W} relative`}>
      {/* Latar Belakang Pahatan Organik Melingkar */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-4 top-12 h-32 w-32 rounded-full bg-sun/30 blur-2xl sm:right-6 sm:top-24 sm:h-64 sm:w-64"
      />

      {/* Panel Utama dengan Siluet Organik Mengalir */}
      <div className="p-8 md:p-16 border border-[#8880D6]/20 backdrop-blur-xl">
        <h2 className="relative font-display text-[clamp(2.5rem,8vw,7.5rem)] font-extrabold leading-[.9] text-[#DCD7FF]">
          <SplitText text="Beyond The Code." />
        </h2>

        <div className="relative mt-16 grid gap-12 lg:grid-cols-12">
          <Reveal className="space-y-5 text-lg lg:col-span-6 text-[#DCD7FF]/80">
            <p>
              Saya merupakan lulusan Rekayasa Perangkat Lunak dengan
              ketertarikan pada software development, web development, mobile
              application development, database management, dan problem solving.
            </p>
            <p className="text-[#A49BEE]">
              Saya menikmati proses mengubah ide menjadi produk digital melalui
              kombinasi logika pemrograman, kreativitas, dan teknologi pahatan
              antarmuka masa depan.
            </p>
          </Reveal>

          <Reveal
            delay={0.15}
            className="lg:col-span-5 lg:col-start-8 p-6 bg-[#29264D]/50 rounded-[40px_20px_50px_30px] border border-[#8880D6]/30 shadow-2xl"
          >
            <div className="relative mb-8 aspect-[4/3] w-full overflow-hidden rounded-[32px_16px_40px_24px] border border-[#8880D6]/40 shadow-2xl">
              <img
                src={import.meta.env.BASE_URL + "foto.jpg"}
                alt="Foto Muhammad Avin Maulana"
                width="800"
                height="1000"
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div className="border-l-2 border-[#FFC21A] pl-5">
              <p className="text-sm text-[#A49BEE]">Pendidikan</p>
              <p className="font-display text-2xl font-bold text-[#DCD7FF]">
                Rekayasa Perangkat Lunak
              </p>
              <p className="text-[#DCD7FF]">IPK 3.68</p>
            </div>
            <dl className="mt-8 grid grid-cols-2 gap-6">
              {[
                [3.68, 2, "IPK"],
                [3, 0, "Proyek unggulan"],
                [4, 0, "Bahasa pemrograman"],
                [2, 0, "Platform: web & mobile"],
              ].map(([n, d, l]) => (
                <div
                  key={l}
                  className="p-4 bg-[#39326D]/40 rounded-3xl border border-[#8880D6]/20"
                >
                  <dt className="font-display text-[clamp(2rem,8vw,3rem)] font-bold leading-none text-[#FFC21A]">
                    <Counter to={n} dec={d} />
                  </dt>
                  <dd className="text-xs text-[#A49BEE] mt-1">{l}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal className="relative mt-16 grid gap-6 border-t border-[#8880D6]/30 pt-8 text-sm md:grid-cols-2 text-[#DCD7FF]/90">
          <p>
            <b className="font-display text-[#FFC21A]">Cara kerja. </b>Mengubah
            ide menjadi produk digital lewat logika, kreativitas, dan teknologi
            pahatan organik.
          </p>
          <p>
            <b className="font-display text-[#FFC21A]">Minat saat ini. </b>Web
            development, mobile app, database, dan problem solving futuristik.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

const sw = [
  "bg-[#625E91] text-[#DCD7FF] organic-tile-1",
  "bg-[#FFC21A] text-[#29264D] organic-tile-2",
  "bg-[#E8452C] text-[#DCD7FF] organic-tile-3",
  "bg-[#39326D] text-[#DCD7FF] organic-tile-1 border border-[#8880D6]/40",
  "bg-[#29264D] text-[#DCD7FF] organic-tile-2 border border-[#8880D6]/40",
];

export function Skills() {
  const rawTechList = Object.values(tech).flat();
  const techString = rawTechList.join(" ✦ ") + " ✦ ";

  return (
    <section id="skills" className={W}>
      <div className="organic-skills-container p-8 md:p-16 bg-[#29264D]/60 border border-[#8880D6]/30 backdrop-blur-2xl">
        <h2 className="font-display text-[clamp(2.6rem,8vw,7rem)] font-extrabold leading-[.9] text-[#DCD7FF]">
          <SplitText text="The Palette." />
        </h2>
        <p className="mt-5 max-w-md text-[#A49BEE]">
          Teknologi yang saya pakai untuk membangun produk, dikomposisikan dalam
          bentuk pahatan geometris asimetris.
        </p>

        {/* Marquee Organik */}
        <div
          className="my-12 overflow-hidden w-full py-4 bg-[#39326D]/50 rounded-full border border-[#8880D6]/30"
          aria-hidden="true"
        >
          <marquee behavior="scroll" direction="left" scrollamount="6">
            <span className="font-display text-[clamp(1.5rem,3.5vw,3rem)] font-bold text-[#DCD7FF]/60 tracking-wider whitespace-nowrap">
              {techString} &nbsp;&nbsp;&nbsp; {techString}
            </span>
          </marquee>
        </div>

        {/* Swatch Cat Organik Asimetris */}
        <ul className="mt-16 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {Object.entries(tech).map(([g, items], i) => (
            <motion.li
              key={g}
              data-cursor
              whileHover={{ y: -16, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`flex min-h-[22rem] flex-col justify-between gap-6 p-6 shadow-2xl ${sw[i % sw.length]} ${i % 2 ? "lg:mt-8" : ""}`}
            >
              <h3 className="font-display text-2xl font-extrabold tracking-wide">
                {g}
              </h3>
              <ul className="space-y-2">
                {items.map((t) => (
                  <li
                    key={t}
                    className="border-t border-current/20 pt-1.5 text-sm font-medium tracking-wide"
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

const pos = [
  "md:col-span-7 md:col-start-1",
  "md:col-span-5 md:col-start-8 md:mt-24 lg:mt-40",
  "md:col-span-7 md:col-start-3",
];

export function Projects() {
  return (
    <section id="projects" className={W}>
      <h2 className="font-display text-[clamp(2.6rem,8vw,7rem)] font-extrabold leading-[.9] text-[#DCD7FF]">
        <SplitText text="Selected Works." />
      </h2>
      <div className="mt-20 grid gap-y-28 md:grid-cols-12 md:gap-y-16">
        {projects.map((p, i) => (
          <article key={p.t} className={pos[i]}>
            <Tilt>
              <motion.div
                data-cursor
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                className="organic-project-frame bg-[#39326D] p-4 shadow-[0_30px_70px_-20px_rgba(20,18,40,0.8)] border border-[#8880D6]/30 md:p-6"
              >
                <div className="aspect-[4/3] rounded-[40px_20px_50px_30px] overflow-hidden">
                  <Art n={i} />
                </div>
              </motion.div>
            </Tilt>
            <Reveal className="mt-8 max-w-md border-l-4 border-[#FFC21A] pl-6 bg-[#29264D]/70 p-6 rounded-[20px_50px_30px_40px] border-r border-t border-b border-[#8880D6]/20">
              <h3 className="font-display text-3xl font-extrabold text-[#DCD7FF]">
                {p.t},{" "}
                <span className="font-normal text-[#A49BEE] text-lg">
                  [2026]
                </span>
              </h3>
              <p className="text-sm text-[#A49BEE] mt-2 font-mono">
                {p.tags.join(" // ")}
              </p>
              <p className="mt-4 text-sm text-[#DCD7FF]/90 leading-relaxed">
                {p.d}
              </p>
              <div className="mt-6 flex flex-wrap gap-x-8 text-sm font-bold">
                <a
                  href={p.view}
                  className="inline-flex min-h-11 items-center text-[#FFC21A] underline underline-offset-8 hover:text-white transition-colors"
                >
                  View Project →
                </a>
                <a
                  href={p.src}
                  className="inline-flex min-h-11 items-center text-[#DCD7FF] underline underline-offset-8 hover:text-[#FFC21A] transition-colors"
                >
                  Source Code →
                </a>
              </div>
            </Reveal>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Journey() {
  return (
    <section
      id="journey"
      className="bg-[#1C1A35] py-24 relative overflow-hidden"
    >
      <div className={W}>
        <h2 className="font-display text-[clamp(2.6rem,8vw,7rem)] font-extrabold leading-[.9] text-[#DCD7FF]">
          <SplitText text="Biography." />
        </h2>
        <div role="list" className="mt-16 space-y-6">
          {journey.map((j) => (
            <Reveal key={j.t}>
              <div
                role="listitem"
                className={`organic-tile-1 p-8 grid gap-4 border border-[#8880D6]/20 bg-[#29264D]/50 backdrop-blur-lg md:grid-cols-12 items-center ${j.real ? "shadow-xl" : "opacity-75"}`}
              >
                <span className="md:col-span-3 font-mono text-[#FFC21A] font-bold text-lg">
                  {j.y}
                </span>
                <h3 className="font-display text-2xl font-bold md:col-span-5 text-[#DCD7FF]">
                  {j.t}
                </h3>
                <p className="md:col-span-4 text-sm text-[#A49BEE]">{j.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

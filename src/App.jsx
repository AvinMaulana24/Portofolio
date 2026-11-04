import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Moon, Sun, Menu, X, ArrowRight, ArrowLeft, ArrowUp, ArrowUpRight, Download, Send } from 'lucide-react'
gsap.registerPlugin(ScrollTrigger)

const EASE = [0.2, 0.8, 0.2, 1]
const NAV = ['Home', 'About', 'Skills', 'Projects', 'Journey', 'Contact']
const TECH = [['JavaScript','JS','#d9a800'],['Python','Py','#3776ab'],['PHP','php','#777bb3'],['Java','Jv','#e76f00'],['React','⚛','#149eca'],['Flutter','Fl','#02569b'],['Laravel','L','#ff2d20'],['Firebase','Fb','#f57c00'],['Supabase','Sb','#2f9e6e'],['MySQL','SQL','#00618a'],['Git','Git','#f05033'],['GitHub','GH','#24292f']]
const PROJECTS = [
  { t: 'IKMION', d: 'Mobile online examination application with secure exam sessions and instant results.', g: ['#39326D', '#8880D6'], tg: ['Flutter', 'Firebase'] },
  { t: 'Roblox Game', d: 'An original Roblox experience: gameplay systems, UI and level design.', g: ['#8880D6', '#DCD7FF'], tg: ['Roblox', 'Lua'] },
  { t: 'Laravel Web App', d: 'A full-stack web application with authentication, dashboards and a MySQL backend.', g: ['#625E91', '#A49BEE'], tg: ['Laravel', 'PHP', 'MySQL'] },
]
const STEPS = [['🎓', 'EDUCATION', 'Software Engineering', 'Graduated with GPA 3.68.'], ['🎮', 'PERSONAL PROJECTS', 'Games & Apps', 'Roblox worlds and mobile experiments.'], ['⚙️', 'DEV JOURNEY', 'Full-Stack Growth', 'Laravel, Flutter, Firebase and Supabase.'], ['🚀', 'INTERESTS', 'What’s Next', 'Creative tech, UI engineering, product thinking.']]

/* ---------- reusable animation primitives ---------- */
const R = ({ children, className, d = 0, y = 50, ...p }) => (
  <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, delay: d, ease: EASE }} {...p}>{children}</motion.div>
)

function Mag({ as = 'a', children, className = '', ...p }) {
  const C = motion[as]
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15 }), sy = useSpring(y, { stiffness: 200, damping: 15 })
  return (
    <C className={'btn ' + className} style={{ x: sx, y: sy }}
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * 0.3); y.set((e.clientY - r.top - r.height / 2) * 0.4) }}
      onMouseLeave={() => { x.set(0); y.set(0) }} {...p}>{children}</C>
  )
}

function Tilt({ children, className, max = 14, ...p }) {
  const rx = useMotionValue(0), ry = useMotionValue(0)
  const sx = useSpring(rx, { stiffness: 150, damping: 14 }), sy = useSpring(ry, { stiffness: 150, damping: 14 })
  return (
    <motion.div className={className} style={{ rotateX: sx, rotateY: sy, transformPerspective: 800 }} whileHover={{ scale: 1.05 }}
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2); rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2) }}
      onMouseLeave={() => { rx.set(0); ry.set(0) }} {...p}>{children}</motion.div>
  )
}

const Split = ({ t, go, d = 0, hi }) => (
  <span className="wd" aria-hidden="true">
    {t.split('').map((c, i) => (
      <motion.i key={i} className={hi ? 'hi' : ''} initial={{ y: '110%', rotate: 8 }}
        animate={go ? { y: 0, rotate: 0 } : {}} transition={{ delay: d + i * 0.035, duration: 0.8, ease: EASE }}>{c}</motion.i>
    ))}
  </span>
)

/* ---------- global effects ---------- */
function Preloader({ done }) {
  const [n, setN] = useState(0)
  useEffect(() => { const i = setInterval(() => setN((v) => Math.min(100, v + 4)), 40); return () => clearInterval(i) }, [])
  useEffect(() => { if (n === 100) { const t = setTimeout(done, 300); return () => clearTimeout(t) } }, [n, done])
  return (
    <motion.div className="pre" exit={{ y: '-100%', borderBottomLeftRadius: '50% 18%', borderBottomRightRadius: '50% 18%' }} transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1] }}>
      <div className="disp">{n}</div><span>LOADING IDEAS</span>
    </motion.div>
  )
}

function Cursor() {
  const r = useRef()
  useEffect(() => {
    if (!matchMedia('(hover:hover)').matches) return
    const x = gsap.quickTo(r.current, 'x', { duration: 0.45, ease: 'power3' }), y = gsap.quickTo(r.current, 'y', { duration: 0.45, ease: 'power3' })
    const mv = (e) => { x(e.clientX); y(e.clientY) }
    const ov = (e) => r.current.classList.toggle('big', !!e.target.closest('a,button,.tile,.th'))
    addEventListener('mousemove', mv); addEventListener('mouseover', ov)
    return () => { removeEventListener('mousemove', mv); removeEventListener('mouseover', ov) }
  }, [])
  return <div ref={r} className="cur" aria-hidden="true" />
}

/* ---------- sections ---------- */
function Nav({ dark, toggle }) {
  const [on, setOn] = useState('home'), [open, setOpen] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setOn(e.target.id)), { rootMargin: '-40% 0px -50% 0px' })
    document.querySelectorAll('main section').forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])
  return (
    <header>
      <motion.div className="nav neo" initial={{ y: -90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.7, type: 'spring', stiffness: 90 }}>
        <a className="logo" href="#home"><i>{'{ }'}</i>Your Name</a>
        <nav className={'links' + (open ? ' open' : '')} aria-label="Main">
          {NAV.map((n) => { const id = n.toLowerCase(); return (
            <a key={id} href={'#' + id} className={on === id ? 'on' : ''} onClick={() => setOpen(false)}>
              {on === id && <motion.span layoutId="pill" className="pill2" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}{n}
            </a>) })}
        </nav>
        <div className="right">
          <button className="ic" onClick={toggle} aria-label="Switch theme">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
          <Mag className="cv" href="/cv.pdf" download><Download size={16} />Download CV</Mag>
          <button className="ic burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </motion.div>
    </header>
  )
}

function Hero({ go }) {
  const ref = useRef()
  useEffect(() => {
    const c = gsap.context(() => {
      gsap.utils.toArray('[data-d]').forEach((el) => gsap.to(el, { yPercent: +el.dataset.d, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 1 } }))
    }, ref)
    return () => c.revert()
  }, [])
  const fade = (d) => ({ initial: { opacity: 0, y: 24 }, animate: go ? { opacity: 1, y: 0 } : {}, transition: { delay: d, duration: 0.8, ease: EASE } })
  return (
    <section id="home" ref={ref}>
      <div className="panel hero">
        <div>
          <motion.div className="eyebrow" {...fade(0.1)}>CREATIVE DEVELOPER PORTFOLIO</motion.div>
          <h1 aria-label="Designing ideas into digital reality.">
            <span className="ln"><Split t="DESIGNING" go={go} d={0.2} /></span>
            <span className="ln"><Split t="IDEAS" hi go={go} d={0.45} />{' '}<Split t="INTO" go={go} d={0.6} /></span>
            <span className="ln"><Split t="DIGITAL" go={go} d={0.8} />{' '}<Split t="REALITY." hi go={go} d={1} /></span>
          </h1>
          <motion.div className="sub" {...fade(1.3)}>Software Developer | Creative Programmer</motion.div>
          <motion.p className="d" {...fade(1.4)}>Saya merupakan lulusan Rekayasa Perangkat Lunak yang memiliki ketertarikan dalam membangun aplikasi, mengembangkan teknologi, dan menciptakan solusi digital yang inovatif.</motion.p>
          <motion.div className="btns" {...fade(1.55)}>
            <Mag className="dark" href="#projects">Explore My Work <ArrowRight size={16} /></Mag>
            <Mag href="/cv.pdf" download>Download CV</Mag>
          </motion.div>
        </div>
        <Tilt className="stage" max={8}>
          <svg viewBox="0 0 500 500" role="img" aria-label="Floating 3D laptop illustration">
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#DCD7FF" /><stop offset="1" stopColor="#A49BEE" /></linearGradient>
              <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4b4392" /><stop offset="1" stopColor="#29264D" /></linearGradient>
              <radialGradient id="g3" cx=".35" cy=".3"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#8880D6" /></radialGradient>
            </defs>
            <ellipse cx="250" cy="440" rx="170" ry="26" fill="#29264D" opacity=".28" />
            <g className="fl2" style={{ transformOrigin: '250px 300px' }}>
              <path d="M120 330 L190 392 L400 352 L340 292Z" fill="url(#g1)" /><path d="M120 330 L190 392 L190 408 L120 346Z" fill="#8880D6" /><path d="M190 392 L400 352 L400 368 L190 408Z" fill="#77719C" />
              <path d="M140 150 L330 120 L372 282 L180 316Z" fill="url(#g2)" /><path d="M170 178 L310 156 L336 262 L196 286Z" fill="#8880D6" opacity=".55" />
              <text x="190" y="236" fill="#DCD7FF" fontFamily="Syne,sans-serif" fontWeight="800" fontSize="46" transform="rotate(-9 190 236)">&lt;/&gt;</text>
            </g>
            <circle cx="408" cy="120" r="34" fill="url(#g3)" className="fl2" /><circle cx="84" cy="96" r="20" fill="url(#g3)" className="fl2" />
            <ellipse className="spin" cx="96" cy="300" rx="52" ry="16" fill="none" stroke="#DCD7FF" strokeWidth="6" opacity=".8" />
            <path className="spin" d="M420 300 l30 -14 l30 14 l-30 14z M420 300 v34 l30 14 v-34z M480 300 v34 l-30 14 v-34z" fill="#39326D" />
          </svg>
          <div className="px" data-d="-25" style={{ top: '6%', right: '6%' }}><div className="glass fl2">{'{ }'}</div></div>
          <div className="px" data-d="20" style={{ bottom: '12%', left: 0 }}><div className="glass fl2" style={{ width: 70, height: 70 }}>&lt;/&gt;</div></div>
          <div className="px" data-d="-15" style={{ top: '30%', left: '-2%' }}><div className="badge fl2">⚛ React</div></div>
          <div className="px" data-d="25" style={{ bottom: '4%', right: '8%' }}><div className="badge fl2">Flutter</div></div>
        </Tilt>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about">
      <R className="panel alt about">
        <div><div className="eyebrow">WHO I AM</div><h2 className="disp">About <span className="hi">Me.</span></h2>
          <p>I’m a Software Engineering graduate who loves turning rough ideas into polished apps, games and web products.</p>
          <p>My philosophy: learn in public, ship small, refine forever.</p></div>
        <div className="frame">
          <motion.div className="in" initial={{ clipPath: 'inset(100% 0 0 0)' }} whileInView={{ clipPath: 'inset(0% 0 0 0)' }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.7, 0, 0.2, 1] }}>
            <svg viewBox="0 0 200 250" width="80%" aria-label="Portrait placeholder"><circle cx="100" cy="92" r="46" fill="#39326D" /><path d="M20 250 q10 -100 80 -100 q70 0 80 100z" fill="#8880D6" /><rect x="62" y="82" width="76" height="26" rx="13" fill="#DCD7FF" opacity=".9" /></svg>
          </motion.div>
        </div>
        <motion.div className="quote" initial={{ opacity: 0, rotate: -10, y: 60 }} whileInView={{ opacity: 1, rotate: 3, y: 0 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 70, delay: 0.3 }}>
          <div className="disp">KEEP LEARNING.<br />KEEP BUILDING.<br />KEEP CREATING.</div><small>Rekayasa Perangkat Lunak (RPL) · IPK 3.68</small>
        </motion.div>
      </R>
    </section>
  )
}

function Tech() {
  const s = TECH.map((t) => t[0]).join(' ✦ ') + ' ✦ '
  const V = { hide: { opacity: 0, y: 50, scale: 0.8 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } } }
  return (
    <section id="skills">
      <R className="panel tech">
        <div className="eyebrow">STACK</div><h2 className="disp">TECHNOLOGIES I <span className="hi">WORK WITH.</span></h2>
        <div className="mq" aria-hidden="true"><div>{s}{s}</div></div>
        <motion.div className="grid" initial="hide" whileInView="show" viewport={{ once: true, margin: '-60px' }} transition={{ staggerChildren: 0.06 }}>
          {TECH.map(([n, l, c]) => <Tilt key={n} className="tile" variants={V}><b style={{ background: c }}>{l}</b>{n}</Tilt>)}
        </motion.div>
      </R>
    </section>
  )
}

function Projects() {
  const [i, setI] = useState(0), p = PROJECTS[i], L = PROJECTS.length
  return (
    <section id="projects">
      <R className="panel alt">
        <div className="eyebrow">SELECTED WORK</div>
        <h2 className="disp" style={{ fontSize: 'clamp(32px,4.4vw,56px)', color: '#fff', margin: '10px 0 28px' }}>FEATURED <span className="hi">PROJECTS.</span></h2>
        <div className="pj">
          <AnimatePresence mode="wait">
            <motion.div key={i} className="big" initial={{ opacity: 0, x: 70, rotate: 2 }} animate={{ opacity: 1, x: 0, rotate: 0 }} exit={{ opacity: 0, x: -70, rotate: -2 }} transition={{ duration: 0.5, ease: EASE }}>
              <motion.div className="shot" style={{ background: `linear-gradient(135deg,${p.g[0]},${p.g[1]})` }} initial={{ clipPath: 'inset(0 100% 0 0 round 58px 20px 58px 20px)' }} animate={{ clipPath: 'inset(0 0% 0 0 round 58px 20px 58px 20px)' }} transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}>
                0{i + 1} · {p.t}<em>PREVIEW</em>
              </motion.div>
              <div className="info"><h3 className="disp">{p.t}</h3><p>{p.d}</p>
                <div className="tags">{p.tg.map((x) => <span key={x}>{x}</span>)}</div>
                <a className="vp" href="#">View Project <ArrowUpRight size={14} style={{ verticalAlign: '-2px' }} /></a></div>
            </motion.div>
          </AnimatePresence>
          <div className="side">
            {PROJECTS.map((q, k) => (
              <motion.button key={q.t} className={'th' + (k === i ? ' on' : '')} onClick={() => setI(k)} whileTap={{ scale: 0.96 }}>
                <i style={{ background: `linear-gradient(135deg,${q.g[0]},${q.g[1]})` }} />0{k + 1} {q.t}
              </motion.button>))}
          </div>
        </div>
        <div className="nv" style={{ marginTop: 22 }}>
          <Mag as="button" className="ic" aria-label="Previous project" onClick={() => setI((i + L - 1) % L)}><ArrowLeft size={20} /></Mag>
          <Mag as="button" className="ic" aria-label="Next project" onClick={() => setI((i + 1) % L)}><ArrowRight size={20} /></Mag>
        </div>
      </R>
    </section>
  )
}

function Journey() {
  const ref = useRef()
  useEffect(() => {
    const c = gsap.context(() => {
      gsap.to('.tlp', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.tl', start: 'top 80%', end: 'bottom 60%', scrub: true } })
      gsap.from('.st', { y: 60, opacity: 0, stagger: 0.2, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.tl', start: 'top 80%' } })
      gsap.from('.st .o', { scale: 0, rotate: -90, stagger: 0.2, duration: 0.8, ease: 'back.out(2)', scrollTrigger: { trigger: '.tl', start: 'top 80%' } })
    }, ref)
    return () => c.revert()
  }, [])
  return (
    <section id="journey" ref={ref}>
      <div className="panel">
        <div className="eyebrow">TIMELINE</div>
        <h2 className="disp" style={{ fontSize: 'clamp(32px,4.4vw,56px)', color: '#fff', marginTop: 10 }}>EDUCATION &amp; <span className="hi">JOURNEY.</span></h2>
        <div className="tl"><div className="tlp" />
          {STEPS.map(([ic, k, h, t]) => <div className="st" key={k}><div className="o">{ic}</div><div><small>{k}</small><h3 className="disp">{h}</h3><p>{t}</p></div></div>)}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [sent, setSent] = useState(false)
  return (
    <section id="contact">
      <R className="panel alt contact">
        <div><div className="eyebrow">CONTACT</div><h2 className="disp">LET’S CREATE <span className="hi">SOMETHING AMAZING.</span></h2>
          <p className="d">Have an idea or project? Let’s turn it into reality.</p>
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); e.target.reset() }}>
            <div className="r2"><input required name="name" placeholder="Name" aria-label="Name" autoComplete="name" /><input required type="email" name="email" placeholder="Email" aria-label="Email" autoComplete="email" /></div>
            <input required name="subject" placeholder="Subject" aria-label="Subject" />
            <textarea required name="message" rows="4" placeholder="Message" aria-label="Message" />
            <div><Mag as="button" className="dark" type="submit">Send Message <Send size={16} /></Mag></div>
            <AnimatePresence>{sent && <motion.div id="ok" role="status" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>Thanks! Connect a form service (Formspree, EmailJS) to deliver messages.</motion.div>}</AnimatePresence>
          </form></div>
        <div className="stage" style={{ maxWidth: 340, margin: 'auto' }}>
          <svg viewBox="0 0 300 300" aria-hidden="true"><defs><linearGradient id="g4" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#DCD7FF" /><stop offset="1" stopColor="#8880D6" /></linearGradient></defs>
            <g className="fl2"><path d="M150 40 L250 100 L250 200 L150 260 L50 200 L50 100Z" fill="url(#g4)" /><path d="M150 40 L250 100 L150 160 L50 100Z" fill="#fff" opacity=".55" /><path d="M150 160 L250 100 L250 200 L150 260Z" fill="#39326D" opacity=".75" />
              <text x="104" y="190" fontFamily="Syne" fontWeight="800" fontSize="44" fill="#DCD7FF" transform="rotate(-6 104 190)">&lt;/&gt;</text></g></svg>
        </div>
      </R>
    </section>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('theme') || '' } catch { return '' } })
  const { scrollYProgress } = useScroll()
  const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 20 })
  const dark = theme ? theme === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches
  useEffect(() => { if (theme) { document.documentElement.dataset.theme = theme; try { localStorage.setItem('theme', theme) } catch {} } }, [theme])
  useEffect(() => { document.body.style.overflow = ready ? '' : 'hidden'; if (ready) setTimeout(() => ScrollTrigger.refresh(), 100) }, [ready])
  return (
    <>
      <AnimatePresence>{!ready && <Preloader done={() => setReady(true)} />}</AnimatePresence>
      <motion.div className="bar" style={{ scaleX: sx }} /><Cursor />
      <Nav dark={dark} toggle={() => setTheme(dark ? 'light' : 'dark')} />
      <main className="wrap"><Hero go={ready} /><About /><Tech /><Projects /><Journey /><Contact /></main>
      <footer><div className="wrap ft">
        <a className="logo" href="#home"><i>{'{ }'}</i>Your Name</a><span>© 2026 All rights reserved.</span>
        <nav aria-label="Social"><a href="#">GitHub</a><a href="#">LinkedIn</a><a href="#">Instagram</a></nav>
        <Mag href="#home"><ArrowUp size={16} />Back to top</Mag></div></footer>
    </>
  )
}

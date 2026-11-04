import {motion} from 'framer-motion'
import {Reveal,SplitText,Counter,Tilt} from '../components/ui'
import {tech,projects,journey} from '../data'
const W='mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-40'
const Art=({n})=>{const S=[
<><rect width="400" height="300" fill="#E8452C"/><circle cx="140" cy="150" r="110" fill="#1C2BD9"/><rect x="200" y="40" width="120" height="220" fill="#FFC21A"/><circle cx="260" cy="150" r="46" fill="#141414"/></>,
<><rect width="400" height="300" fill="#FFC21A"/><path d="M0 300A300 300 0 0 1 300 0V300Z" fill="#141414"/><circle cx="300" cy="90" r="60" fill="#E8452C"/><rect x="40" y="40" width="90" height="90" fill="#1C2BD9"/></>,
<><rect width="400" height="300" fill="#1C2BD9"/><circle cx="200" cy="150" r="120" fill="none" stroke="#ECEAE4" strokeWidth="26"/><circle cx="200" cy="150" r="60" fill="#FFC21A"/><rect y="230" width="400" height="14" fill="#E8452C"/></>]
return <svg viewBox="0 0 400 300" className="block h-full w-full" role="img" aria-label="Ilustrasi abstrak sebagai placeholder proyek">{S[n]}</svg>}
export function About(){return <section id="about" className={`${W} relative`}>
<div aria-hidden className="pointer-events-none absolute right-6 top-24 h-64 w-64 rounded-full bg-sun mix-blend-multiply md:right-24 md:h-96 md:w-96"/><div aria-hidden className="pointer-events-none absolute right-40 top-48 h-56 w-56 bg-verm mix-blend-multiply md:right-72 md:h-72 md:w-72"/>
<h2 className="relative font-display text-[clamp(3rem,10vw,9rem)] font-extrabold leading-[.9]"><SplitText text="Beyond The Code."/></h2>
<div className="relative mt-20 grid gap-12 md:grid-cols-12">
<Reveal className="space-y-5 text-lg md:col-span-6"><p>Saya merupakan lulusan Rekayasa Perangkat Lunak dengan ketertarikan pada software development, web development, mobile application development, database management, dan problem solving.</p><p className="text-mute">Saya menikmati proses mengubah ide menjadi produk digital melalui kombinasi logika pemrograman, kreativitas, dan teknologi.</p></Reveal>
<Reveal delay={.15} className="md:col-span-5 md:col-start-8"><div className="border-l-2 border-ink pl-5"><p className="text-sm text-mute">Pendidikan</p><p className="font-display text-2xl font-bold">Rekayasa Perangkat Lunak (RPL)</p><p>IPK 3.68</p></div>
<dl className="mt-10 grid grid-cols-2 gap-8">{[[3.68,2,'IPK'],[3,0,'Proyek unggulan'],[4,0,'Bahasa pemrograman'],[2,0,'Platform: web & mobile']].map(([n,d,l])=><div key={l}><dt className="font-display text-6xl font-bold"><Counter to={n} dec={d}/></dt><dd className="text-sm text-mute">{l}</dd></div>)}</dl></Reveal></div>
<Reveal className="relative mt-20 grid gap-6 border-t border-line pt-8 text-sm md:grid-cols-2"><p><b className="font-display">Cara kerja. </b>Mengubah ide menjadi produk digital lewat logika, kreativitas, dan teknologi. <span className="text-mute">[Tambahkan filosofi kerja pribadi]</span></p><p><b className="font-display">Minat saat ini. </b>Web development, mobile app, database, dan problem solving. <span className="text-mute">[Tambahkan minat terbaru]</span></p></Reveal></section>}
const sw=['bg-accent text-bg','bg-sun text-ink','bg-verm text-bg','bg-ink text-bg','border border-ink bg-bg2 text-ink']
export function Skills(){return <section id="skills"><div className={W}>
<h2 className="font-display text-[clamp(2.6rem,8vw,7rem)] font-extrabold leading-[.9]"><SplitText text="The Palette."/></h2><p className="mt-5 max-w-md text-mute">Teknologi yang saya pakai untuk membangun produk, dikelompokkan seperti swatch cat.</p>
<ul className="mt-16 grid gap-4 sm:grid-cols-2 md:grid-cols-5">{Object.entries(tech).map(([g,items],i)=><motion.li key={g} data-cursor whileHover={{y:-14}} transition={{type:'spring',stiffness:300,damping:20}} className={`flex h-80 flex-col justify-between p-5 md:h-[26rem] ${sw[i]} ${i%2?'md:mt-10':''}`}><h3 className="font-display text-xl font-bold">{g}</h3><ul className="space-y-1">{items.map(t=><li key={t} className="border-t border-current/30 pt-1 text-sm">{t}</li>)}</ul></motion.li>)}</ul></div></section>}
const pos=['md:col-span-7 md:col-start-1','md:col-span-5 md:col-start-8 md:mt-40','md:col-span-7 md:col-start-3']
export function Projects(){return <section id="projects" className={W}>
<h2 className="font-display text-[clamp(2.6rem,8vw,7rem)] font-extrabold leading-[.9]"><SplitText text="Selected Works."/></h2>
<div className="mt-20 grid gap-y-24 md:grid-cols-12 md:gap-y-12">{projects.map((p,i)=><article key={p.t} className={pos[i]}>
<Tilt><motion.div data-cursor initial={{clipPath:'inset(0 100% 0 0)'}} whileInView={{clipPath:'inset(0 0% 0 0)'}} viewport={{once:true}} transition={{duration:1.2,ease:[.76,0,.24,1]}} className="bg-white p-3 shadow-[0_30px_60px_-25px_rgba(20,20,20,.45)] md:p-5"><div className="aspect-[4/3]"><Art n={i}/></div></motion.div></Tilt>
<Reveal className="mt-6 max-w-md border-l-2 border-ink pl-4"><h3 className="font-display text-2xl font-bold">{p.t}, <span className="font-normal text-mute">[Tahun]</span></h3><p className="text-sm text-mute">{p.tags.join(', ')}</p><p className="mt-3 text-sm">{p.d}</p>
<div className="mt-4 flex gap-6 text-sm font-medium"><a href={p.view} className="underline underline-offset-4 hover:text-accent">View Project</a><a href={p.src} className="underline underline-offset-4 hover:text-accent">Source Code</a></div></Reveal></article>)}</div></section>}
export function Journey(){return <section id="journey" className="bg-bg2"><div className={W}><h2 className="font-display text-[clamp(2.6rem,8vw,7rem)] font-extrabold leading-[.9]"><SplitText text="Biography."/></h2>
<ul className="mt-16">{journey.map(j=><Reveal key={j.t}><li className={`grid gap-2 border-t border-line py-8 md:grid-cols-12 ${j.real?'':'text-mute'}`}><span className="md:col-span-3">{j.y}</span><h3 className={`font-display text-2xl font-bold md:col-span-5 ${j.real?'text-ink':''}`}>{j.t}</h3><p className="md:col-span-4">{j.d}</p></li></Reveal>)}</ul></div></section>}

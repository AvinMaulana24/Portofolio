import {useRef} from 'react'
import {motion,useScroll,useSpring} from 'framer-motion'
import {Code2,Layout,Smartphone,Database,Wrench,ArrowUpRight} from 'lucide-react'
import {Reveal,SplitText,Counter} from '../components/ui'
import {tech,projects,journey} from '../data'
const W='mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-40'
const icons={Programming:Code2,Frontend:Layout,Mobile:Smartphone,'Backend & Database':Database,Tools:Wrench}
export function About(){return <section id="about" className={W}>
<h2 className="font-display text-5xl md:text-8xl"><SplitText text="Beyond The Code."/></h2>
<div className="mt-16 grid gap-12 md:grid-cols-12">
<Reveal className="space-y-5 text-mute md:col-span-6"><p>Saya merupakan lulusan Rekayasa Perangkat Lunak dengan ketertarikan pada software development, web development, mobile application development, database management, dan problem solving.</p><p>Saya menikmati proses mengubah ide menjadi produk digital melalui kombinasi logika pemrograman, kreativitas, dan teknologi.</p></Reveal>
<Reveal delay={.15} className="md:col-span-5 md:col-start-8"><div className="border-l border-accent pl-6"><p className="text-sm text-mute">Pendidikan</p><p className="font-display text-2xl">Rekayasa Perangkat Lunak (RPL)</p><p className="text-mute">IPK 3.68</p></div>
<dl className="mt-10 grid grid-cols-2 gap-8">{[[3.68,2,'IPK'],[3,0,'Proyek unggulan'],[4,0,'Bahasa pemrograman'],[2,0,'Platform: web & mobile']].map(([n,d,l])=><div key={l}><dt className="font-display text-5xl"><Counter to={n} dec={d}/></dt><dd className="mt-1 text-sm text-mute">{l}</dd></div>)}</dl></Reveal></div>
<Reveal className="mt-20 grid gap-6 border-t border-line pt-10 text-sm text-mute md:grid-cols-2"><p><span className="text-ink">Cara kerja. </span>Mengubah ide menjadi produk digital lewat logika, kreativitas, dan teknologi. [Tambahkan filosofi kerja pribadi]</p><p><span className="text-ink">Minat saat ini. </span>Web development, mobile app, database, dan problem solving. [Tambahkan minat terbaru]</p></Reveal></section>}
export function Skills(){return <section id="skills" className="bg-bg2"><div className={W}>
<h2 className="font-display text-4xl md:text-7xl"><SplitText text="Tools I build with."/></h2>
<div className="mt-16 divide-y divide-line">{Object.entries(tech).map(([g,items])=>{const I=icons[g];return <div key={g} className="grid items-center gap-5 py-8 md:grid-cols-12"><div className="flex items-center gap-3 md:col-span-3"><I size={18} className="text-accent"/><h3 className="font-display text-xl">{g}</h3></div>
<ul className="flex flex-wrap gap-3 md:col-span-9">{items.map(t=><motion.li key={t} data-cursor whileHover={{y:-5}} className="rounded-full border border-line px-5 py-2.5 text-sm text-mute transition-all hover:border-accent hover:text-ink hover:shadow-[0_0_24px_-6px_#22D3EE]">{t}</motion.li>)}</ul></div>})}</div></div></section>}
export function Projects(){return <section id="projects" className={W}>
<h2 className="font-display text-4xl md:text-7xl"><SplitText text="Selected work."/></h2>
<div className="mt-20 space-y-28 md:space-y-40">{projects.map((p,i)=><article key={p.t} className="grid items-center gap-8 md:grid-cols-12">
<motion.div data-cursor initial={{clipPath:'inset(100% 0 0 0)'}} whileInView={{clipPath:'inset(0% 0 0 0)'}} viewport={{once:true}} transition={{duration:1.2,ease:[.76,0,.24,1]}} className={`group overflow-hidden rounded-sm md:col-span-7 ${i%2?'md:order-2 md:col-start-6':''}`}>
<img src={`https://picsum.photos/seed/${p.img}/1200/800`} alt={`Thumbnail placeholder ${p.t}`} loading="lazy" width="1200" height="800" className="aspect-[3/2] w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"/></motion.div>
<Reveal className={`md:col-span-4 ${i%2?'md:col-start-1 md:row-start-1':'md:col-start-9'}`}><p className="text-sm text-accent">{p.s}</p><h3 className="mt-2 font-display text-3xl md:text-4xl">{p.t}</h3><p className="mt-4 text-mute">{p.d}</p>
<ul className="mt-5 flex flex-wrap gap-2 text-xs text-mute">{p.tags.map(t=><li key={t} className="rounded-full border border-line px-3 py-1">{t}</li>)}</ul>
<div className="mt-7 flex gap-5 text-sm"><a href={p.view} className="flex items-center gap-1 border-b border-accent pb-1">View Project<ArrowUpRight size={15}/></a><a href={p.src} className="flex items-center gap-1 pb-1 text-mute hover:text-ink">Source Code<ArrowUpRight size={15}/></a></div></Reveal></article>)}</div></section>}
export function Journey(){const r=useRef(),{scrollYProgress}=useScroll({target:r,offset:['start 70%','end 60%']}),s=useSpring(scrollYProgress,{stiffness:100,damping:30})
return <section id="journey" className="bg-bg2"><div className={W}><h2 className="font-display text-4xl md:text-7xl"><SplitText text="The journey so far."/></h2>
<div ref={r} className="relative mt-16 pl-8 md:ml-[25%]"><div className="absolute bottom-0 left-0 top-0 w-px bg-line"/><motion.div style={{scaleY:s}} className="absolute bottom-0 left-0 top-0 w-px origin-top bg-accent"/>
{journey.map(j=><Reveal key={j.t} className="relative pb-14"><span className={`absolute -left-[37px] top-2 h-2.5 w-2.5 rounded-full ${j.real?'bg-accent':'border border-mute bg-bg2'}`}/><p className="text-sm text-mute">{j.y}</p><h3 className="font-display text-2xl">{j.t}</h3><p className={j.real?'text-mute':'text-mute/60'}>{j.d}</p></Reveal>)}</div></div></section>}

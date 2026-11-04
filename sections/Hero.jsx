import {useEffect,useRef} from 'react'
import {gsap} from 'gsap';import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {motion} from 'framer-motion'
import {Download} from 'lucide-react'
import {Particles,SplitText,Magnetic,Scramble} from '../components/ui'
import {P} from '../data'
gsap.registerPlugin(ScrollTrigger)
export default function Hero(){const r=useRef()
useEffect(()=>{if(matchMedia('(prefers-reduced-motion:reduce)').matches)return
let mm;const c=gsap.context(()=>{const st={trigger:'#home',start:'top top',end:'bottom top',scrub:true}
gsap.to('.geo',{yPercent:-45,ease:'none',scrollTrigger:st});gsap.to('.ghost',{xPercent:-25,ease:'none',scrollTrigger:st});mm=e=>gsap.to('.geo-wrap',{rotationY:(e.clientX/innerWidth-.5)*50,rotationX:-(e.clientY/innerHeight-.5)*50,duration:1});addEventListener('mousemove',mm);gsap.to('.hero-txt',{yPercent:12,opacity:.15,ease:'none',scrollTrigger:st})},r);return()=>{c.revert();removeEventListener('mousemove',mm)}},[])
const D=1.5
return <section id="home" ref={r} className="relative flex min-h-screen items-center overflow-hidden"><Particles/><div aria-hidden className="ghost text-outline pointer-events-none absolute -bottom-[3vw] left-0 select-none whitespace-nowrap font-display text-[24vw] leading-none opacity-50">DEVELOPER</div>
<div className="geo absolute right-[6%] top-1/3 hidden opacity-80 md:block"><div className="geo-wrap"><div className="cube"><i/><i/><i/><i/><i/><i/><div className="cube sm"><i/><i/><i/><i/><i/><i/></div></div></div></div>
<div className="hero-txt relative mx-auto w-full max-w-7xl px-6 pb-24 pt-36 md:px-10">
<motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:D}} className="mb-8 flex items-center gap-3 text-xs tracking-[.2em] text-mute"><span className="h-2 w-2 animate-pulse rounded-full bg-accent"/>AVAILABLE FOR OPPORTUNITIES</motion.p>
<h1 className="max-w-5xl font-display text-[clamp(2.8rem,8.5vw,8rem)] font-medium leading-[.95] tracking-tight"><SplitText text="Building Digital Experiences Through Code." delay={D}/></h1>
<div className="mt-14 grid gap-10 md:grid-cols-12"><motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:D+.9}} className="md:col-span-4"><p className="font-display text-2xl">{P.name}</p><p className="mt-1 text-mute"><Scramble text="Software Developer / Creative Programmer" delay={D+1}/></p></motion.div>
<motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:D+1.1}} className="max-w-md text-mute md:col-span-5 md:col-start-6">Saya adalah lulusan Rekayasa Perangkat Lunak yang memiliki ketertarikan dalam membangun aplikasi, mengembangkan solusi digital, dan menciptakan pengalaman pengguna melalui teknologi.</motion.p></div>
<motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:D+1.3}} className="mt-12 flex flex-wrap items-center gap-4">
<Magnetic><a href="#projects" className="block rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-bg">Explore My Work</a></Magnetic>
<Magnetic><a href="./cv.pdf" download className="flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm hover:border-accent"><Download size={16}/>Download CV</a></Magnetic>
<Magnetic><a href="#contact" className="block px-5 py-3.5 text-sm text-mute hover:text-ink">Contact Me</a></Magnetic></motion.div></div>
<div aria-hidden className="absolute bottom-0 left-1/2 h-16 w-px overflow-hidden bg-line"><div className="drop h-full w-full bg-accent"/></div></section>}

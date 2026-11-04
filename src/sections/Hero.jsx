import {useEffect,useRef} from 'react'
import {gsap} from 'gsap';import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {motion} from 'framer-motion'
import {Download} from 'lucide-react'
import {SplitText,Magnetic} from '../components/ui'
import {P} from '../data'
gsap.registerPlugin(ScrollTrigger)
function Paint(){const c=useRef()
useEffect(()=>{if(matchMedia('(prefers-reduced-motion:reduce)').matches)return
const cv=c.current,g=cv.getContext('2d'),pts=[],K=['#141414','#E8452C','#0E1799'];let w,h,raf,last=-1e4,pm={x:0,y:0},ci=0,lp=null
const rs=()=>{w=cv.width=cv.offsetWidth;h=cv.height=cv.offsetHeight};rs()
const mv=e=>{const b=cv.getBoundingClientRect();pm={x:e.clientX-b.left,y:e.clientY-b.top};last=performance.now()}
const tick=t=>{const p=t-last<2500?pm:{x:w*(.5+.38*Math.sin(t/1700)),y:h*(.5+.3*Math.sin(t/1100+1))}
if(!lp||Math.hypot(p.x-lp.x,p.y-lp.y)>6){if(Math.random()<.05)ci=(ci+1)%3;pts.push({x:p.x,y:p.y,t,c:K[ci]});lp=p;if(pts.length>90)pts.shift()}
g.clearRect(0,0,w,h);g.lineCap='round'
for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],age=(t-b.t)/2200;if(age>1)continue
g.strokeStyle=b.c;g.globalAlpha=(1-age)*.9;g.lineWidth=14+Math.min(60,Math.hypot(b.x-a.x,b.y-a.y)*1.2)*(1-age);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke()}
raf=requestAnimationFrame(tick)}
raf=requestAnimationFrame(tick);addEventListener('pointermove',mv);addEventListener('resize',rs)
return()=>{cancelAnimationFrame(raf);removeEventListener('pointermove',mv);removeEventListener('resize',rs)}},[])
return <canvas ref={c} aria-hidden className="absolute inset-0 h-full w-full"/>}
export default function Hero(){const r=useRef(),D=1.4,f=d=>({initial:{opacity:0},animate:{opacity:1},transition:{delay:D+d}})
useEffect(()=>{if(matchMedia('(prefers-reduced-motion:reduce)').matches)return
const c=gsap.context(()=>{gsap.to('.sun',{yPercent:-35,ease:'none',scrollTrigger:{trigger:'#home',start:'top top',end:'bottom top',scrub:true}})},r);return()=>c.revert()},[])
return <section id="home" ref={r} className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-accent px-6 pb-10 pt-32 text-bg md:px-10">
<div aria-hidden className="sun pointer-events-none absolute -right-24 top-24 h-[26rem] w-[26rem] rounded-full bg-sun"/><Paint/>
<div className="relative"><motion.p {...f(0)} className="mb-6 inline-flex items-center gap-2 rounded-full border border-bg/40 px-4 py-1.5 text-sm"><span className="h-2 w-2 rounded-full bg-sun"/>AVAILABLE FOR OPPORTUNITIES</motion.p>
<h1 className="max-w-4xl font-display text-[clamp(2.6rem,7vw,6.5rem)] font-extrabold leading-[.95] tracking-tight"><SplitText text="Building Digital Experiences Through Code." delay={D}/></h1></div>
<div className="relative grid items-end gap-8 md:grid-cols-12"><motion.div {...f(.9)} className="md:col-span-6"><p className="font-display text-[clamp(2rem,6vw,5rem)] font-bold leading-none">{P.name}</p><p className="mt-3 text-bg/80">Software Developer / Creative Programmer</p></motion.div>
<motion.p {...f(1.1)} className="max-w-sm text-sm text-bg/90 md:col-span-3">Saya adalah lulusan Rekayasa Perangkat Lunak yang memiliki ketertarikan dalam membangun aplikasi, mengembangkan solusi digital, dan menciptakan pengalaman pengguna melalui teknologi.</motion.p>
<motion.div {...f(1.3)} className="flex flex-col items-start gap-3 md:col-span-3">
<Magnetic><a href="#projects" className="block rounded-full bg-bg px-7 py-3.5 text-sm font-medium text-ink">Explore My Work</a></Magnetic>
<Magnetic><a href="./cv.pdf" download className="flex items-center gap-2 rounded-full border border-bg/60 px-7 py-3.5 text-sm"><Download size={16}/>Download CV</a></Magnetic>
<a href="#contact" className="px-2 text-sm underline underline-offset-4">Contact Me</a></motion.div></div></section>}

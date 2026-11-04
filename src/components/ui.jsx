import {useEffect,useRef,useState} from 'react'
import {motion,useScroll,useSpring,useMotionValue,animate,useInView} from 'framer-motion'
const E=[.16,1,.3,1]
export const Reveal=({children,delay=0,className=''})=><motion.div className={className} initial={{opacity:0,y:36}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-10%'}} transition={{duration:.9,delay,ease:E}}>{children}</motion.div>
export const SplitText=({text,className='',delay=0})=><span className={className} aria-label={text}>{text.split(' ').map((w,i)=><span key={i} aria-hidden className="inline-block overflow-hidden pr-[.25em] align-bottom"><motion.span className="inline-block" initial={{y:'110%'}} whileInView={{y:0}} viewport={{once:true}} transition={{duration:1,delay:delay+i*.07,ease:E}}>{w}</motion.span></span>)}</span>
export function Magnetic({children,s=.35}){const r=useRef(),x=useMotionValue(0),y=useMotionValue(0),sx=useSpring(x,{stiffness:200,damping:15}),sy=useSpring(y,{stiffness:200,damping:15})
return <motion.div ref={r} className="inline-block" style={{x:sx,y:sy}} onMouseMove={e=>{const b=r.current.getBoundingClientRect();x.set((e.clientX-b.left-b.width/2)*s);y.set((e.clientY-b.top-b.height/2)*s)}} onMouseLeave={()=>{x.set(0);y.set(0)}}>{children}</motion.div>}
export function Cursor(){const x=useMotionValue(-100),y=useMotionValue(-100),sx=useSpring(x,{stiffness:500,damping:40}),sy=useSpring(y,{stiffness:500,damping:40}),[big,setBig]=useState(false),[on,setOn]=useState(false)
useEffect(()=>{if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;setOn(true)
const mv=e=>{x.set(e.clientX);y.set(e.clientY);setBig(!!e.target.closest?.('a,button,input,textarea,[data-cursor]'))}
addEventListener('mousemove',mv);return()=>removeEventListener('mousemove',mv)},[])
return on?<motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference" style={{x:sx,y:sy}}><motion.div className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-accent" animate={{width:big?64:12,height:big?64:12,backgroundColor:big?'rgba(34,211,238,.15)':'rgba(34,211,238,1)'}}/></motion.div>:null}
export function Particles(){const c=useRef()
useEffect(()=>{if(matchMedia('(prefers-reduced-motion:reduce)').matches)return
const cv=c.current,g=cv.getContext('2d'),P=[],n=innerWidth<768?32:68;let w,h,raf,m={x:-999,y:-999}
const rs=()=>{w=cv.width=cv.offsetWidth;h=cv.height=cv.offsetHeight};rs()
for(let i=0;i<n;i++)P.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25})
const mm=e=>{const b=cv.getBoundingClientRect();m={x:e.clientX-b.left,y:e.clientY-b.top}}
const tick=()=>{g.clearRect(0,0,w,h)
for(const p of P){const dx=p.x-m.x,dy=p.y-m.y,d=Math.hypot(dx,dy)||1;if(d<120){p.x+=dx/d;p.y+=dy/d}
p.x=(p.x+p.vx+w)%w;p.y=(p.y+p.vy+h)%h;g.fillStyle='rgba(34,211,238,.6)';g.fillRect(p.x,p.y,1.5,1.5)}
for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){const d=Math.hypot(P[i].x-P[j].x,P[i].y-P[j].y);if(d<110){g.strokeStyle=`rgba(34,211,238,${.12*(1-d/110)})`;g.beginPath();g.moveTo(P[i].x,P[i].y);g.lineTo(P[j].x,P[j].y);g.stroke()}}
raf=requestAnimationFrame(tick)}
tick();addEventListener('mousemove',mm);addEventListener('resize',rs)
return()=>{cancelAnimationFrame(raf);removeEventListener('mousemove',mm);removeEventListener('resize',rs)}},[])
return <canvas ref={c} aria-hidden className="absolute inset-0 h-full w-full"/>}
export function Loader({done}){const[n,setN]=useState(0)
useEffect(()=>{const a=animate(0,100,{duration:1.3,ease:'easeInOut',onUpdate:v=>setN(Math.round(v)),onComplete:done});return()=>a.stop()},[])
return <motion.div role="status" aria-label="Loading" className="fixed inset-0 z-[90] flex items-end justify-between bg-bg p-6 md:p-14" exit={{y:'-100%'}} transition={{duration:.9,ease:[.76,0,.24,1]}}><span className="font-display text-sm text-mute">Loading portfolio</span><span className="font-display text-[24vw] leading-[.8]">{n}</span></motion.div>}
export const ScrollProgress=()=>{const{scrollYProgress}=useScroll(),s=useSpring(scrollYProgress,{stiffness:120,damping:25});return <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[80] h-[2px] origin-left bg-accent" style={{scaleX:s}}/>}
export function Counter({to,dec=0}){const r=useRef(),v=useInView(r,{once:true}),[n,setN]=useState(0)
useEffect(()=>{if(v)animate(0,to,{duration:1.8,ease:'easeOut',onUpdate:setN})},[v])
return <span ref={r}>{n.toFixed(dec)}</span>}

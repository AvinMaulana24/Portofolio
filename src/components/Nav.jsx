import {useEffect,useState} from 'react'
import {motion,AnimatePresence} from 'framer-motion'
import {Menu,X} from 'lucide-react'
const L=['Home','About','Skills','Projects','Journey','Contact']
export default function Nav(){const[a,setA]=useState('home'),[s,setS]=useState(false),[o,setO]=useState(false)
useEffect(()=>{const f=()=>{setS(scrollY>40);let c='home';L.forEach(l=>{const e=document.getElementById(l.toLowerCase());if(e&&e.getBoundingClientRect().top<=innerHeight*.45)c=l.toLowerCase()});setA(c)}
f();addEventListener('scroll',f,{passive:true});return()=>removeEventListener('scroll',f)},[])
return <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${s?'border-b border-line bg-bg/70 backdrop-blur-xl':''}`}>
<nav aria-label="Utama" className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
<a href="#home" className="font-display text-lg font-bold">&lt;/&gt;</a>
<ul className="hidden gap-8 md:flex">{L.map(l=><li key={l}><a href={'#'+l.toLowerCase()} className={`relative text-sm transition-colors ${a===l.toLowerCase()?'text-ink':'text-mute hover:text-ink'}`}>{l}{a===l.toLowerCase()&&<motion.span layoutId="ind" className="absolute -bottom-2 left-0 h-px w-full bg-accent"/>}</a></li>)}</ul>
<button className="md:hidden" aria-label="Menu" aria-expanded={o} onClick={()=>setO(!o)}>{o?<X/>:<Menu/>}</button></nav>
<AnimatePresence>{o&&<motion.ul initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} className="overflow-hidden bg-bg/95 px-6 pb-6 backdrop-blur-xl md:hidden">{L.map(l=><li key={l}><a onClick={()=>setO(false)} href={'#'+l.toLowerCase()} className="block border-b border-line py-4 font-display text-2xl">{l}</a></li>)}</motion.ul>}</AnimatePresence></header>}

import {useEffect,useState} from 'react'
import {motion,AnimatePresence} from 'framer-motion'
import {Menu,X} from 'lucide-react'
const L=['Home','About','Skills','Projects','Journey','Contact']
export default function Nav(){const[a,setA]=useState('home'),[s,setS]=useState(false),[o,setO]=useState(false)
useEffect(()=>{const f=()=>{setS(scrollY>40);let c='home';L.forEach(l=>{const e=document.getElementById(l.toLowerCase());if(e&&e.getBoundingClientRect().top<=innerHeight*.45)c=l.toLowerCase()});setA(c)}
f();addEventListener('scroll',f,{passive:true});return()=>removeEventListener('scroll',f)},[])
return <header className="fixed inset-x-0 top-4 z-50 flex flex-col items-center px-4">
<nav aria-label="Utama" className={`flex items-center rounded-full border border-line bg-bg/85 p-1.5 backdrop-blur-xl transition-shadow ${s?'shadow-lg':''}`}>
<ul className="hidden md:flex">{L.map(l=>{const on=a===l.toLowerCase();return <li key={l}><a href={'#'+l.toLowerCase()} className={`relative block rounded-full px-4 py-2 text-sm transition-colors ${on?'text-bg':'text-ink'}`}>{on&&<motion.span layoutId="ind" className="absolute inset-0 rounded-full bg-ink"/>}<span className="relative">{l}</span></a></li>})}</ul>
<button className="flex items-center gap-2 px-3 py-2 font-display md:hidden" aria-label="Menu" aria-expanded={o} onClick={()=>setO(!o)}>{o?<X size={18}/>:<Menu size={18}/>}Menu</button></nav>
<AnimatePresence>{o&&<motion.ul initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="mt-2 w-full max-w-sm rounded-3xl border border-line bg-bg p-4 md:hidden">{L.map(l=><li key={l}><a onClick={()=>setO(false)} href={'#'+l.toLowerCase()} className="block border-b border-line py-3 font-display text-2xl last:border-0">{l}</a></li>)}</motion.ul>}</AnimatePresence></header>}

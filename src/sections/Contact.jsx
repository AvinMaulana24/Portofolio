import {useState} from 'react'
import emailjs from '@emailjs/browser'
import {Mail,Github,Linkedin,Instagram,MessageCircle} from 'lucide-react'
import {Reveal,SplitText,Magnetic} from '../components/ui'
import {P} from '../data'
const links=[[Mail,'Email','mailto:'+P.email],[MessageCircle,'WhatsApp',P.wa],[Github,'GitHub',P.github],[Linkedin,'LinkedIn',P.linkedin],[Instagram,'Instagram',P.instagram]]
const F=[['name','Name','text'],['email','Email','email'],['subject','Subject','text']]
const empty={name:'',email:'',subject:'',message:''}
export default function Contact(){const[f,setF]=useState(empty),[er,setEr]=useState({}),[st,setSt]=useState('idle')
const val=()=>{const e={};if(f.name.trim().length<2)e.name='Isi nama minimal 2 karakter.';if(!/^\S+@\S+\.\S+$/.test(f.email))e.email='Masukkan alamat email yang valid.';if(f.subject.trim().length<3)e.subject='Isi subjek minimal 3 karakter.';if(f.message.trim().length<10)e.message='Isi pesan minimal 10 karakter.';return e}
const send=async ev=>{ev.preventDefault();const v=val();setEr(v);if(Object.keys(v).length)return;setSt('loading')
try{const E=import.meta.env;await emailjs.send(E.VITE_EMAILJS_SERVICE_ID,E.VITE_EMAILJS_TEMPLATE_ID,{from_name:f.name,reply_to:f.email,subject:f.subject,message:f.message},{publicKey:E.VITE_EMAILJS_PUBLIC_KEY});setSt('ok');setF(empty)}catch{setSt('err')}}
const c="w-full border-b border-bg/40 bg-transparent py-3 outline-none transition-colors focus:border-sun"
return <section id="contact" className="bg-accent text-bg"><div className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-40">
<h2 className="max-w-5xl font-display text-[clamp(2.4rem,7vw,6rem)] font-extrabold leading-[.95]"><SplitText text="Have an Idea? Let's Build Something Great."/></h2>
<div className="mt-16 grid gap-16 md:grid-cols-12"><Reveal className="md:col-span-5"><p className="text-bg/80">Terbuka untuk peluang kolaborasi, pengembangan proyek, dan kesempatan profesional.</p>
<ul className="mt-10 space-y-3">{links.map(([I,l,h])=><li key={l}><Magnetic s={.15}><a href={h} target="_blank" rel="noreferrer" className="flex items-center gap-3 py-1 hover:underline"><I size={18}/>{l}</a></Magnetic></li>)}</ul></Reveal>
<Reveal delay={.1} className="md:col-span-6 md:col-start-7"><form onSubmit={send} noValidate className="space-y-7">
{F.map(([k,l,t])=><div key={k}><label htmlFor={k} className="text-sm text-bg/70">{l}</label><input id={k} type={t} value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})} aria-invalid={!!er[k]} className={c}/>{er[k]&&<p role="alert" className="mt-1 text-xs text-sun">{er[k]}</p>}</div>)}
<div><label htmlFor="message" className="text-sm text-bg/70">Message</label><textarea id="message" rows="4" value={f.message} onChange={e=>setF({...f,message:e.target.value})} aria-invalid={!!er.message} className={c+' resize-none'}/>{er.message&&<p role="alert" className="mt-1 text-xs text-sun">{er.message}</p>}</div>
<button disabled={st==='loading'} className="rounded-full bg-bg px-8 py-3.5 text-sm font-medium text-ink disabled:opacity-50">{st==='loading'?'Sending…':'Send Message'}</button>
<p aria-live="polite" className={`text-sm ${st==='ok'?'text-bg':'text-sun'}`}>{st==='ok'&&'Pesan terkirim. Saya akan membalas lewat email.'}{st==='err'&&'Pesan gagal terkirim. Periksa konfigurasi EmailJS di file .env, lalu coba lagi.'}</p></form></Reveal></div>
<footer className="mt-32 flex justify-between border-t border-bg/30 pt-8 text-sm text-bg/70"><span>© {new Date().getFullYear()} {P.name}</span><a href="#home">Kembali ke atas</a></footer></div></section>}

import {lazy,Suspense,useState} from 'react'
import {AnimatePresence} from 'framer-motion'
import {Cursor,Loader,ScrollProgress} from './components/ui'
import Nav from './components/Nav'
import Hero from './sections/Hero'
const C=n=>lazy(()=>import('./sections/Content').then(m=>({default:m[n]})))
const About=C('About'),Skills=C('Skills'),Projects=C('Projects'),Journey=C('Journey')
const Contact=lazy(()=>import('./sections/Contact'))
export default function App(){const[l,setL]=useState(true)
return <><Cursor/><ScrollProgress/><AnimatePresence>{l&&<Loader done={()=>setL(false)}/>}</AnimatePresence><Nav/>
<main><Hero/><Suspense fallback={null}><About/><Skills/><Projects/><Journey/><Contact/></Suspense></main></>}

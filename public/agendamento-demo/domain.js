export const services=[{id:'escova',name:'Escova',duration:45,price:80,icon:'♧'},{id:'corte',name:'Corte feminino',duration:60,price:120,icon:'✂'},{id:'hidratacao',name:'Hidratação',duration:90,price:150,icon:'♧'}];
export const professionals=[{id:'carla',name:'Carla',services:['escova','corte','hidratacao']},{id:'ana',name:'Ana',services:['escova','hidratacao']},{id:'julia',name:'Júlia',services:['corte']}];
export const minutes=time=>Number(time.slice(0,2))*60+Number(time.slice(3));
export const clock=value=>`${String(Math.floor(value/60)).padStart(2,'0')}:${String(value%60).padStart(2,'0')}`;
export const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export function available({date,time,serviceId,professionalId},bookings=[],now=Date.now()){
 const service=services.find(item=>item.id===serviceId),professional=professionals.find(item=>item.id===professionalId);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^\d{2}:\d{2}$/.test(time)||!service||!professional?.services.includes(serviceId))return false;
 const day=new Date(date+'T12:00:00-03:00');
 if(isNaN(day)||day.toISOString().slice(0,10)!==date||day.getUTCDay()===0)return false;
 const start=minutes(time),end=start+service.duration;
 if(start<540||end>1080||start%30!==0||Date.parse(date+'T'+time+':00-03:00')<=now)return false;
 const busy=[{start:720,end:780},{start:600,end:660},{start:870,end:930},...bookings.filter(item=>item.status!=='cancelled'&&item.date===date&&item.professionalId===professionalId)];
 return !busy.some(item=>start<item.end&&end>item.start);
}


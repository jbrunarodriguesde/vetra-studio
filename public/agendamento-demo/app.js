import {services,professionals,minutes,clock,today,available} from './domain.js';
const $=id=>document.getElementById(id),key='atelie-bookings-v1';
let selection={serviceId:'escova',professionalId:'carla',date:'2026-11-18',time:'16:00'};
function read(){try{const data=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(data))throw Error();return data}catch{throw Error('Não foi possível ler as reservas locais. Verifique o armazenamento do navegador.')}}
const money=value=>value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
function render(){
 $('error').textContent='';let bookings;try{bookings=read()}catch(error){$('error').textContent=error.message;bookings=[]}
 const service=services.find(item=>item.id===selection.serviceId);
 $('services').replaceChildren(...services.map(item=>{const button=document.createElement('button');button.type='button';button.className='service'+(item.id===selection.serviceId?' selected':'');button.setAttribute('aria-pressed',item.id===selection.serviceId);button.innerHTML=`<span class="icon">${item.icon}</span><strong>${item.name}</strong><small>${item.duration} min · ${money(item.price)}</small>`;button.onclick=()=>{selection.serviceId=item.id;render()};return button}));
 const eligible=professionals.filter(item=>item.services.includes(service.id));if(!eligible.some(item=>item.id===selection.professionalId))selection.professionalId=eligible[0].id;
 $('professional').replaceChildren(...eligible.map(item=>new Option(item.name+' · Especialista',item.id)));$('professional').value=selection.professionalId;
 if(selection.time&&!available(selection,bookings))selection.time='';
 $('slots').replaceChildren(...Array.from({length:18},(_,index)=>{const time=clock(540+index*30),button=document.createElement('button');button.type='button';button.textContent=time;button.disabled=!available({...selection,time},bookings);button.className=time===selection.time?'selected':'';button.setAttribute('aria-pressed',time===selection.time);button.onclick=()=>{selection.time=time;render()};return button}));
 const professional=professionals.find(item=>item.id===selection.professionalId);
 const rows=[['Serviço',service.name],['Profissional',professional.name],['Data',selection.date?selection.date.split('-').reverse().join('/'):'Selecione'],['Horário',selection.time||'Selecione'],['Duração',service.duration+' minutos'],['Término previsto',selection.time?clock(minutes(selection.time)+service.duration):'—'],['Total',money(service.price)]];
 $('summary').innerHTML=rows.map(([label,value],index)=>`<div class="row ${index===6?'total':''}"><span>${label}</span><b>${value}</b></div>`).join('');
}
$('date').min=today();$('professional').onchange=event=>{selection.professionalId=event.target.value;render()};$('date').onchange=event=>{selection.date=event.target.value;render()};
$('form').onsubmit=async event=>{event.preventDefault();$('error').textContent='';const name=$('name').value.trim(),phone=$('phone').value.replace(/\D/g,'');if(name.length<2||!/^\d{10,11}$/.test(phone)){ $('error').textContent='Informe seu nome e um celular com DDD (10 ou 11 dígitos).';return}
 const commit=()=>{const bookings=read();if(!available(selection,bookings))throw Error('Este horário não está disponível. Escolha outro horário.');const service=services.find(item=>item.id===selection.serviceId);const booking={...selection,status:'confirmed',customerName:name,customerPhone:phone,price:service.price,id:crypto.randomUUID(),start:minutes(selection.time),end:minutes(selection.time)+service.duration,createdAt:new Date().toISOString()};localStorage.setItem(key,JSON.stringify([...bookings,booking]));return booking};
 try{$('confirm').disabled=true;const booking=navigator.locks?await navigator.locks.request(key,commit):commit();$('receipt').textContent=`${name}, sua demonstração de ${services.find(item=>item.id===booking.serviceId).name} com ${professionals.find(item=>item.id===booking.professionalId).name} está salva para ${booking.date.split('-').reverse().join('/')} às ${booking.time}. Código: ${booking.id.slice(0,8)}.`;$('success').showModal();render()}catch(error){render();$('error').textContent=error.message}finally{$('confirm').disabled=false}};
$('again').onclick=()=>$('success').close();window.addEventListener('storage',render);render();


import {services,professionals,clock} from './domain.js';
const key='atelie-bookings-v1',$=id=>document.getElementById(id),money=value=>value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
function read(){const items=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(items))throw Error('Reservas locais inválidas.');return items}
const state=item=>item.status||'confirmed';
for(const person of professionals)$('staff').add(new Option(person.name,person.id));
function render(){try{renderCalendar();const items=read().filter(item=>(!$('day').value||item.date===$('day').value)&&(!$('staff').value||item.professionalId===$('staff').value)&&(!$('status').value||state(item)===$('status').value)).sort((left,right)=>(left.date+left.time).localeCompare(right.date+right.time));
 $('count').textContent=items.filter(item=>state(item)==='confirmed').length;
 $('completed').textContent=items.filter(item=>state(item)==='completed').length;
 $('revenue').textContent=money(items.filter(item=>state(item)==='confirmed').reduce((total,item)=>total+(item.price??services.find(service=>service.id===item.serviceId)?.price??0),0));
 $('appointments').replaceChildren();if(!items.length){const empty=document.createElement('p');empty.textContent='Nenhuma reserva neste filtro. Faça um agendamento na página do cliente para começar.';$('appointments').append(empty)}
 for(const item of items){const article=document.createElement('article');article.className='appointment';const time=document.createElement('strong');time.textContent=`${item.time} – ${clock(item.end)}`;const details=document.createElement('div');const title=document.createElement('h3');title.textContent=item.customerName||'Cliente demonstrativo';details.append(title);for(const text of [services.find(service=>service.id===item.serviceId)?.name+' · '+professionals.find(person=>person.id===item.professionalId)?.name,item.date.split('-').reverse().join('/')+' · '+({confirmed:'Confirmado',completed:'Concluído',cancelled:'Cancelado'}[state(item)]||state(item)),item.customerPhone?'Contato fictício: '+item.customerPhone:'Reserva anterior sem contato','Código: '+item.id.slice(0,8)]){const paragraph=document.createElement('p');paragraph.textContent=text;details.append(paragraph)}const actions=document.createElement('div');actions.className='actions';if(state(item)==='confirmed')for(const [status,label] of [['completed','Concluir'],['cancelled','Cancelar']]){const button=document.createElement('button');button.textContent=label;button.className=status==='cancelled'?'cancel':'';button.onclick=async()=>{if(!confirm(`${label} este atendimento?`))return;const update=()=>{const records=read(),record=records.find(record=>record.id===item.id);if(!record||state(record)!=='confirmed')throw Error('A reserva já foi alterada em outra aba.');record.status=status;record.updatedAt=new Date().toISOString();localStorage.setItem(key,JSON.stringify(records))};try{if(navigator.locks)await navigator.locks.request(key,update);else update();$('notice').textContent=status==='cancelled'?'Reserva cancelada. O horário foi liberado para o cliente.':'Atendimento concluído.';render()}catch(error){$('notice').textContent=error.message}};actions.append(button)}article.append(time,details,actions);$('appointments').append(article)}
 }catch(error){$('notice').textContent='Não foi possível carregar a agenda: '+error.message}}
for(const id of ['day','staff','status'])$(id).onchange=render;$('all').onclick=()=>{$('day').value='';render()};window.addEventListener('storage',render);window.addEventListener('focus',render);


let month=new Date(2026,10,1);
function renderCalendar(){
 const records=read().filter(item=>state(item)!=='cancelled'&&(!$('staff').value||item.professionalId===$('staff').value)&&(!$('status').value||state(item)===$('status').value));
 $('month-title').textContent=month.toLocaleDateString('pt-BR',{month:'long',year:'numeric'});$('calendar').replaceChildren();
 for(const weekday of ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']){const label=document.createElement('span');label.textContent=weekday;$('calendar').append(label)}
 for(let gap=0;gap<month.getDay();gap++)$('calendar').append(document.createElement('span'));
 const days=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
 for(let day=1;day<=days;day++){const date=month.getFullYear()+'-'+String(month.getMonth()+1).padStart(2,'0')+'-'+String(day).padStart(2,'0'),count=records.filter(item=>item.date===date).length,button=document.createElement('button');button.type='button';button.textContent=day;button.setAttribute('aria-label',date.split('-').reverse().join('/')+', '+count+' reservas');button.setAttribute('aria-pressed',$('day').value===date);if(count){const badge=document.createElement('small');badge.textContent=count+' reserva'+(count===1?'':'s');button.append(badge)}button.onclick=()=>{$('day').value=date;render()};$('calendar').append(button)}
}
$('previous').onclick=()=>{month=new Date(month.getFullYear(),month.getMonth()-1,1);render()};
$('next').onclick=()=>{month=new Date(month.getFullYear(),month.getMonth()+1,1);render()};
$('day').addEventListener('change',()=>{if($('day').value){const [year,number]=$('day').value.split('-').map(Number);month=new Date(year,number-1,1);render()}});
render();

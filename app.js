'use strict';
const C=window.COURSE,K=window.StudyCore,KEY='miriam-estudos-v1';
let state=K.blank(), storageFailed=false, badSave=false;
try{const saved=localStorage.getItem(KEY);if(saved)state=K.validate(JSON.parse(saved),C);}catch(e){badSave=true;}
let step='theory', cardReveal=false,cardIndex=0,viewFilter='';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const main=document.querySelector('#main');
const button=(label,action,extra='',cls='')=>`<button type="button" class="${cls}" data-action="${action}" ${extra}>${label}</button>`;
const lesson=C.learning.lessons[0];
const questions=()=>C.learning.questions.filter(q=>lesson.questionIds.includes(q.id));
const formatDate=d=>d.slice(8,10)+'/'+d.slice(5,7);
function notice(text){document.querySelector('#notice').textContent=text;}
function persist(){if(badSave){notice('Há dados locais incompatíveis. Exporte o arquivo original em Meus dados antes de iniciar um novo registro.');return;}try{localStorage.setItem(KEY,JSON.stringify(state));storageFailed=false;}catch(e){storageFailed=true;notice('Não foi possível salvar no navegador. Exporte o progresso para não perdê-lo.');}}
function title(kicker,name,sub=''){return `<p class="eyebrow">${kicker}</p><h1>${name}</h1>${sub?`<p class="lead">${sub}</p>`:''}`;}
function availability(){return `<div class="partial"><b>Entrega parcial · 1 de 47 sessões disponível</b><br>A primeira aula tem conferência interna; revisão independente pendente. Demais aulas e todos os simulados estão em produção. <a href="docs/analise-documental.md">Ver limites e fontes</a></div>`;}
function render(){
 const view=location.hash.slice(1)||'inicio';document.documentElement.dataset.theme=state.theme;
 document.querySelectorAll('nav a').forEach(a=>{a.classList.toggle('active',a.hash==='#'+view);if(a.hash==='#'+view)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 const today=K.dateBR();
 if(view==='inicio'){
  const current=C.sessions.find(s=>s.date===today); const days=Math.max(0,Math.ceil((Date.parse('2026-12-13T00:00:00-03:00')-Date.parse(today+'T00:00:00-03:00'))/86400000));
  main.innerHTML=title('UM DIA DE CADA VEZ','Seu próximo passo, Miriam.','Estudo com direção, prática e tempo para revisar.')+availability()+`<div class="metrics"><div><strong>${days}</strong><span>dias até a prova prevista</span></div><div><strong>${state.completed.length}<small> / 47</small></strong><span>sessões concluídas</span></div><div><strong>30</strong><span>questões · 100 pontos na prova</span></div></div><section class="feature"><span class="tag">PRIMEIRA AULA DISPONÍVEL</span><h2>${esc(lesson.title)}</h2><p>Português · 20 de outubro · 8 questões autorais</p><p>Aprenda a encontrar evidências no texto e a perceber quando uma alternativa vai além do que foi dito.</p><a class="primary link-button" href="#aula">${state.attempts.PT01?'Rever minha aula':'Começar a estudar'} →</a></section><section class="panel"><h2>Hoje no calendário</h2><p>${current?esc(current.title)+(current.contentStatus==='a_produzir'?' — conteúdo ainda não disponível.':''):today<'2026-10-20'?'A preparação começa em 20/10. A primeira aula já pode ser acessada.':today>'2026-12-12'?'O período planejado terminou. O material disponível permanece acessível.':'Domingo é dia de descanso.'}</p><a href="#calendario">Ver as 47 sessões →</a></section>`;
 }else if(view==='calendario'){
  main.innerHTML=title('ROTEIRO ATÉ A PROVA','Seu calendário','Datas fixas. Domingos livres. Os blocos pendentes não são aulas prontas.')+availability()+`<div class="calendar">${C.sessions.map(s=>`<article class="session"><div class="date">${formatDate(s.date)}<small>${s.id}</small></div><div><span class="tag">${esc(s.phase)} · ${s.minutes} min</span><h2>${esc(s.title)}</h2><p>${esc(s.objective)}</p><p class="muted">Revisões: ${s.reviewFrom.map(r=>r.sessionId).join(', ')||'sem bloco anterior programado'}</p>${s.id==='S01'?'<a href="#aula">Abrir aula disponível →</a>':'<span class="pending">Planejada · conteúdo pendente</span>'}</div></article>`).join('')}</div>`;
 }else if(view==='aula'){renderLesson();}
 else if(view==='revisoes'){
  const due=C.learning.flashcards.filter(f=>!state.cards[f.id]||state.cards[f.id].due<=today);cardIndex=Math.min(cardIndex,Math.max(0,due.length-1));const f=due[cardIndex];
  main.innerHTML=title('RECUPERAÇÃO ATIVA','Flashcards',`${due.length} cartões disponíveis para revisar. Pense na resposta antes de revelar.`)+`<p class="muted">Novos cartões da primeira aula ficam disponíveis imediatamente. “Rever” agenda para amanhã; acertos ampliam o intervalo em 3, 7, 14 e 21 dias. Intervalos que ultrapassariam a prova são encurtados até 12/12, enquanto essa data estiver no futuro. As revisões programadas no calendário abrangem também os futuros módulos.</p>`+(f?`<section class="flash"><span class="tag">PORTUGUÊS · ${esc(f.id)}</span><h2>${esc(f.front)}</h2>${cardReveal?`<p>${esc(f.back)}</p><div class="actions">${button('Preciso rever','rate-card',`data-id="${f.id}" data-quality="again"`)}${button('Lembrei','rate-card',`data-id="${f.id}" data-quality="good"`)}${button('Foi fácil','rate-card',`data-id="${f.id}" data-quality="easy"`,'primary')}</div>`:button('Revelar resposta','reveal','','primary')}</section>`:'<section class="panel"><h2>Revisões em dia.</h2><p>Os próximos cartões aparecerão na data agendada.</p></section>')+`<details><summary>Próximas revisões</summary>${C.learning.flashcards.map(f=>`<p>${esc(f.front)} — ${state.cards[f.id]?.due||'novo'}</p>`).join('')}</details>`;
 }else if(view==='erros'){
  const a=state.attempts.PT01;const list=a?questions().filter(q=>a.answers[q.id]!==q.correct||a.doubts.includes(q.id)):[];
  main.innerHTML=title('APRENDER COM A CORREÇÃO','Erros e dúvidas','Acertos inseguros também merecem revisão.')+(list.length?list.map(q=>reviewHTML(q,a)).join(''):'<section class="panel"><p>Nenhum erro ou dúvida registrado. Os resultados aparecem após concluir o bloco de questões.</p></section>');
 }else if(view==='edital'){
  main.innerHTML=title('COBERTURA DO PROGRAMA','Edital verticalizado','243 itens para acompanhar. Passagens são seu registro manual, inclusive de estudo fora desta versão.')+`<label>Filtrar disciplina <select id="subject-filter"><option value="">Todas</option>${C.subjects.map(s=>`<option value="${s.id}" ${viewFilter===s.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select></label><p class="muted">P1/P2/P3 são prioridades sugeridas, não incidência oficial da banca. Normas amplas exigem ainda conferência dos capítulos e regulamentos.</p><div class="topic-list">${C.topics.filter(t=>!viewFilter||t.subject===viewFilter).map(t=>`<div><div><span class="tag">${t.id} · ${t.priority}</span><p>${esc(t.title)}</p></div><label>Passagens <select data-pass="${t.id}" aria-label="Passagens de ${esc(t.title)}">${[0,1,2,3].map(n=>`<option value="${n}" ${n===(state.passes[t.id]||0)?'selected':''}>${n}</option>`).join('')}</select></label></div>`).join('')}</div>`;
 }else if(view==='estatisticas'){
  const a=state.attempts.PT01,n=a?K.score(a,questions()):0;
  main.innerHTML=title('ACOMPANHAMENTO','Seu progresso','Resultados do material efetivamente respondido.')+`<div class="metrics"><div><strong>${state.completed.length}</strong><span>sessões concluídas de 47</span></div><div><strong>${a?n:0}<small> / ${a?8:0}</small></strong><span>acertos / questões respondidas</span></div><div><strong>${a?8-n:0}</strong><span>erros no primeiro bloco</span></div></div><section class="panel"><h2>Por disciplina</h2><table><thead><tr><th>Disciplina</th><th>Acertos</th><th>Estimativa parcial</th></tr></thead><tbody>${C.subjects.map(s=>`<tr><td>${esc(s.name)}</td><td>${s.id==='PT'&&a?n+'/8':'Sem respostas'}</td><td>${s.id==='PT'&&a?(n/8*20).toFixed(1)+'/20':'—'}</td></tr>`).join('')}</tbody></table><p class="muted">Estimativa de Português = taxa de acertos × 20. O bloco cobre somente leitura e sentido; não representa toda a disciplina nem prevê a nota da prova. Não há estimativa global ou simulado realizado.</p></section>`;
 }else if(view==='dados'){
  main.innerHTML=title('PROGRESSO NO SEU NAVEGADOR','Meus dados','Faça uma cópia para levar seus registros a outro aparelho.')+`<section class="panel"><p>O progresso não sincroniza automaticamente. Uma mudança de domínio, navegador ou aparelho cria outro armazenamento.</p><div class="actions">${button('Exportar progresso','export','','primary')}<label class="link-button">Importar JSON<input id="import-file" type="file" accept="application/json,.json"></label></div><p>Importar substitui o progresso atual após validação e confirmação. Exporte antes se quiser preservar as duas versões.</p>${badSave?`<p class="warning">O registro local existente não pôde ser validado e não foi sobrescrito.</p>${button('Baixar registro original','export-raw')}${button('Iniciar registro novo','reset-bad')}`:''}<p class="muted">Versão do formato: 1 · ${storageFailed?'Armazenamento indisponível nesta sessão':'Salvamento automático ao responder e concluir ações.'}</p></section>`;
 }else{main.innerHTML=title('NAVEGAÇÃO','Página não encontrada')+'<a href="#inicio">Voltar ao início</a>';}
}
function renderLesson(){
 const a=state.attempts.PT01; if(a&&step==='quiz')step='review';
 main.innerHTML=title('SESSÃO 01 · PORTUGUÊS',esc(lesson.title),'Texto e questões autorais. Conferência interna; revisão independente pendente.')+`<div class="steps">${button('1 · Aula','step', 'data-step="theory"',step==='theory'?'active':'')}${button('2 · Questões','step','data-step="quiz"',step==='quiz'?'active':'')}${button('3 · Correção','step',`data-step="review" ${a?'':'disabled'}`,step==='review'?'active':'')}</div>`;
 if(step==='theory')main.innerHTML+=`<article class="reading">${lesson.sections.map(s=>`<section><h2>${esc(s.title)}</h2>${s.text.split('\n\n').map(p=>`<p>${esc(p)}</p>`).join('')}</section>`).join('')}<p class="muted">${lesson.references.map(esc).join('<br>')}</p>${button(a?'Ver minha correção':'Ir para as questões','step',`data-step="${a?'review':'quiz'}"`,'primary')}</article>`;
 if(step==='quiz'){
  const d=state.drafts.PT01||{answers:{},doubts:[]};
  main.innerHTML+=`<p>Responda às oito questões. O gabarito só aparece após finalizar o bloco. Suas escolhas são salvas durante a resolução.</p>${questions().map((q,i)=>`<fieldset class="question"><legend>${i+1}. ${esc(q.prompt)}</legend><p class="muted">${q.difficulty} · ${q.origin}</p>${q.options.map((o,j)=>`<label class="option"><input type="radio" name="${q.id}" data-answer="${q.id}" value="${j}" ${d.answers[q.id]===j?'checked':''}><span><b>${'ABCD'[j]}.</b> ${esc(o)}</span></label>`).join('')}<label class="doubt"><input type="checkbox" data-doubt="${q.id}" ${d.doubts.includes(q.id)?'checked':''}> Fiquei em dúvida</label></fieldset>`).join('')}${button('Finalizar bloco e corrigir','submit','','primary')}`;
 }
 if(step==='review'&&a){
  const selected=questions().filter(q=>a.answers[q.id]!==q.correct||a.doubts.includes(q.id));
  main.innerHTML+=`<section class="panel"><h2>${K.score(a,questions())} acertos de 8</h2><p>Revise as erradas e duvidosas abaixo. Os comentários das demais também estão disponíveis.</p></section>${selected.map(q=>reviewHTML(q,a)).join('')}<details><summary>Ver comentários de todas as questões</summary>${questions().map(q=>reviewHTML(q,a)).join('')}</details><div class="actions">${button(state.completed.includes('S01')?'Sessão concluída ✓':'Li a correção · concluir sessão','complete',state.completed.includes('S01')?'disabled':'','primary')}<a href="#revisoes">Revisar flashcards →</a></div>`;
 }
}
function reviewHTML(q,a){return `<article class="review"><span class="tag">${q.id} · ${a.answers[q.id]===q.correct?'Acerto':'Erro'}${a.doubts.includes(q.id)?' · Dúvida':''}</span><h2>${esc(q.prompt)}</h2><p>Sua resposta: <b>${'ABCD'[a.answers[q.id]]}</b>. Correta: <b>${'ABCD'[q.correct]}</b>.</p>${q.options.map((o,j)=>`<p><b>${'ABCD'[j]}. ${esc(o)}</b><br>${esc(q.comments[j])}</p>`).join('')}<p class="callout">Revisão: ${esc(q.review)}</p><small>${esc(q.reference)}</small></article>`;}
document.addEventListener('click',e=>{
 const el=e.target.closest('[data-action]');if(!el)return;const action=el.dataset.action;
 if(action==='step'){if(el.dataset.step==='review'&&!state.attempts.PT01)return;step=el.dataset.step;render();main.focus();}
 if(action==='submit'){
  const d=state.drafts.PT01;if(!d||questions().some(q=>d.answers[q.id]===undefined)){notice('Responda às oito questões antes de finalizar.');return;}
  state.attempts.PT01={answers:{...d.answers},doubts:[...d.doubts],at:new Date().toISOString()};delete state.drafts.PT01;persist();step='review';render();main.focus();notice('Bloco finalizado. Confira sua correção.');
 }
 if(action==='complete'&&state.attempts.PT01&&!state.completed.includes('S01')){state.completed.push('S01');persist();render();notice('Sessão concluída. Seu progresso foi atualizado.');}
 if(action==='reveal'){cardReveal=true;render();}
 if(action==='rate-card'&&cardReveal){state.cards[el.dataset.id]=K.nextCard(state.cards[el.dataset.id],el.dataset.quality,K.dateBR());persist();cardReveal=false;render();}
 if(action==='export')download(JSON.stringify(state,null,2),'miriam-progresso-'+K.dateBR()+'.json');
 if(action==='export-raw'){try{download(localStorage.getItem(KEY)||'','miriam-registro-original.txt');}catch(err){notice('O navegador bloqueou a leitura do registro.');}}
 if(action==='reset-bad'&&confirm('Já guardou o registro original? Iniciar um novo registro substitui o conteúdo local anterior.')){badSave=false;state=K.blank();persist();render();}
});
document.addEventListener('change',async e=>{
 const el=e.target;
 if(el.dataset.answer||el.dataset.doubt){const d=state.drafts.PT01||{answers:{},doubts:[]};if(state.attempts.PT01)return;if(el.dataset.answer)d.answers[el.dataset.answer]=Number(el.value);else{d.doubts=d.doubts.filter(id=>id!==el.dataset.doubt);if(el.checked)d.doubts.push(el.dataset.doubt);}state.drafts.PT01=d;persist();}
 if(el.dataset.pass){state.passes[el.dataset.pass]=Number(el.value);persist();}
 if(el.id==='subject-filter'){viewFilter=el.value;render();}
 if(el.id==='import-file'&&el.files[0]){
  try{if(el.files[0].size>2_000_000)throw Error('Arquivo acima do limite de 2 MB.');const incoming=K.validate(JSON.parse(await el.files[0].text()),C);if(confirm('Substituir o progresso atual pelos dados deste arquivo?')){state=incoming;badSave=false;persist();render();notice('Progresso importado.');}}catch(err){notice('Não foi possível importar: '+err.message);}el.value='';
 }
});
function download(content,name){const blob=new Blob([content],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
document.querySelector('#theme').onclick=()=>{state.theme=state.theme==='light'?'dark':'light';persist();render();};
window.addEventListener('hashchange',()=>{render();main.focus();});
render();if(badSave)notice('Não foi possível validar ou ler o progresso local. Veja Meus dados; o registro anterior foi preservado.');

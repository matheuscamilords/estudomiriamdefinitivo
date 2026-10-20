(function(root){
 'use strict';
 const blank=()=>({version:1,theme:'light',completed:[],attempts:{},drafts:{},cards:{},passes:{}});
 function validate(s,course){
  if(!s||s.version!==1||!['light','dark'].includes(s.theme))throw Error('Versão ou tema incompatível.');
  const obj=x=>x&&typeof x==='object'&&!Array.isArray(x);
  for(const k of ['attempts','drafts','cards','passes'])if(!obj(s[k]))throw Error('Estrutura inválida: '+k);
  const lessons=course.learning.lessons, qs=course.learning.questions;
  if(!Array.isArray(s.completed)||new Set(s.completed).size!==s.completed.length||s.completed.some(id=>!lessons.some(l=>l.sessionId===id)))throw Error('Sessões concluídas inválidas.');
  for(const type of ['attempts','drafts'])for(const [id,a] of Object.entries(s[type])){
   const lesson=lessons.find(l=>l.id===id);
   if(!lesson||!obj(a)||!obj(a.answers)||!Array.isArray(a.doubts))throw Error('Bloco inválido.');
   for(const [qid,v] of Object.entries(a.answers))if(!lesson.questionIds.includes(qid)||!Number.isInteger(v)||v<0||v>3)throw Error('Resposta inválida.');
   if(a.doubts.some(qid=>!lesson.questionIds.includes(qid))||new Set(a.doubts).size!==a.doubts.length)throw Error('Dúvida inválida.');
   if(type==='attempts'&&(lesson.questionIds.some(qid=>a.answers[qid]===undefined)||!Number.isFinite(Date.parse(a.at))))throw Error('Tentativa incompleta.');
  }
  for(const id of s.completed){const l=lessons.find(l=>l.sessionId===id);if(!s.attempts[l.id])throw Error('Conclusão sem tentativa.');}
  for(const [id,c] of Object.entries(s.cards))if(!course.learning.flashcards.some(f=>f.id===id)||!obj(c)||!Number.isInteger(c.level)||c.level<0||c.level>4||!/^\d{4}-\d{2}-\d{2}$/.test(c.due)||!Number.isFinite(Date.parse(c.due)))throw Error('Flashcard inválido.');
  for(const [id,p] of Object.entries(s.passes))if(!course.topics.some(t=>t.id===id)||!Number.isInteger(p)||p<0||p>3)throw Error('Passagem inválida.');
  return {version:1,theme:s.theme,completed:s.completed,attempts:s.attempts,drafts:s.drafts,cards:s.cards,passes:s.passes};
 }
 function score(attempt,questions){return questions.reduce((n,q)=>n+(attempt.answers[q.id]===q.correct?1:0),0);}
 function dateBR(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
 function nextCard(old,quality,today){const level=quality==='again'?0:Math.min(4,(old?.level??0)+(quality==='easy'?2:1));const days=quality==='again'?1:[1,3,7,14,21][level];const d=new Date(today+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);let due=d.toISOString().slice(0,10);if(today<'2026-12-12'&&due>'2026-12-12')due='2026-12-12';return {level,due};}
 const api={blank,validate,score,dateBR,nextCard};root.StudyCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);

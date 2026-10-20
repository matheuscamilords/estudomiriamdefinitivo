const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'data.js'),'utf8'),context);
const C=context.window.COURSE,K=require('../core.js');
const qs=C.learning.questions;
const a={answers:Object.fromEntries(qs.map(q=>[q.id,q.correct])),doubts:[],at:new Date().toISOString()};
assert.equal(K.score(a,qs),8);
const wrong={...a,answers:{...a.answers,[qs[0].id]:(qs[0].correct+1)%4}};
assert.equal(K.score(wrong,qs),7);
let s=K.blank();s.attempts.PT01=a;s.completed=['S01'];
assert.equal(K.validate(JSON.parse(JSON.stringify(s)),C).completed[0],'S01');
for(const mutate of [s=>s.version=2,s=>s.completed.push('S99'),s=>s.attempts.PT01.answers[qs[0].id]=4,s=>delete s.attempts.PT01.answers[qs[0].id],s=>s.passes.INVALID=1,s=>s.cards.fake={level:0,due:'2026-10-21'},s=>s.attempts.PT01.doubts.push('missing')]){
 const bad=JSON.parse(JSON.stringify(s));mutate(bad);assert.throws(()=>K.validate(bad,C));
}
assert.equal(K.dateBR(new Date('2026-10-20T01:00:00Z')),'2026-10-19');
assert.deepEqual(K.nextCard(undefined,'again','2026-10-31'),{level:0,due:'2026-11-01'});
assert.deepEqual(K.nextCard(undefined,'good','2026-10-20'),{level:1,due:'2026-10-23'});
assert.deepEqual(K.nextCard({level:4},'easy','2026-11-30'),{level:4,due:'2026-12-12'});
console.log('PASS: pontuação, round-trip de progresso, rejeição de dados inválidos, fuso de Brasília e revisão espaçada.');

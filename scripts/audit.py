import json
from datetime import date,timedelta
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def read(f):return json.loads((ROOT/'data'/f).read_text())
topics=read('topics.json');modules=read('modules-plan.json');sessions=read('sessions-plan.json');subjects=read('subjects.json');learning=read('learning.json')
for data in [topics,modules,sessions,subjects,learning['lessons'],learning['questions'],learning['flashcards']]:
 assert len({x['id'] for x in data})==len(data),'ID duplicado'
expected=[];d=date(2026,10,20)
while d<=date(2026,12,12):
 if d.weekday()!=6:expected.append(d.isoformat())
 d+=timedelta(days=1)
assert len(sessions)==47 and [s['date'] for s in sessions]==expected
assert sum(x['questions'] for x in subjects)==30
assert sum(x['questions']*x['weight'] for x in subjects)==100
assert len(topics)==243
tids={t['id'] for t in topics};mids={m['id'] for m in modules};sids={s['id'] for s in sessions}
assert tids=={t for m in modules for t in m['topicIds']}
assert mids=={m for s in sessions for m in s['modulePlanIds']}
for s in sessions:
 assert sum(s['timeBudget'].values())==s['minutes']
 assert (s['minutes']==60 and s['specialCode']=='VESPERA') or 120<=s['minutes']<=180
 assert set(s['topicIds'])<=tids
 assert all(r['sessionId'] in sids and r['sessionId']<s['id'] for r in s['reviewFrom'])
 if s['kind']=='simulado':assert s['minutes']==180 and s['questionTarget']==30
assert len([s for s in sessions if s['kind']=='simulado'])==3
qids={q['id'] for q in learning['questions']}
for q in learning['questions']:
 assert len(q['options'])==4 and len(set(q['options']))==4
 assert isinstance(q['correct'],int) and 0<=q['correct']<4
 assert len(q['comments'])==4 and all(len(c)>30 for c in q['comments'])
 assert q['origin'].startswith('Autoral') and q['reference']
 assert set(q['topicIds'])<=tids
for l in learning['lessons']:
 assert l['sections'] and all(len(s['text'])>100 for s in l['sections'])
 assert set(l['questionIds'])<=qids and l['references']
 assert l['sessionId'] in sids
assert {s['id'] for s in sessions if s['contentStatus'].startswith('disponivel')}=={l['sessionId'] for l in learning['lessons']}
covered={t for l in learning['lessons'] for t in l['topicIds']}
report=dict(planning='PASS',availableContentStructure='PASS',sessions=47,topicsPlanned=len(topics),topicsWithLesson=len(covered),modulesPlanned=len(modules),lessonsAvailable=len(learning['lessons']),questionsAvailable=len(qids),flashcardsAvailable=len(learning['flashcards']),simulationsAvailable=len(learning['simulations']),courseAcceptance='FAIL_INCOMPLETE',remainingSessions=[s['id'] for s in sessions if s['contentStatus']=='a_produzir'],substantiveReview='Somente conferência interna da primeira aula e seus oito itens; revisão independente pendente.',browserQA='Não executada: controle de navegador compatível indisponível.',githubPages='Preparado por caminhos relativos; publicação real não executada.')
(ROOT/'docs/audit-result.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2))

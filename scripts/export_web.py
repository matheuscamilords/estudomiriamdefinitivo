import json
from pathlib import Path
r=Path(__file__).resolve().parents[1]
data={key:json.loads((r/'data'/file).read_text()) for key,file in [('subjects','subjects.json'),('topics','topics.json'),('modules','modules-plan.json'),('sessions','sessions-plan.json'),('exam','exam.json'),('learning','learning.json')]}
(r/'data.js').write_text('window.COURSE = '+json.dumps(data,ensure_ascii=False)+';\n')
print('Exportação estática concluída.')

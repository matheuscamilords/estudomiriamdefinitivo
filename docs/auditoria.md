# Auditoria da entrega 01

## Verificações executadas

- 47 datas entre 20/10 e 12/12/2026, sem domingos e sem duplicação: passou.
- 243 subtópicos ligados a módulos planejados e todos os módulos ligados a sessões: passou.
- Orçamentos de minutos por sessão somam o total; véspera leve identificada: passou.
- Matriz de prova configurada: 30 questões, cinco por disciplina e 100 pontos: passou.
- Primeira aula com oito questões, quatro alternativas, um índice válido de resposta e comentário próprio por alternativa: passou.
- Referências internas entre a primeira aula, questões e subtópicos: passou.
- Sintaxe JavaScript: passou em `node --check app.js`.
- Pontuação dos casos de oito e sete acertos: passou.
- Exportação/importação lógica dos dados com preservação de respostas: passou.
- Rejeição de versão, resposta, dúvida, sessão ou cartão inválidos: passou.
- Data no fuso de Brasília e cálculo de intervalos de revisão com limite pré-prova: passou.

Os testes lógicos estão em `scripts/test-core.cjs`; a matriz estrutural em `scripts/audit.py`. O resultado legível por máquina está em `docs/audit-result.json`.

## O que não foi verificado

Não houve execução em navegador real, inspeção visual, teste de teclado completo, teste em dispositivo móvel ou prova de persistência real do localStorage. As folhas de estilo têm regras responsivas e os controles possuem rótulos, mas isso não equivale a aprovação de acessibilidade ou teste visual. O ambiente não disponibilizou o controle de navegador compatível exigido pelo fluxo de Sites; não foi iniciada uma alternativa de preview.

O projeto não usa dependências ou compilação. Portanto, “sintaxe passou” não deve ser chamado de “build React/Vite aprovado”. Não houve publicação no GitHub Pages ou teste de recursos na URL hospedada.

Não existem bancos de simulados nem cronômetro de simulado nesta versão. As três datas constam apenas no planejamento. Não há validação dos 30 itens por simulado porque esses itens ainda não foram produzidos.

## Revisão substantiva

A conferência interna da primeira aula verificou a correspondência entre textos autorais, respostas e comentários; a presença de uma única alternativa defensável; e o alinhamento com leitura, gêneros, tipos e significação. Não houve revisão independente de um segundo revisor. O material não é apresentado como prova real ou amostra empiricamente validada do estilo IBGP.

As normas jurídicas não foram transformadas em aulas sem fontes consolidadas. A contradição temporal dos documentos está preservada no relatório. Nenhum dado municipal não verificado foi usado para formular questões nesta entrega.

## Porta de aceitação final

**REPROVADA POR INCOMPLETUDE.** Há uma sessão disponível, 46 pendentes, oito questões, seis cartões e zero simulados disponíveis. Cinco dos 243 subtópicos têm aula; os demais têm apenas planejamento. Permanecem abertas as verificações normativas, a análise da banca, a produção e a revisão de conteúdo, os testes em navegador e a implantação. O manifesto conserva o estado para a próxima etapa.

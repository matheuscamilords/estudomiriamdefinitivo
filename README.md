# Miriam Estudos — entrega 01 (parcial)

Preparação para o cargo **325 — Agente Fiscal de Tributos**, IBGP, edital 02/2026 de São João del-Rei.

**Esta versão não é o curso completo.** Contém planejamento dos 47 dias, matriz de 243 subtópicos, decisões editoriais e primeira sessão de Português utilizável. As outras sessões e todos os simulados ainda precisam de conteúdo. A interface informa o estado de produção e não transforma planejamento em aula concluída.

## Utilizar

Abra `index.html` em navegador moderno. A aplicação usa HTML/CSS/JavaScript local, sem API, conta ou conteúdo remoto. Para maior previsibilidade do armazenamento, sirva a pasta com `python3 -m http.server 8000` e acesse `http://localhost:8000`. O arquivo `data.js` é uma exportação estática dos JSON de origem; não gera conteúdos durante o estudo.

O navegador guarda respostas, dúvida, conclusão, passagens do edital, revisões de flashcards e tema. Use “Exportar progresso” antes de mudar de navegador/origem ou limpar dados. Importar substitui o progresso atual depois de confirmação. Não há sincronização entre aparelhos. Se o navegador bloquear o armazenamento, a interface avisa; exporte o JSON.

## Publicar no GitHub Pages

1. Crie um repositório e envie o conteúdo desta pasta para a raiz.
2. Em Settings → Pages, selecione publicação pela branch principal e pasta `/ (root)`.
3. Aguarde a publicação e abra a URL informada pelo GitHub.
4. Para atualizar, envie os arquivos alterados mantendo IDs e chave `miriam-estudos-v1`. Preserve a origem/URL para continuar usando o mesmo armazenamento local.

Todos os caminhos são relativos; não há roteador de caminhos, dependências ou compilação. Esta escolha estática reduz dependências nesta primeira entrega; a preferência React/TypeScript/Vite do pedido ainda não foi implementada. Não há repositório remoto criado nem publicação realizada nesta execução. Não envie os PDFs privados ao repositório público: o pacote contém apenas inventário e referências, sem cópias integrais dos anexos.

## Organização

- `docs/analise-documental.md`: fontes, conflito temporal e pendências.
- `docs/cronograma.md`: datas, objetivos, tempos e revisões.
- `docs/matriz-cobertura.md`: itens e atividades previstas.
- `docs/guia-editorial.md`: critérios e limites da amostra da banca.
- `data/`: fontes JSON do planejamento e conteúdo disponível.
- `scripts/audit.py`: auditoria estrutural do pacote.
- `scripts/export_web.py`: empacota dados locais para uso no navegador.
- `MANIFEST.json`: situação persistente da produção e sequência de retomada.

## Verificar

Execute `python3 scripts/audit.py` na pasta do projeto. A auditoria de planejamento deve passar; a porta de aceitação do curso completo deve continuar fechada enquanto houver pendências. Execute `python3 scripts/export_web.py` após editar JSON e `node --check app.js` após editar a interface. Não há testes visuais de navegador realizados nesta entrega.

## Retomar

Leia o manifesto e a análise documental. Preserve os identificadores. Conclua pesquisa histórica da banca e mapas normativos oficiais, produza módulos em ordem do calendário e só altere `contentStatus` quando o material estiver efetivamente cadastrado e conferido. Reavalie o tempo de leitura de normas extensas. O alvo final continua sendo o curso completo, não esta versão parcial.

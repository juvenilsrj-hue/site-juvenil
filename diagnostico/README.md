# Plataforma de Diagnostico de Lideranca e Performance

MVP local da plataforma de diagnosticos para geracao de leads qualificados, devolutiva consultiva e apoio a ofertas de mentoria, treinamento e consultoria.

## Como abrir

Opcao simples: abra `index.html` no navegador.

Opcao recomendada:

```powershell
cd diagnostico-lideranca
node server.mjs
```

Depois acesse:

```text
http://127.0.0.1:4173
```

## O que funciona

- Cadastro do participante: nome, e-mail, WhatsApp, empresa e cargo.
- Dois diagnosticos independentes:
  - Lideranca e Perfil Profissional.
  - Maturidade Empresarial.
- 24 perguntas por diagnostico, em escala de 1 a 5.
- Barra de progresso.
- Salvamento automatico do rascunho no navegador.
- Resultado consultivo com score geral, scores por dimensao, perfil, riscos e plano inicial.
- Leitura comportamental inspirada em DISC para o diagnostico de lideranca.
- Matriz de maturidade empresarial com cinco niveis.
- Relatorio em PDF usando a funcao de impressao do navegador.
- Area administrativa com leads, filtros, dashboard e exportacao CSV compativel com Excel.

## Materiais de apoio

Os materiais ficam em `materiais-apoio`:

- `guia-lideranca-disc.md`
- `guia-maturidade-empresarial.md`

Eles servem para decifrar os resultados, conduzir devolutivas e transformar o diagnostico em conversa consultiva.

## Observacao sobre DISC

A leitura DISC usada neste MVP e uma referencia comportamental pratica, inspirada no modelo DISC. Ela nao deve ser apresentada como laudo psicologico ou assessment validado clinicamente sem uma etapa posterior de validacao metodologica.

## Proximos passos recomendados

1. Migrar a interface para Next.js.
2. Salvar participantes, respostas e resultados no Supabase.
3. Criar autenticacao administrativa com Supabase Auth.
4. Gerar PDF no servidor com layout proprio.
5. Integrar com HubSpot, RD Station, Pipedrive, Brevo ou WhatsApp.
6. Criar benchmarks por segmento, cargo e porte de empresa.
7. Refinar perguntas com base no material DISC completo e em validacao com casos reais.

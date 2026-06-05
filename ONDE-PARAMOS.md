# 📌 Onde paramos — Site Juvenill Ribêiro

_Última sessão: 04/06/2026_

Resumo do projeto pra retomar rápido na próxima sessão.

---

## ✅ O que já está pronto

- **Base:** site convertido do Lovable para projeto estático editável (HTML + Tailwind via CDN). Roda só abrindo no navegador, sem Node/Python.
- **Paleta aplicada** (tokens no topo do `index.html`):
  - Azul Profundo `#0B1521` (fundo) · Ouro Velho `#D8AE54` (acento) · Tijolo `#B85433` (raro)
  - Texto Areia `#F4F0E8` · Tags Carvão `#272B33`
  - Fontes: Montserrat (títulos) + Inter (texto)
- **Hero** reescrito: eyebrow "Juvenill (branco) Ribêiro (ouro)" + chamada
  "Vender gera movimento. / Pós-venda cria recorrência. / Liderança sustenta crescimento."
  + subtítulo "Mais de 18 anos no varejo automotivo...". Brilhos (glow/sombra) reduzidos.
- **História em camadas:** Sobre (bio) → Marcas → Reconhecimentos → Formação →
  O que faço → Método → Além do cargo (4 pilares) → Contato.
- **Reconhecimentos** (verificados nos documentos oficiais):
  - 3× Clube dos Samurai (FY16-17, FY17-18 e FY18-19) — VIPCAR
  - Top 10 Nissan · 2× Time de Ouro (VIPCAR) · Chile & México (Cancún 2018 / Chile 2019)
- **Fotos originais** (otimizadas ~85 KB): hero (P&B), sobre (colorida), além do cargo (camiseta).
- **Logos das montadoras** (faixa "Marcas por onde passei"): Nissan, Renault, Kia,
  Citroën, Peugeot — brancos sobre o azul, tamanho óptico equilibrado, nomes embaixo.
- **Menu:** Sobre · O que faço · Método · E-book · Cursos · Contato.
- **Redes sociais (Contato):** LinkedIn e Instagram já ativos (`/juvenilsrj/`).
- **Contato/CTA** reformulado pra atender PF (mentoria) e PJ (consultoria), com botão
  principal "Fazer diagnóstico gratuito".

---

## ⏳ Pendências (próxima sessão)

1. **Link do E-book** (menu) — placeholder `#`. Trocar pelo link externo.
2. **Link do Cursos** (menu) — placeholder `#`. Trocar pelo link externo.
3. **Link do Diagnóstico** (botão "Fazer diagnóstico gratuito" em Contato) — placeholder `#`.
   - Diagnóstico existe em `C:\Users\Juvenil\Documents\Olívia\diagnostico-lideranca\`.
   - Ideia: hospedar no mesmo domínio (ex: `/diagnostico`).
4. **Publicar o site** (link público grátis — Netlify Drop / Cloudflare Pages / GitHub Pages).
5. (Opcional) Menu **hambúrguer no mobile** — o menu do topo hoje aparece só no desktop.
6. (Opcional) Repetir **redes sociais no rodapé**.
7. (Opcional) **Limpeza** de arquivos não usados: `premio1.pdf`, `premio2.pdf`, `preview.png`,
   `juvenill-alem.png` (versão recortada que não usamos).

---

## ▶️ Como pré-visualizar

1. Dê duplo clique em **`server.ps1`** (ou rode `powershell -ExecutionPolicy Bypass -File server.ps1`).
2. Abra **http://localhost:8080** no navegador.
3. Para ver mudanças: salve o arquivo e dê **Ctrl+R** no navegador.

> Os logos das montadoras ficam em `assets/logos/`. As marcas em `assets/`.
> Para trocar uma foto, substitua o arquivo em `assets/` com o mesmo nome.

---

## 🗂️ Estrutura

```
juvenill-site/
├── index.html              ← o site inteiro (markup + tokens de cor)
├── server.ps1              ← servidor local de preview
├── README.md               ← guia de edição
├── ONDE-PARAMOS.md         ← este arquivo
└── assets/
    ├── juvenill-hero.jpg / juvenill-about.jpg / juvenill-alem.jpg
    └── logos/  (nissan, renault, kia, citroen, peugeot .png + instruções)
```

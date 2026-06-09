# Juvenill — Site (versão editável)

Site de **Juvenill Ribêiro** (Líder Comercial Automotivo), como um projeto **estático e editável**, sem necessidade de Node/build.

## Como abrir
Basta dar **duplo clique** em `index.html` — abre direto no navegador. Não precisa servidor.

## Estrutura
```
juvenill-site/
├── index.html          ← todo o site (markup + tokens de marca)
└── assets/
    ├── juvenill-hero.jpg    ← foto do topo (hero)
    ├── juvenill-about.jpg   ← foto da seção "Sobre"
    └── preview.png          ← imagem de compartilhamento (Open Graph)
```

## Como editar

### Textos
Abra `index.html` num editor e altere o texto dentro das tags. Cada seção está comentada
(`<!-- ===== HERO ===== -->`, `<!-- ===== SOBRE ===== -->`, etc.).

### Cores da marca
No topo do `index.html`, dentro de `tailwind.config`, edite os tokens:

| Token          | Valor atual | Nome / Uso                          |
|----------------|-------------|-------------------------------------|
| `background`   | `#0B1521`   | Azul Profundo — fundo dominante     |
| `foreground`   | `#F4F0E8`   | Areia — texto principal             |
| `brand`        | `#D8AE54`   | Ouro Velho — acento principal       |
| `accent`       | `#B85433`   | Tijolo — acento raro (ícones foco)  |
| `muted.foreground` | `#9AA3B2` | Textos secundários                |
| `secondary`    | `#272B33`   | Carvão — fundo das tags/pílulas     |
| `border`       | `#243345`   | Bordas                              |

Trocar `brand` muda automaticamente todos os destaques, botões e ícones.

### Imagens
Substitua os arquivos em `assets/` mantendo os mesmos nomes, ou edite os `src=""` no HTML.

### Contato
- E-mail do botão: procure por `mailto:contato@juvenill.com.br` e ajuste.
- Links de LinkedIn/Instagram: procure por `aria-label="LinkedIn"` / `"Instagram"` e troque o `href="#"`.

## Tecnologia
- **Tailwind CSS via CDN** (`cdn.tailwindcss.com`) — precisa de internet para os estilos carregarem.
- Fontes **Inter** + **Montserrat** (Google Fonts).
- Ícones embutidos como SVG (Lucide).

> Para colocar no ar em produção, o ideal é compilar o Tailwind em vez de usar o CDN
> (o CDN mostra um aviso no console e é mais lento). Posso converter para um build
> compilado ou para CSS puro se você quiser.

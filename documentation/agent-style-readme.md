# Style README

Baseado nos componentes existentes (`app/layout.tsx`, `components/search`, `components/theme`, `context/theme`) este documento resume o padrão visual atual para guiar a criação de novos componentes.

## Identidade visual e layout
- Fundo global com gradientes radiais suaves sobre uma cor base (`body` em `app/globals.css`). O clima é natural/pacífico, com verdes e azuis claros.
- Tipografia primária: Rubik (peso 300–900) aplicada via classes de fonte (`app/layout.tsx`). Geist Mono está disponível para trechos monoespaçados.
- Container principal centralizado, largura máxima de 5xl, padding horizontal de 16px e espaçamento vertical entre blocos (gap 24/40) (`app/layout.tsx`). Use esta malha para manter respirabilidade.
- Cor do texto base: `var(--color-text)`, antialiasing habilitado no `body` para suavidade.

## Sistema de temas e tokens
- Os temas são definidos em `lib/themes.ts` e aplicados pelo `ThemeProvider` (`context/theme.tsx`) via CSS custom properties no `:root`.
- Tokens disponíveis (prefixo `--color-`): `background`, `surface`, `surface-muted`, `border`, `text`, `muted`, `primary`, `primary-strong`, `accent`, `accent-strong`, `highlight`, `gradient-1/2/3`.
- Os componentes devem consumir tokens diretamente (`var(--color-*)`) ou classes utilitárias `theme-input`/`theme-card`/`theme-pill` definidos em `app/globals.css`.
- Gradiente de fundo padrão combina três cores (`gradient-1/2/3`) e deve ser reutilizado para áreas grandes ou placeholders ilustrativos.

## Componentes de referência
- **Search** (`components/search/index.tsx`): cartão arredondado (`rounded-2xl`) com sombra suave; ícones dentro de cápsulas (`h-9 w-9`, fundo `--color-accent`, texto `--color-primary-strong`). Campos usam `theme-input`, texto pequeno/médio, placeholder opaco e foco com sombra. Listas suspensas têm cantos arredondados, fundo `--color-surface`, `shadow-xl`, estados hover/active com `--color-highlight` e `--color-accent`.
- **Tema** (`components/theme/index.tsx`): painel com header denso, grid de amostras com borda fina `--color-border` e sombra leve. As swatches exibem nome e hex, ajustando a cor do texto conforme luminância. O seletor de tema usa `theme-input` e `rounded-xl`.
- **ThemeProvider** (`context/theme.tsx`): aplica tokens no mount/alteração de tema; novos componentes herdam automaticamente as variáveis de cor sem configuração adicional.

## Princípios de UI/UX extraídos
- Cantos arredondados generosos (XL a 2XL) e sombras suaves criam sensação de cartão elevado.
- Paleta predominantemente pastel, com contrastes feitos por `primary-strong` para títulos e `accent` para destaques.
- Espaçamento confortável: paddings entre 10–20px em cartões; gaps claros entre itens de listas e seções.
- Estados de interação visíveis: foco com outline/sombra em `theme-input`; hover/active em listas com mudanças de fundo; seleções mostradas em cápsulas com ícone de confirmação.
- Texto: títulos em pesos semi-bold, corpo em 14–16px; uso de uppercase e tracking largo em labels auxiliares.

## Diretrizes para novos componentes
- Consuma cores via `var(--color-*)`; evite valores hex diretos para respeitar troca de tema.
- Prefira cartões `rounded-2xl` com `shadow-xl shadow-emerald-900/10` para blocos principais; use `theme-card` para superfícies neutras.
- Campos de formulário devem usar `theme-input` e seguir o padding/altura do Search (`py-2.5/3`, `rounded-xl`). Mantenha ícones alinhados à esquerda com `pl-*` apropriado.
- Use `--color-highlight` para hovers suaves e `--color-accent` para estados ativos/selecionados.
- Adote Rubik para textos; reserve Geist Mono apenas para dados técnicos/códigos.
- Para páginas, mantenha o container máximo de 5xl e o espaçamento vertical consistente com o layout raiz.

## Como validar visualmente
- Troque temas pelo `ThemePanel` para checar contraste e legibilidade.
- Verifique foco/hover em inputs e listas.
- Confirme que gradientes e sombras permanecem sutis, sem poluir o fundo.

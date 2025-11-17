# Visão geral

Aplicação Next.js (App Router) para planejamento de localização com duas entradas principais no fluxo UX: busca textual e interação com mapa. A UI é composta de componentes client-side, usa Leaflet via `react-leaflet` para mapa e Zustand (`planningStore`) para estado de localização compartilhado. Integra-se ao Nominatim (OpenStreetMap) para geocodificação e pesquisa por bounding box.

# Organização

- `app/planejamento/localizacao/page.tsx`: rota que rendeiza `Search` e `Map` (o mapa é carregado dinamicamente sem SSR).
- `components/search/`: busca textual com debounce e dropdown de resultados.
- `components/map/`: mapa Leaflet com clique para selecionar ponto, sincronização com bounding box e estado global.
- `core/request/`: camada de dados (tipos, store Zustand, serviços HTTP e actions); `http/axios.config.ts` configura o cliente Nominatim.

# Estados (planningStore)

- Store persistida com Zustand (`core/request/location/store/location.store.ts`), usando `customStorage` (localStorage no cliente, fallback em memória).
- Shape: `loading`, `results: LocationSearchResult[]`, `error`, `selected: LocationSelection | null`.
- Actions expostas em `core/request/location/actions/location.actions.ts`:
  - `searchLocationsAction(term)`: pesquisa textual, popula `results`, controla `loading`/`error`.
  - `searchLocationsByBoundingBoxAction({ term, bbox })`: pesquisa restrita à caixa atual do mapa, define `results` e `selected`.
  - `setSelectedLocationAction(location)`, `resetLocationSearchAction()`, `resetSelectedLocationAction()`.

# Componentes analisados

## Search (`components/search/index.tsx`)

- Entrada controlada com debounce (300ms). Termos vazios invocam `resetLocationSearchAction`.
- A cada `trimmedTerm` válido dispara `searchLocationsAction` com `AbortController` para evitar respostas tardias.
- Dropdown abre quando há termo ou foco com texto; lista `results` do store e mostra status `loading`.
- Selecionar um item executa `setSelectedLocationAction`, limpa o input e fecha a lista.

## Map (`components/map/index.tsx` e helpers)

- Configura ícones padrão do Leaflet de forma idempotente (`configure-default-marker.ts`).
- Deriva posição inicial do marcador de `selected.boundingBox` ou `initialCenter`. Usa `boundingBoxCenter` para centralizar seleção.
- Mantém marcador manual (`manualMarker`) para diferenciar zoom/centro automático do usuário (`userHasMoved`).
- `MapClickHandler`: captura clique no mapa, calcula bounding box atual e chama `searchLocationsByBoundingBoxAction` com lat/lon clicados.
- `SyncView`: ajusta viewport; se houver `bbox` e o usuário não moveu, dá `fitBounds` com padding e zoom 14, senão `setView` no centro.
- `MapContainer` recebe `markerPosition` e re-renderiza marcador quando `selected` muda ou usuário clica.

# Fluxos de dados

```mermaid
flowchart LR
  subgraph UI
    S[Search input]
    D[Dropdown resultados]
    M[Map]
  end
  subgraph State
    LS[Zustand<br/>planningStore]
  end
  subgraph API
    NOM[Nominatim API]
  end

  S -->|debounce term| SA[searchLocationsAction]
  SA -->|HTTP /search| NOM
  NOM -->|results| SA
  SA -->|set results/loading| LS
  LS -->|results| D
  D -->|select item| SEL[setSelectedLocationAction]
  SEL -->|selected| LS
  LS -->|selected/bbox| M

  M -->|click + bbox| SBA[searchLocationsByBoundingBoxAction]
  SBA -->|HTTP /search (viewbox)| NOM
  NOM --> SBA
  SBA -->|results + selected| LS
```

```mermaid
sequenceDiagram
  participant User
  participant Search
  participant Store as planningStore
  participant Service as Nominatim service
  participant Map

  User->>Search: Digita termo
  Search->>Store: searchLocationsAction(term)
  Store->>Service: GET /search?q=<term> brasil
  Service-->>Store: results
  Store-->>Search: results/loading
  User->>Search: Clica em resultado
  Search->>Store: setSelectedLocationAction(item)
  Store-->>Map: selected + boundingBox
  Map->>Map: SyncView ajusta viewport/zoom
  User->>Map: Clica em ponto
  Map->>Store: searchLocationsByBoundingBoxAction(term=lat,lng,bbox)
  Store->>Service: GET /search bounded by viewbox
  Service-->>Store: results/selected
  Store-->>Map: selected; marcador acompanha
```

# Como tudo se conecta

- A UI lê diretamente do `planningStore` para mostrar resultados, estado de carregamento e seleção ativa.
- Actions são a única porta de escrita no store; elas orquestram chamadas a serviços HTTP e tratam cancelamentos/erros.
- Serviços encapsulam chamadas ao Nominatim, transformando `RawNominatimResult` em `LocationSearchResult` (com `BoundingBox` numérico).
- O mapa reage tanto a seleção manual (clique) quanto a seleção de resultados, mantendo sincronizados marcador e viewport. Search, por sua vez, exibe o mesmo estado compartilhado, garantindo consistência entre mapa e lista.

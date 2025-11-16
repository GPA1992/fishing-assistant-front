export type ThemeDefinition = {
  id: string;
  name: string;
  colors: {
    background: string;
    surface: string;
    surfaceMuted: string;
    border: string;
    text: string;
    muted: string;
    primary: string;
    primaryStrong: string;
    accent: string;
    accentStrong: string;
    highlight: string;
    gradient: [string, string, string];
  };
};

export const themes: ThemeDefinition[] = [
  {
    id: "verde-azul",
    name: "Verde & Azul",
    colors: {
      background: "#d0e6a6", // verde claro
      surface: "#ffffff",
      surfaceMuted: "#f2f7e5",
      border: "#d5dfc5",
      text: "#1f2f33",
      muted: "#4b6670",
      primary: "#5b818e", // azul médio
      primaryStrong: "#234257", // azul marinho escuro
      accent: "#bfd37a", // verde musgo
      accentStrong: "#89b2ae", // azul claro
      highlight: "#e4f1c5",
      gradient: ["#d0e6a6", "#89b2ae", "#bfd37a"],
    },
  },
  {
    id: "areia-ceu",
    name: "Areia & Céu",
    colors: {
      background: "#d7e6ca", // areia clara
      surface: "#ffffff",
      surfaceMuted: "#f3f6ec",
      border: "#cad7e6", // azul do céu suave
      text: "#1f2a33",
      muted: "#546376",
      primary: "#94a3b6", // cinza-azulado
      primaryStrong: "#4f6176",
      accent: "#a3b694", // verde folha
      accentStrong: "#b6a794", // bege amadeirado
      highlight: "#e8f2dc",
      gradient: ["#cad7e6", "#d7e6ca", "#a3b694"],
    },
  },
];

export const defaultThemeId = themes[1].id;

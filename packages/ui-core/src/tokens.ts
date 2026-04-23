export interface UiColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  border: string;
}

export interface UiTheme {
  colors: UiColors;
  radius: {
    none: number;
    sm: number;
    md: number;
    lg: number;
    full: number;
  };
}

export const lightTheme: UiTheme = {
  colors: {
    background: "#ffffff",
    foreground: "#222222",
    card: "#ffffff",
    cardForeground: "#222222",
    primary: "#FF385C",
    primaryForeground: "#ffffff",
    secondary: "#f7f7f7",
    secondaryForeground: "#222222",
    muted: "#f7f7f7",
    mutedForeground: "#717171",
    destructive: "#C13515",
    destructiveForeground: "#ffffff",
    success: "#008A05",
    successForeground: "#ffffff",
    warning: "#E07912",
    warningForeground: "#ffffff",
    border: "#DDDDDD"
  },
  radius: {
    none: 0,
    sm: 8,
    md: 10,
    lg: 12,
    full: 999
  }
};

export const darkTheme: UiTheme = {
  colors: {
    background: "#171717",
    foreground: "#fafafa",
    card: "#171717",
    cardForeground: "#fafafa",
    primary: "#fafafa",
    primaryForeground: "#343434",
    secondary: "#454545",
    secondaryForeground: "#fafafa",
    muted: "#454545",
    mutedForeground: "#b0b0b0",
    destructive: "#9a3322",
    destructiveForeground: "#f6e6e4",
    success: "#39a85f",
    successForeground: "#fafafa",
    warning: "#dba24a",
    warningForeground: "#171717",
    border: "#454545"
  },
  radius: {
    none: 0,
    sm: 8,
    md: 10,
    lg: 12,
    full: 999
  }
};

export interface Country {
  name: Name;
  currencies: Record<string, Currency>;
  languages: Record<string, string>;
  independent: boolean;
  status: string;
  capital: string[];
  region: string;
  subregion: string;
  continents: string[];
}

export interface Name {
  common?: string;
  official: string;
  nativeName: Record<string, NativeName>;
}

export interface NativeName {
  official: string;
  common: string;
}

export interface Currency {
  name: string;
  symbol: string;
}

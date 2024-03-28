import { createContext, PropsWithChildren } from 'react';

const ThemeContext = createContext(null);

interface ThemeProviderProps {}

const ThemeProvider = ({ children }: PropsWithChildren<ThemeProviderProps>) => {
  return <ThemeContext.Provider value={null}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;

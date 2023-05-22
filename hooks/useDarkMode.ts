import { useEffect } from "react";
import { darkTheme, lightTheme, themeMode } from "../utils/types";

const useDarkMode = () => {
  const updateTheme = (newTheme: string, previousTheme?: string) => {
    const {classList} = document.documentElement;
    if(previousTheme) classList.remove(previousTheme);
    classList.add(newTheme);
  }

  const storeThemeToLocalStorage = (theme: string) => {
    localStorage.setItem(themeMode, theme);
  }

  const toggleTheme = () => {
    const {classList} = document.documentElement;
    const isDark = classList.contains(darkTheme);
    if(isDark) {
      updateTheme(lightTheme, darkTheme);
    } else {
      updateTheme(darkTheme, lightTheme);
    }
    storeThemeToLocalStorage((isDark ? lightTheme : darkTheme));
  }

  useEffect(()=> {
    const theme = localStorage.getItem(themeMode);
    if(theme) return updateTheme(theme);

    const runningOnDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    if(runningOnDarkMode) {
      updateTheme(darkTheme, lightTheme);
      storeThemeToLocalStorage(darkTheme);
    }else{
      updateTheme(lightTheme, darkTheme);
      storeThemeToLocalStorage(lightTheme);
    }
  },[])

  return {
    toggleTheme
  }
}


export default useDarkMode;
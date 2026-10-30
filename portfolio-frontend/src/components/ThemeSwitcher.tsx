
import { useEffect, useState } from "react";
import "./ThemeSwitcher.css";

const themes = [
  { name: "Blue", primary: "#2563eb", secondary: "#1d4ed8" },
  { name: "Purple", primary: "#9333ea", secondary: "#7e22ce" },
  { name: "Green", primary: "#16a34a", secondary: "#15803d" },
  { name: "Orange", primary: "#ea580c", secondary: "#c2410c" },
  { name: "Pink", primary: "#db2777", secondary: "#be185d" },
];

type ThemeName = (typeof themes)[number]["name"];

function applyTheme(themeName: ThemeName) {
  const theme = themes.find((item) => item.name === themeName) ?? themes[0];

  document.documentElement.style.setProperty("--primary", theme.primary);
  document.documentElement.style.setProperty("--secondary", theme.secondary);
  document.documentElement.setAttribute(
    "data-theme",
    theme.name.toLowerCase()
  );

  localStorage.setItem("portfolioTheme", theme.name);
}

function ThemeSwitcher() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>(() => {
    const savedTheme = localStorage.getItem("portfolioTheme");

    return themes.some((theme) => theme.name === savedTheme)
      ? (savedTheme as ThemeName)
      : "Blue";
  });

  useEffect(() => {
    applyTheme(selectedTheme);
  }, [selectedTheme]);

  return (
    <div className="theme-switcher">
      <span className="theme-label">Theme:</span>

      {themes.map((theme) => (
        <button
          key={theme.name}
          type="button"
          title={theme.name}
          aria-label={`${theme.name} theme`}
          className={`theme-option ${
            selectedTheme === theme.name ? "active" : ""
          }`}
          style={{ backgroundColor: theme.primary }}
          onClick={() => setSelectedTheme(theme.name)}
        />
      ))}
    </div>
  );
}

export default ThemeSwitcher;

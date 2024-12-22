import React from "react";

const DarkTheme = () => {

    const setDark = () => {

        localStorage.setItem("theme", "dark");
      
        document.body.setAttribute("data-theme", "dark");
      };
      
      const setLight = () => {
        localStorage.setItem("theme", "light");
        document.body.setAttribute("data-theme", "light");
      };
      
      const storedTheme = localStorage.getItem("theme");


      const prefersDark =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const defaultDark =
  storedTheme === "dark" || (storedTheme === null && prefersDark);

if (defaultDark) {
  setDark();
}

const toggleTheme = (e) => {
    if(e.target.checked){
        setDark();
    }else{
        setLight();
    }
}


return (
    <div className="toggle-theme-wrapper">
    <i className='material-icons whitemode'>light_mode</i>
    <label className="toggle-theme" htmlFor="checkbox">
        <input
        type="checkbox"
        id="checkbox"
        onChange={toggleTheme}
        defaultChecked={defaultDark}
        />
        <div className="slider round"></div>
    </label>
    <i className='material-icons'>dark_mode</i>
    </div>
);
};

export default DarkTheme;
export function toggleThemeLight() {
  localStorage.setItem('theme', 'light')
  document.body.setAttribute('data-bs-theme', 'light');
  let lightObj: any = {
    '--background-green': 'rgba(31, 58, 32, 0.3)',
    '--background': '#f6f6f6',
    '--background-light-3': '#E3E6E7',
    '--background-light-4': '#E3E9EF',
    '--background-light': '#c9c9c9',
    '--background-light-2': '#ffe1e1',
    '--text': 'rgb(0, 0, 0)',
    '--text-light': 'rgb(62, 62, 62)',
    '--shadow': 'black',
    '--shadow-light': 'rgb(23, 23, 23)',
    '--green-dark': '#00917b',
    '--blue-dark': '#738096',
    '--blue-light': '#a7ceff',
    '--green': 'rgb(0, 255, 0)',
    '--to': 'rgb(81, 195, 132)',
    '--from': 'rgb(27, 50, 118)',
    '--from-dark': 'rgb(14, 14, 135)',
    '--tansparent-black': 'rgba(0, 0, 0, 0.3)',
    '--grid-color': 'rgb(237, 228, 228)',
    '--massage-border': 'black',
  };
  for (let key in lightObj) {
    document.documentElement.style.setProperty(key, lightObj[key]);
  }

}
export function toggleThemeDark() {
  localStorage.setItem('theme', 'dark');
  document.body.setAttribute('data-bs-theme', 'dark');
  let darkObj: any = {
    '--background-green': 'rgba(31, 58, 32, 0.3)',
    '--background': '#101820',
    '--background-light-3': '#192632',
    '--background-light-4': '#1f2d3a',
    '--background-light': '#333333',
    '--background-light-2': '#444444',
    '--text': 'white',
    '--text-light': 'grey',
    '--shadow': 'black',
    '--shadow-light': 'rgb(23, 23, 23)',
    '--green-dark': '#0c342e',
    '--blue-dark': '#39465B',
    '--blue-light': '#617fa3',
    '--green': 'rgb(0, 255, 0)',
    '--to': 'rgb(25, 89, 54)',
    '--from': 'rgb(27, 50, 118)',
    '--from-dark': 'rgb(14, 14, 135)',
    '--tansparent-black': 'rgba(0, 0, 0, 0.3)',
    '--grid-color': 'rgb(30, 30, 40)',
    '--massage-border': 'grey'
  }
  for (let key in darkObj) {
    document.documentElement.style.setProperty(key, darkObj[key]);
  }
}
import styles from "./Logic.module.css";
import EG from "../../Images/countries/egypt.png";
import kw from "../../Images/countries/kw.png";
import sa from "../../Images/countries/sa.png";
import usa from "../../Images/countries/usa.png";
import uae from "../../Images/countries/uae.png";

export const FontsFamilies = [
    { label: "Playfair Display", value: "Playfair Display" },
    { label: "Cairo", value: "Cairo" },
    { label: "Arial, Helvetica, sans-serif", value: "Arial, Helvetica, sans-serif" },
    { label: "'Times New Roman', Times, serif", value: "'Times New Roman', Times, serif" },
    { label: "Consolas, 'Courier New', monospace", value: "Consolas, 'Courier New', monospace" },
    { label: "'Courier New', Courier, monospace", value: "'Courier New', Courier, monospace" },
    { label: "'Lucida Console', Monaco, monospace", value: "'Lucida Console', Monaco, monospace" },
    { label: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
    { label: "'Cascadia Code', Menlo, monospace", value: "'Cascadia Code', Menlo, monospace" },
    { label: "'Fira Code', Menlo, monospace", value: "'Fira Code', Menlo, monospace" },
    { label: "'Source Code Pro', Menlo, monospace", value: "'Source Code Pro', Menlo, monospace" },
    { label: "'JetBrains Mono', Menlo, monospace", value: "'JetBrains Mono', Menlo, monospace" },
    { label: "'Roboto Mono', Menlo, monospace", value: "'Roboto Mono', Menlo, monospace" },
    { label: "'Monaco', Menlo, monospace", value: "'Monaco', Menlo, monospace" },
    { label: "'Open Sans', sans-serif", value: "'Open Sans', sans-serif" },
    { label: "'Noto Sans', sans-serif", value: "'Noto Sans', sans-serif" },
  ];
  


  export const CountriesPhoneNumbers=[
    {value:"EG",label:<div className="d-flex align-items-center" style={{cursor:"pointer"}}><div className={styles.flag_div}><img src={EG} alt="EG"/></div> <span>+20</span></div>},
    {value:"SA",label:<div className="d-flex align-items-center" style={{cursor:"pointer"}}><div className={styles.flag_div}><img src={sa} alt="SA"/></div> <span>+966</span></div>},
    {value:"UAE",label:<div className="d-flex align-items-center" style={{cursor:"pointer"}}><div className={styles.flag_div}><img src={uae} alt="UAE"/></div> <span>+971</span></div>},
    {value:"KW",label:<div className="d-flex align-items-center" style={{cursor:"pointer"}}><div className={styles.flag_div}><img src={kw} alt="KW"/></div> <span>+965</span></div>},
    {value:"US",label:<div className="d-flex align-items-center" style={{cursor:"pointer"}}><div className={styles.flag_div}><img src={usa} alt="US"/></div> <span>+1</span></div>},
  ]


  export const myColors = [
    "#000000", // Black
    "#FFFFFF", // White
    "#FF5733", // Red/Orange
    "#33FF57", // Green
    "#3357FF", // Blue
    "#FF33A8", // Pink
    "#F39C12", // Yellow/Orange
    "#8E44AD", // Purple
    "#1ABC9C", // Teal
    "#C0392B", // Dark Red
    "#34495E", // Navy Blue
    "#F1C40F", // Bright Yellow
    "#E74C3C", // Bright Red
    "#9B59B6", // Violet
    "#2ECC71", // Emerald Green
    "#3498DB", // Sky Blue
    "#E67E22", // Carrot Orange
    "#16A085", // Dark Teal
    "#BDC3C7", // Light Grey
    "#7F8C8D", // Dark Grey
    "#D35400", // Dark Orange
    "#2C3E50", // Dark Blue/Black
    "#2980B9", // Strong Blue
    "#27AE60", // Medium Green
    "#E74C3C", // Soft Red
    "#9C640C", // Bronze
    "#45B39D", // Mint
    "#D98880", // Soft Pink
    "#A569BD", // Light Purple
    "#D4AC0D", // Gold Yellow
  ];
  
  
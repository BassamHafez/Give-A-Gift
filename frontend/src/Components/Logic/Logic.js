import styles from "./Logic.module.css";
import EG from "../../Images/countries/egypt.png";
import kw from "../../Images/countries/kw.png";
import sa from "../../Images/countries/sa.png";
import usa from "../../Images/countries/usa.png";
import uae from "../../Images/countries/uae.png";

export const FontsFamilies = [
    { label: "'ARAHAMAH1982', sans-serif", value: "'ARAHAMAH1982', sans-serif" },
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

  
  
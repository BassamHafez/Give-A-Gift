import styles from "./Logic.module.css";
import EG from "../../Images/countries/egypt.png";
import kw from "../../Images/countries/kw.png";
import sa from "../../Images/countries/sa.png";
import usa from "../../Images/countries/usa.png";
import uae from "../../Images/countries/uae.png";

export const FontsFamilies = [
    { label: "Cairo", value: '"Cairo", sans-serif' },
    { label: "Roboto", value: '"Roboto", sans-serif' },
    { label: "Arial, Helvetica", value: "Arial, Helvetica" },
    { label: "'Times New Roman', Times, serif", value: "'Times New Roman', Times, serif" },
    { label: "Consolas, 'Courier New'", value: "Consolas, 'Courier New'" },
    { label: "'Courier New', Courier", value: "'Courier New', Courier" },
    { label: "'Lucida Console', Monaco", value: "'Lucida Console', Monaco" },
    { label: "'Segoe UI', Tahoma, Geneva, Verdana", value: "'Segoe UI', Tahoma, Geneva, Verdana" },
    { label: "'Cascadia Code', Menlo", value: "'Cascadia Code', Menlo" },
    { label: "'Fira Code', Menlo", value: "'Fira Code', Menlo" },
    { label: "'Source Code Pro', Menlo", value: "'Source Code Pro', Menlo" },
    { label: "'JetBrains Mono', Menlo", value: "'JetBrains Mono', Menlo" },
    { label: "'Roboto Mono', Menlo", value: "'Roboto Mono', Menlo" },
    { label: "'Monaco', Menlo", value: "'Monaco', Menlo" },
    { label: "Open Sans", value: "Open Sans" },
    { label: "Noto Sans", value: "Noto Sans" },
  ];
  
    // { label: "ARAHAMAH1982", value: "ARAHAMAH1982" },

  export const CountriesPhoneNumbers=[
    {value:"EG",label:<div className="d-flex align-items-center" style={{cursor:"pointer"}}><div className={styles.flag_div}><img src={EG} alt="EG"/></div> <span>+20</span></div>},
    {value:"SA",label:<div className="d-flex align-items-center" style={{cursor:"pointer"}}><div className={styles.flag_div}><img src={sa} alt="SA"/></div> <span>+966</span></div>},
    {value:"UAE",label:<div className="d-flex align-items-center" style={{cursor:"pointer"}}><div className={styles.flag_div}><img src={uae} alt="UAE"/></div> <span>+971</span></div>},
    {value:"KW",label:<div className="d-flex align-items-center" style={{cursor:"pointer"}}><div className={styles.flag_div}><img src={kw} alt="KW"/></div> <span>+965</span></div>},
    {value:"US",label:<div className="d-flex align-items-center" style={{cursor:"pointer"}}><div className={styles.flag_div}><img src={usa} alt="US"/></div> <span>+1</span></div>},
  ]


  export const celebrateIcon=[
    {label:"■ ▲ ● All",value:"all"},
    {label:"🎉 paper",value:"paper"},
    {label:"🎊 ribbon",value:"ribbon"},
    {label:"❤️ heart",value:"heart"},
    {label:"⭐ star",value:"star"},
    {label:"▲ triangle",value:"triangle"},
    {label:"● circle",value:"circle"},
    {label:"■ square",value:"square"},
  ]
  
  export const fontSizes = [
    { label: "40", value: 40 },
    { label: "39", value: 39 },
    { label: "38", value: 38 },
    { label: "37", value: 37 },
    { label: "36", value: 36 },
    { label: "35", value: 35 },
    { label: "34", value: 34 },
    { label: "33", value: 33 },
    { label: "32", value: 32 },
    { label: "31", value: 31 },
    { label: "30", value: 30 },
    { label: "29", value: 29 },
    { label: "28", value: 28 },
    { label: "27", value: 27 },
    { label: "26", value: 26 },
    { label: "25", value: 25 },
  ];
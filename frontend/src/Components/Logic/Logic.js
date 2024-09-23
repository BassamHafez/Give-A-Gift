import styles from "./Logic.module.css";
import EG from "../../Images/countries/egypt.png";
import kw from "../../Images/countries/kw.png";
import sa from "../../Images/countries/sa.png";
import usa from "../../Images/countries/usa.png";
import uae from "../../Images/countries/uae.png";

export const FontsFamilies = [
    { label: "ARAHAMAH1982", value: "ARAHAMAH1982" },
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
  
  
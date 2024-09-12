import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import AccountManageMent from "./AccountManageMent";
import MyCards from "./MyCards";
import { useTranslation } from "react-i18next";
import Help from "./Help";
import MyWallet from "./MyWallet";

const ProfileHorizontal = () => {
  const { t: key } = useTranslation();

  return (
    <>
      <Tabs defaultActiveKey="walletManagement" className="mb-3" fill>
        <Tab eventKey="walletManagement" title={key("walletManagement")}>
          <MyWallet />
        </Tab>
        <Tab eventKey="yourCards" title={key("yourCards")}>
          <MyCards />
        </Tab>

        <Tab
          className="px-md-5 mt-5"
          eventKey="accountSetting"
          title={key("accountSetting")}
        >
          <AccountManageMent />
        </Tab>
        <Tab eventKey="help" title={key("help")}>
          <Help />
        </Tab>
      </Tabs>
    </>
  );
};

export default ProfileHorizontal;

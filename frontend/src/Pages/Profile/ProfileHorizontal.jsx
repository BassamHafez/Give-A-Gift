import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import AccountManageMent from "./AccountManageMent";

const ProfileHorizontal = ({ notifySuccess, notifyError }) => {
  return (
    <>
      <Tabs defaultActiveKey="Account Setting" className="mb-3" fill>
        <Tab
          className="px-5 mt-5"
          eventKey="Account Setting"
          title="Account Setting"
        >
          <AccountManageMent
            notifySuccess={notifySuccess}
            notifyError={notifyError}
          />
        </Tab>
        <Tab eventKey="Wallet Management" title="Wallet Management">
          Tab content for Profile
        </Tab>
        <Tab eventKey="Your Cards" title="Your Cards">
          Tab content for Contact
        </Tab>
      </Tabs>
    </>
  );
};

export default ProfileHorizontal;

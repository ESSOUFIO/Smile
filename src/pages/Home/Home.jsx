import "./Home.css";
import { LeftSide } from "../../sections/index";
import { MainContent } from "../../sections/index";
import { RightSide } from "../../sections/index";
// import { useGlobalState } from "../../context/GlobalProvider";
import withGuard from "../../utils/withGuard";
import AlertAutoDismiss from "../../components/Alerts/AlertAutoDismiss";

const Home = () => {
  // const { user } = useGlobalState();
  // console.log("Home: ", user);

  return (
    <div className="Home row d-flex">
      <LeftSide />
      <MainContent />
      <RightSide />
      <AlertAutoDismiss />
    </div>
  );
};

export default withGuard(Home);

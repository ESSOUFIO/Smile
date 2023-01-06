import "./MainContent.css";

/** Local Components */
import { NavbarMiddle } from "../../components/Navbars";
import { StoriesSection } from "../../components/Stories";
import { NewPost } from "../../components/NewPost/NewPost";
import { FillPosts } from "../../components/Post/FillPosts";

const Container = (props) => {
  return <div className="Container">{props.children}</div>;
};

export const MainContent = () => {
  return (
    <div className="MainContent col-6">
      <NavbarMiddle />
      <Container>
        <StoriesSection />
        <NewPost />
        <FillPosts />
      </Container>
    </div>
  );
};

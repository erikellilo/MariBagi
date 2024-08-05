import Header from "./Header.Jsx";
import MenuBar from "./MenuBar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <MenuBar />
    </>
  );
};

export default AppLayout;

import SidebarTemp from "./SidebarTemp";
import Topbar from "./Topbar";

function Layout({ children }) {
  return (
    <div className="app">
      <Topbar />
      <div className="main">
        <SidebarTemp />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default Layout;

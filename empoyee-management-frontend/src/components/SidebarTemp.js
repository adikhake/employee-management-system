import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {

    const [showMoreMenu, setShowMoreMenu] = useState(false);
  
    const handleMoreClick = () => {
    setShowMoreMenu(!showMoreMenu);
  };

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <NavLink to="/home">Home</NavLink>
          </li>
          <li>
            <NavLink to="/employee/create">Create Employee</NavLink>
          </li>
          <li>
            <NavLink to="/employee/search">Search Employee</NavLink>
          </li>
            
          <li onClick={handleMoreClick} style={{ cursor: "pointer", fontWeight: "bold" }}>
           More {showMoreMenu ? "▲" : "▼"}</li>
          
           {showMoreMenu && (
          <ul style={{ marginLeft: "20px" }}>

            <li><NavLink to="/multiple-tabs" className={({isActive}) => isActive ? "active" : ""}>Multiple Tabs</NavLink></li>
            <li><NavLink to="/menu" className={({isActive}) => isActive ? "active" : ""}>Menu</NavLink></li>
            <li><NavLink to="/autocomplete" className={({isActive}) => isActive ? "active" : ""}>Autocomplete</NavLink></li>
            <li><NavLink to="/images" className={({isActive}) => isActive ? "active" : ""}>Images</NavLink></li>
            <li><NavLink to="/slider" className={({isActive}) => isActive ? "active" : ""}>Slider</NavLink></li>
            <li><NavLink to="/tooltips" className={({isActive}) => isActive ? "active" : ""}>Tooltips</NavLink></li>
          </ul>
        )}
        </ul>
      </nav>
    </aside>
  );
}

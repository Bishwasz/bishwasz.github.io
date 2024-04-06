import React from "react";
import { Link, Route, Routes , Outlet} from "react-router-dom";
import PathFindingDemo from "./PathFindingDemo";

function Demos() {
    return (
        <div className="DemosPage" style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>
           <Link to="/demos/pathFinding" >Path Finding Demo  </Link>

           
        </div>
    );
}
export default Demos;

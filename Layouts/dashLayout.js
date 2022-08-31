// dashboard layout with next js

import { connect } from "react-redux";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Toast from "../components/Toast";

 function DashLayout({children, toast}) {
    return (
      <>
      <div className="flex flex-col md:flex-row  relative">
         <Toast />
          {/* Sidebar */}
          <Sidebar  />
          {/* Content */}
          <div  className="flex-grow flex min-h-screen md:h-screen flex-col overflow-y-scroll ">
             <Navbar />   
                {children}
          </div>
      </div>
      </>
    )
    }

  const mapStateToProps = state => ({
    toast: state.inits.toast
  });


    export default connect(mapStateToProps,null)(DashLayout);


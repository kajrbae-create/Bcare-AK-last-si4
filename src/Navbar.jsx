import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const navigate = useNavigate();
  const handleScroll = () => {
    setIsSticky(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  if (
    window.location.pathname === "/verfiy" ||
    window.location.pathname === "/navaz" ||
    window.location.pathname === "confirm"
  )
    return <div></div>;
  return (
    <div className={`w-full  flex justify-center px-4 py-1 items-center  `}>
      <img
        src="/logo.png"
        alt="logo"
        onClick={() => navigate("/")}
        className=" w-5/6 -mr-6"
      />
    </div>
  );
};

export default Navbar;

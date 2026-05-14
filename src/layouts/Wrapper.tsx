import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
// import AOS from "aos";
// import MotionAnimation from "../hooks/MotionAnimation";

import { useLocation } from "react-router-dom";

interface WrapperProps {
    children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
    const location = useLocation();

    useEffect(() => {
        // AOS.init();
    }, []);

    // MotionAnimation();

    return (
        <>
            {children}
            <ToastContainer 
                position="top-center" 
                style={{ 
                    zIndex: 999999999, // Extremely high z-index to ensure it's above everything
                    marginTop: "80px", // Push below navbar
                    position: "fixed" // Ensure it's positioned correctly
                }}
                toastStyle={{
                    zIndex: 999999999,
                    position: "relative"
                }}
            />
        </>
    );
}

export default Wrapper;

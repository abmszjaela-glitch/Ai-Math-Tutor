import { motion } from "framer-motion";
import { FaMapMarkedAlt, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FloatingTutorButton = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      type="button"
      onClick={() => navigate("/map")}
      aria-label="Open Numora Map"
      title="Explore the Numora Map"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.06, y: -4 }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: "fixed",
        right: "24px",
        bottom: "90px",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        padding: "14px 20px",
        border: "2px solid rgba(255, 255, 255, 0.7)",
        borderRadius: "50px",
        background: "linear-gradient(135deg, #F5A623, #FFC857)",
        color: "#14213D",
        fontSize: "14px",
        fontWeight: 700,
        fontFamily: "inherit",
        boxShadow: "0 8px 24px rgba(20, 33, 61, 0.2)",
        cursor: "pointer",
        whiteSpace: "nowrap",
        outline: "none",
      }}
    >
      <FaMapMarkedAlt size={19} />

      <span>Numora Map</span>

      <FaArrowRight size={13} />
    </motion.button>
  );
};

export default FloatingTutorButton;
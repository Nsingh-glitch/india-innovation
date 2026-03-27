import { motion } from "framer-motion";

function Footer() {
  return (
    <motion.footer
      style={{ background: "#1f2937", color: "white" }}
      className="text-center py-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
    >
      <p className="mb-1">© 2026 LokPulse</p>
      <small>AI-powered governance platform</small>
    </motion.footer>
  );
}

export default Footer;
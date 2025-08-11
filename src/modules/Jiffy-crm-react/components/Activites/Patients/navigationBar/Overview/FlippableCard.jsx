import React from "react";
import { motion } from "framer-motion";
import { Edit, Plus, X } from "lucide-react";

const FlippableCard = ({
  isFlipped,
  setIsFlipped,
  title,
  subtitle,
  icon,
  hasData,
  frontContent,
  backContent,
}) => {
  const handleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div className="relative w-full h-[550px]" style={{ perspective: "1200px" }}>
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Front of the Card (Display View) */}
        <div
          style={{ backfaceVisibility: "hidden" }}
          className="absolute w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                {icon} {title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFlip}
              className="flex items-center text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              {hasData ? (
                <>
                  <Edit size={18} className="mr-2" />
                  Edit
                </>
              ) : (
                <>
                  <Plus size={18} className="mr-2" />
                  Add Info
                </>
              )}
            </motion.button>
          </div>
          <div className="p-6 flex-grow overflow-y-auto">{frontContent}</div>
        </div>

        {/* Back of the Card (Form View) */}
        <div
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className="absolute w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              {icon} {hasData ? "Edit" : "Add"} {title}
            </h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFlip}
              className="text-gray-500 hover:text-gray-800"
            >
              <X size={22} />
            </motion.button>
          </div>
          <div className="flex-grow overflow-y-auto">{backContent}</div>
        </div>
      </motion.div>
    </div>
  );
};

export default FlippableCard;
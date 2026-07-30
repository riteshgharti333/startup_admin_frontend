import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string;
  className?: string;
}

const BackButton = ({ to, className }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-xl hover:bg-white text-gray-600 hover:text-gray-800 transition-all ${className}`}
      title="Go back"
    >
      <FiArrowLeft size={20} />
    </button>
  );
};

export default BackButton;

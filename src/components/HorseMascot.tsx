import horseMascot from '@/assets/horse-mascot.png';

// Cute animated horse mascot for the Year of the Horse 2026
const HorseMascot = ({ small = false }: { small?: boolean }) => {
  const size = small ? 'w-12 h-12' : 'w-20 h-20';

  return (
    <div className={`mascot-bounce inline-block ${size}`}>
      <img
        src={horseMascot}
        alt="Fire Horse 2026 Mascot"
        className="w-full h-full object-contain drop-shadow-md"
      />
    </div>
  );
};

export default HorseMascot;

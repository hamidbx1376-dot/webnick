import React from 'react';

interface HeroLaptopSceneProps {
  onOpenConsultation?: () => void;
}

export const HeroLaptopScene: React.FC<HeroLaptopSceneProps> = ({ onOpenConsultation }) => {
  return (
    <div 
      className="relative w-full max-w-[620px] aspect-[1.12/1] mx-auto select-none cursor-pointer group"
      onClick={onOpenConsultation}
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-blue-100/30 rounded-full blur-3xl -z-10 scale-90" />

      {/* Hero Image Container with Subtle Linear Gradient Mask fading seamlessly at the bottom */}
      <div 
        className="relative w-full h-full overflow-hidden rounded-3xl"
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0.45) 86%, rgba(0, 0, 0, 0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0.45) 86%, rgba(0, 0, 0, 0) 100%)',
        }}
      >
        {/* Clean Hero Image matching UI.png */}
        <img
          src="/files/hero.webp"
          onError={(e) => {
            e.currentTarget.src = 'https://raw.githubusercontent.com/hamidbx1376-dot/webnick/main/files/hero.webp';
          }}
          alt="Webnick - آژانس طراحی سایت"
          className="w-full h-full object-cover rounded-3xl transition-transform duration-500 group-hover:scale-[1.01]"
          loading="eager"
        />

        {/* Soft edge corner scrims */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/30 via-transparent to-white/20" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-white/20 via-transparent to-white/20" />

        {/* Additional seamless bottom linear fade into white background */}
        <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 pointer-events-none bg-gradient-to-t from-white via-white/50 to-transparent" />
      </div>
    </div>
  );
};

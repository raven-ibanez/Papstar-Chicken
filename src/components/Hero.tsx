import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-papstar-yellow py-24 px-4 overflow-hidden border-b-4 border-papstar-black">
      {/* Background patterned dots (simulated with radial-gradient if needed, or just solid for now) */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#111 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>

      <div className="relative max-w-5xl mx-auto text-center z-10">
        <h1 className="text-6xl md:text-8xl font-bangers text-papstar-red drop-shadow-[4px_4px_0_#111111] mb-6 animate-fade-in transform -rotate-2">
          TASTE THE <span className="text-white text-stroke-black drop-shadow-[4px_4px_0_#E62325]">EXPLOSION!</span>
        </h1>
        <p className="text-2xl font-roboto font-bold text-papstar-black mb-10 max-w-2xl mx-auto animate-slide-up bg-white/50 backdrop-blur-sm p-4 rounded-xl border-2 border-papstar-black shadow-[4px_4px_0_#111111]">
          Crispy, Juicy, and Packed with Flavor! The best chicken in town is finally here.
        </p>
        <div className="flex justify-center">
          <a
            href="#menu"
            className="bg-papstar-red text-white text-2xl font-bangers px-10 py-4 rounded-xl hover:bg-white hover:text-papstar-red border-4 border-papstar-black shadow-[6px_6px_0_#111111] hover:shadow-[8px_8px_0_#111111] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 active:translate-x-0 active:translate-y-0 active:shadow-none"
          >
            ORDER NOW!
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
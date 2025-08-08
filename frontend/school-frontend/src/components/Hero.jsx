// src/components/Hero.jsx
function Hero({ title, subtitle, background }) {
  return (
    <section
      className="w-full h-64 md:h-80 flex items-center justify-center bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="bg-black bg-opacity-40 p-6 rounded-lg text-center">
        <h1 className="text-3xl md:text-5xl font-bold">{title}</h1>
        {subtitle && <p className="mt-2 text-lg md:text-xl">{subtitle}</p>}
      </div>
    </section>
  );
}

export default Hero;

import React from 'react';

const About = () => {
  return (
    // Fondo transparente para ver el humo, igual que en Register
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-3xl w-full space-y-8 text-left">
        <header className="text-center">
          <h1 className="mt-6 text-4xl font-extrabold text-white drop-shadow-lg">Nosotros</h1>
          <p className="mt-2 text-lg text-gray-300 drop-shadow-md">
            Cómo un pequeño proyecto cambió nuestra vida para mejor
          </p>
        </header>

        <section className="bg-card-bg/80 backdrop-blur-md shadow-2xl overflow-hidden sm:rounded-2xl p-8 space-y-6 border border-sage-200/20">
          <div className="space-y-4 text-gray-200 leading-relaxed">
            <p>
              Empezar a cultivar marihuana fue, para nosotros, el inicio de un cambio profundo: no
              sólo en la forma en que ocupábamos nuestro tiempo libre, sino en cómo pensamos sobre
              la salud, la comunidad y la responsabilidad. Lo que comenzó como una curiosidad se
              convirtió en un hobby consciente y lleno de aprendizajes personales.
            </p>

            <p>
              A través de este proyecto descubrimos la paciencia, el valor de cuidar algo vivo y
              la satisfacción de ver resultados fruto del trabajo constante. También nos abrió
              puertas a nuevas amistades y a una comunidad que valora la autocuidado responsable y
              el diálogo abierto.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <div className="w-full h-64 bg-dark-bg/50 rounded-xl overflow-hidden flex items-center justify-center shadow-inner border border-sage-200/10 group">
                <img
                  src="/about/interior.jpg"
                  alt="Cultivo Interior"
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="w-full h-64 bg-dark-bg/50 rounded-xl overflow-hidden flex items-center justify-center shadow-inner border border-sage-200/10 group">
                <img
                  src="/about/happyhippi.jpeg"
                  alt="Comunidad"
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>

            <h3 className="mt-8 text-2xl font-bold text-primary">Lo que ganamos</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-primary">✔</span>
                <span><strong>Bienestar emocional:</strong> una actividad que reduce el estrés y nos conecta con la naturaleza.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✔</span>
                <span><strong>Disciplina y paciencia:</strong> aprender a esperar y cuidar procesos a largo plazo.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✔</span>
                <span><strong>Comunidad:</strong> nuevas amistades, intercambio de experiencias y apoyo mutuo.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✔</span>
                <span><strong>Creatividad:</strong> diseñar espacios y experimentar con variedades.</span>
              </li>
            </ul>

            <h3 className="mt-8 text-2xl font-bold text-primary">Un proyecto responsable</h3>
            <p className="italic text-gray-400 border-l-4 border-sage-200/30 pl-4">
              Para nosotros siempre fue importante actuar con responsabilidad: respetar la ley,
              priorizar la seguridad y usar el conocimiento para promover prácticas seguras y
              saludables. Esta página comparte nuestra historia y el impacto personal.
            </p>
          </div>
        </section>

        <section className="bg-card-bg/80 backdrop-blur-md shadow-2xl overflow-hidden sm:rounded-2xl p-8 space-y-4 border border-sage-200/20">
          <h3 className="text-xl font-bold text-white mb-4">Testimonios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <blockquote className="relative p-4 bg-dark-bg/40 rounded-xl border border-sage-200/10">
              <p className="text-gray-300 italic mb-2">"Cultivar nos dio paz y propósito. Aprendimos a mirar el mundo con más calma."</p>
              <cite className="text-primary font-bold">— Ana</cite>
            </blockquote>

            <blockquote className="relative p-4 bg-dark-bg/40 rounded-xl border border-sage-200/10">
              <p className="text-gray-300 italic mb-2">"Más que un hobby: una forma de reunirnos, compartir y crecer juntos."</p>
              <cite className="text-primary font-bold">— Carlos</cite>
            </blockquote>
          </div>
        </section>

        <footer className="text-center text-sm text-gray-500 pb-8">
          <p>MJ Master &copy; 2026 - Cultivo Responsable</p>
        </footer>
      </div>
    </div>
  );
};

export default About;

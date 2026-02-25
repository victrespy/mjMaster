import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8 text-left">
        <header className="text-center">
          <h1 className="mt-6 text-4xl font-extrabold text-white">Nosotros</h1>
          <p className="mt-2 text-lg text-gray-300">
            Cómo un pequeño proyecto cambió nuestra vida para mejor
          </p>
        </header>

        <section className="bg-transparent backdrop-blur-sm shadow-lg overflow-hidden sm:rounded-xl p-6 space-y-6 border border-sage-200/10">
          <div className="space-y-4 text-gray-300">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {/* Imagen placeholder 1 - reemplázala por la tuya */}
              <div className="w-full h-56 bg-card-bg/50 rounded-xl overflow-hidden flex items-center justify-center shadow-md border border-sage-200/10">
                <img
                  src="/about/interior.jpg"
                  alt="Placeholder imagen 1 - reemplazar"
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Imagen placeholder 2 - reemplázala por la tuya */}
              <div className="w-full h-56 bg-card-bg/50 rounded-xl overflow-hidden flex items-center justify-center shadow-md border border-sage-200/10">
                <img
                  src="/about/happyhippi.jpeg"
                  alt="Placeholder imagen 2 - reemplazar"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            <h3 className="mt-4 text-xl font-semibold text-white">Lo que ganamos</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>
                <strong>Bienestar emocional:</strong> una actividad que reduce el estrés y nos
                conecta con la naturaleza.
              </li>
              <li>
                <strong>Disciplina y paciencia:</strong> aprender a esperar y cuidar procesos a
                largo plazo.
              </li>
              <li>
                <strong>Comunidad:</strong> nuevas amistades, intercambio de experiencias y apoyo
                mutuo.
              </li>
              <li>
                <strong>Creatividad:</strong> diseñar espacios, experimentar con variedades y
                presentar productos con cariño.
              </li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-white">Un proyecto responsable</h3>
            <p>
              Para nosotros siempre fue importante actuar con responsabilidad: respetar la ley,
              priorizar la seguridad y usar el conocimiento para promover prácticas seguras y
              saludables. Esta página comparte nuestra historia y el impacto personal; no pretende
              ser una guía técnica.
            </p>
          </div>
        </section>

        <section className="bg-transparent backdrop-blur-sm shadow-lg overflow-hidden sm:rounded-xl p-6 space-y-4 border border-sage-200/10">
          <h3 className="text-lg font-semibold text-white">Testimonios</h3>
          <div className="space-y-4">
            <blockquote className="border-l-4 border-primary pl-4 text-gray-300 italic bg-card-bg/60 p-3 rounded">
              "Cultivar nos dio paz y propósito. Aprendimos a mirar el mundo con más calma y a
              valorar los pequeños logros del día a día." — Ana
            </blockquote>

            <blockquote className="border-l-4 border-primary pl-4 text-gray-300 italic bg-card-bg/60 p-3 rounded">
              "Más que un hobby: una forma de reunirnos, compartir y crecer juntos." — Carlos
            </blockquote>
          </div>
        </section>

        <footer className="text-center text-sm text-gray-400">
          <p>
            Recuerda siempre
            informarte sobre la regulación vigente en tu país.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default About;

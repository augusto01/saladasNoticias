import React from 'react';
import '../../styles/Ubicacion.css';

const Ubicacion = () => {
  // Fotos para el collage/mosaico final
  const photos = [
    { src: '/img/corso5.png', title: 'Carnavales Saladeños', span: 'big' },
    { src: '/img/campprovincial.jpg', title: 'Campeones Provinciales', span: 'medium' },
    { src: '/img/corso1.png', title: 'Pasión de Momo en Vivo', span: 'medium' },
    { src: '/img/plantelatletico.jpeg', title: 'Plantel Atlético Saladas', span: 'medium' },
    { src: '/img/corso3.png', title: 'Fiesta y Color en el Corsódromo', span: 'small' },
    { src: '/img/piscinacomplejo.jpg', title: 'Complejo Turístico Municipal', span: 'big' },
    { src: '/img/corso4.png', title: 'Show de Comparsas', span: 'small' },
    { src: '/img/fiesta-miel.webp', title: 'Fiesta Provincial de la Miel', span: 'medium' },
    { src: '/img/entrada.jpg', title: 'Acceso a Saladas', span: 'small' },
    { src: '/img/garza.jpg', title: 'Monumento a la Garza', span: 'small' },
    { src: '/img/monumento.jpg', title: 'Monumento al Sargento Cabral', span: 'medium' },
    { src: '/img/costa.jpg', title: 'Paseo Costero', span: 'medium' },
    { src: '/img/corso6.png', title: 'Noche Mágica de Corsos', span: 'small' },
  ];

  // Datos de comparsas con sus logos e Instagram
  const carnivalCards = [
    {
      name: 'Comparsa Iberá',
      badge: 'Tradición y Gloria',
      logo: '/img/iberalogo.jpg',
      url: 'https://www.instagram.com/comparsaiberaoficial/',
      desc: 'Iberá es pasional, legendaria y gigante. Reconocida por sus temáticas históricas y despliegues escénicos de máxima categoría, enamora a las tribunas con trajes bordados a mano, plumas majestuosas y una hinchada fervorosa.'
    },
    {
      name: 'Comparsa Coé Berá',
      badge: 'Fuerza y Esplendor',
      logo: '/img/logo_coebera.jpg',
      url: 'https://www.instagram.com/coeberaoficial/',
      desc: 'Fiel a su significado ("Brillo del Alba"), Coé Berá deslumbra año a año con propuestas vanguardistas, imponentes carrozas alegóricas y solistas que derrochan elegancia y simpatía.'
    },
    {
      name: 'Comparsa Xangô',
      badge: 'Mística y Energía',
      logo: '/img/logo_xango.jpeg',
      url: 'https://www.instagram.com/comparsa_xango/',
      desc: 'Pura potencia, mística y color. Xangô transmite una energía arrolladora desde el primer minuto. Sus coreografías milimétricas y vestuarios conceptuales hacen bailar a las gradas completas.'
    },
    {
      name: 'Comparsa Carisma Show',
      badge: 'Alegría y Juventud',
      logo: '/img/logo-carisma.png',
      url: 'https://www.instagram.com/carismashow.oficial/',
      desc: 'El encanto, la frescura y la pasión contagiosa de Saladas. Carisma Show enamora a grandes y chicos con una propuesta colorida, llena de ritmo y entusiasmo familiar.'
    },
    {
      name: 'Agrupación Musical Sambatuque',
      badge: 'Ritmo e Impacto',
      logo: '/img/sambatuque.jpg',
      url: 'https://www.instagram.com/sambatuquesaladas/',
      desc: '¡La máquina del sonido! La batería de Sambatuque marca el compás del corazón saladeño con cortes potentes y ritmos frenéticos que convierten cada noche en una fiesta.'
    }
  ];

  // Datos de clubes deportivos con sus logos e Instagram
  const sportsCards = [
    {
      name: 'Club Atlético Saladas',
      type: 'Básquetbol & Multideporte',
      badge: 'Básquet / Liga Federal',
      logo: '/img/atletico.jpg',
      url: 'https://www.instagram.com/atleticosaladasoficial/',
      desc: 'Institución histórica animadora de torneos provinciales y nacionales. Pasión roja y blanca que llena estadios en cada jornada de básquetbol.'
    },
    {
      name: 'Club Social y Deportivo Antorcha',
      type: 'Básquetbol & Social',
      badge: 'Básquet Tradicional',
      logo: '/img/antorcha.jpg',
      url: 'https://www.instagram.com/club_antorcha_saladas/',
      desc: 'Cuna de grandes glorias del básquet saladeño. Protagonista del clásico más apasionado de la región y pilar social de la comunidad.'
    },
    {
      name: 'Club Social y Deportivo Huracán',
      type: 'Fútbol Local',
      badge: 'Fútbol Primera',
      logo: '/img/huracan.png',
      url: 'https://www.instagram.com/clubhuracansaladas/',
      desc: 'El "Globo" saladeño destaca por la mística y garra de su camiseta en los domingos de fútbol y su fuerte sentido de pertenencia.'
    },
    {
      name: 'Club Social y Deportivo Calle Poí',
      type: 'Fútbol Local',
      badge: 'Pasión Popular',
      logo: '/img/callepoi.png',
      url: 'https://www.instagram.com/clubcallepoi/',
      desc: 'Sentimiento barrial y pasión popular pura. Calle Poí moviliza a su gente en cada cancha con un aliento incondicional.'
    },
    {
      name: 'Academia Saladas',
      type: 'Fútbol Formativo',
      badge: 'Formativa & Cantera',
      logo: '/img/academia_saladas.jpg',
      url: 'https://www.instagram.com/academia.saladas/',
      desc: 'Enfocados en el desarrollo y la excelencia formativa de jóvenes talentos deportivos con valores, disciplina y competencia.'
    },
    {
      name: 'Escuela de Fútbol Don Bosco',
      type: 'Fútbol Infantil',
      badge: 'Contención Social',
      logo: '/img/donbosco_saladas.jpg',
      url: 'https://www.instagram.com/',
      desc: 'Espacio clave de contención comunitaria y aprendizaje deportivo para los más chicos de la ciudad.'
    }
  ];

  return (
    <div className="ubicacion-container">
      {/* BANNER HERO */}
      <section className="ubicacion-hero">
        <span className="hero-tag">Carnaval, Deporte, Historia y Tradición</span>
        <h1 className="hero-title">Visitá Saladas</h1>
        <p className="hero-subtitle">Saladas, Corrientes – Cuna de Héroes y Capital de la Pasión</p>
      </section>

      {/* CONTENIDO PRINCIPAL Y MAPA */}
      <div className="ubicacion-grid">
        <main className="ubicacion-main-column">
          
          {/* INTRODUCCIÓN */}
          <article className="ubicacion-card intro-card">
            <p className="lead-text">
              Bienvenido a Saladas, la ciudad donde el ritmo de los parches, la devoción por la historia y el grito de gol se sienten a flor de piel. Conocida por ser la cuna del heroico <strong>Sargento Juan Bautista Cabral</strong>, Saladas vibra cada verano con la magia de sus <strong>Carnavales</strong>, sus <strong>Grandes Festivales</strong> y la garra inigualable de sus <strong>Clubes Deportivos</strong>.
            </p>
          </article>

          {/* FIESTAS Y EVENTOS DESTACADOS */}
          <section className="ubicacion-card highlight-card">
            <h2 className="section-title main-highlight">Nuestras Fiestas y Tradiciones</h2>
            <p className="section-intro">
              Saladas es sede de celebraciones multitudinarias que convocan a miles de visitantes para rendir tributo al trabajo, la música chamamecera y nuestro orgullo histórico.
            </p>

            <div className="events-sales-grid">
              <div className="event-sale-card miel">
                <div className="event-header">
                  <span className="event-badge gold">Evento Provincial</span>
                  <h3>Fiesta Provincial de la Miel</h3>
                </div>
                <p>
                  El gran homenaje a la producción apícola y al trabajo de nuestra gente. Cada año, el Complejo Turístico Municipal se viste de gala con expo-ferias, gastronomía regional y una grilla con los mejores artistas nacionales.
                </p>
              </div>

              <div className="event-sale-card cabral">
                <div className="event-header">
                  <span className="event-badge red">Orgullo e Historia</span>
                  <h3>Homenaje al Sargento Juan Bautista Cabral</h3>
                </div>
                <p>
                  Saladas rinde tributo a su hijo dilecto y máximo héroe nacional, quien entregó su vida para salvar al General San Martín en San Lorenzo. Se celebra con desfiles cívico-militares y festivales folklóricos.
                </p>
              </div>
            </div>
          </section>

          {/* CARNAVALES */}
          <section className="ubicacion-card highlight-card">
            <h2 className="section-title main-highlight">El Rey Momo Vive en Saladas</h2>
            <p className="section-intro">
              El Carnaval Saladeño es una explosión de alegría, plumas, brillo y pasión popular. Hacé click en la tarjeta de cada comparsa para visitar su Instagram oficial.
            </p>

            <div className="entity-cards-grid">
              {carnivalCards.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="entity-card"
                  title={`Visitar Instagram de ${item.name}`}
                >
                  <div className="entity-header">
                    <div className="entity-logo-wrapper">
                      <img src={item.logo} alt={item.name} loading="lazy" />
                    </div>
                    <div className="entity-title-area">
                      <span className="entity-badge carnival-badge">{item.badge}</span>
                      <h3>{item.name}</h3>
                    </div>
                  </div>
                  <p className="entity-desc">{item.desc}</p>
                  <div className="entity-footer">
                    <span className="ig-link-text">Ver Instagram</span>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* PASIÓN POR EL DEPORTE */}
          <section className="ubicacion-card highlight-card">
            <h2 className="section-title main-highlight">Orgullo Deportivo Saladeño</h2>
            <p className="section-intro">
              Desde estadios colmados en las noches de básquetbol hasta la efervescencia de los domingos de fútbol. Hacé click en cada club para conocer sus novedades en Instagram.
            </p>

            <div className="entity-cards-grid">
              {sportsCards.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="entity-card sports"
                  title={`Visitar Instagram de ${item.name}`}
                >
                  <div className="entity-header">
                    <div className="entity-logo-wrapper">
                      <img src={item.logo} alt={item.name} loading="lazy" />
                    </div>
                    <div className="entity-title-area">
                      <span className="entity-badge sports-badge">{item.badge}</span>
                      <h3>{item.name}</h3>
                    </div>
                  </div>
                  <p className="entity-desc">{item.desc}</p>
                  <div className="entity-footer">
                    <span className="ig-link-text">Ver Instagram</span>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* MOSAICO DE FOTOS */}
          <section className="ubicacion-card">
            <h3 className="section-title">Galería de Atractivos y Pasión Saladeña</h3>
            <p className="section-intro">Un recorrido visual por nuestros estadios, comparsas, patrimonio natural e historia.</p>
            
            <div className="photo-mosaic">
              {photos.map((photo, index) => (
                <div key={index} className={`mosaic-item ${photo.span}`}>
                  <img src={photo.src} alt={photo.title} loading="lazy" />
                  <div className="mosaic-overlay">
                    <span>{photo.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>

        {/* SIDEBAR DERECHO: MAPA */}
        <aside className="ubicacion-sidebar">
          <div className="sidebar-sticky">
            <div className="ubicacion-mapa-card">
              <h3>¡Visitanos!</h3>
              <p className="map-subtext">Vení a vivir la emoción del Carnaval, el Deporte y las Fiestas Patrias en el corazón de Corrientes.</p>
              <div className="iframe-wrapper">
                <iframe
                  title="Mapa de Saladas"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3563.263759015027!2d-58.62126728501704!3d-28.252879509688556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x944d92f2275e1179%3A0xf55f057d3bc3e60d!2sSaladas%2C%20Corrientes!5e0!3m2!1ses!2sar!4v1699647847983!5m2!1ses!2sar"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Ubicacion;
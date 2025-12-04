import { useNavigate } from 'react-router-dom'
import './Home.css'

const Home = () => {
  const navigate = useNavigate()



  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>SONOGROUP S.A.S</h1>
          <p className="hero-subtitle">Soluciones inmobiliarias de excelencia</p>
          <p className="hero-description">Tu socio confiable en inversiones y propiedades</p>
          <button className="cta-button" onClick={() => navigate('/propiedades')}>
            Ver Propiedades
          </button>
        </div>
      </section>

      {/* Quiénes Somos */}
      <section className="about-section">
        <div className="container">
          <h2>¿Quiénes Somos?</h2>
          <p className="about-intro">
            <strong>SONOGROUP S.A.S</strong> es una empresa líder en el sector inmobiliario, 
            comprometida con ofrecer soluciones integrales para la compra, venta y arriendo de propiedades.
          </p>
          <div className="about-grid">
            <div className="about-card">
              <div className="about-icon">🏢</div>
              <h3>Experiencia</h3>
              <p>Años de trayectoria en el mercado inmobiliario, brindando confianza y profesionalismo a nuestros clientes.</p>
            </div>
            <div className="about-card">
              <div className="about-icon">🤝</div>
              <h3>Compromiso</h3>
              <p>Nos dedicamos a entender las necesidades de cada cliente para ofrecer soluciones personalizadas.</p>
            </div>
            <div className="about-card">
              <div className="about-icon">⭐</div>
              <h3>Calidad</h3>
              <p>Seleccionamos cuidadosamente cada propiedad para garantizar la mejor inversión para ti.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="services-section">
        <div className="container">
          <h2>Nuestros Servicios</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-number">01</div>
              <h3>Compra de Propiedades</h3>
              <p>Te ayudamos a encontrar la propiedad perfecta que se ajuste a tus necesidades y presupuesto.</p>
            </div>
            <div className="service-card">
              <div className="service-number">02</div>
              <h3>Venta de Inmuebles</h3>
              <p>Gestionamos la venta de tu propiedad con estrategias efectivas de marketing y negociación.</p>
            </div>
            <div className="service-card">
              <div className="service-number">03</div>
              <h3>Arriendo</h3>
              <p>Ofrecemos opciones de arriendo con contratos seguros y propiedades verificadas.</p>
            </div>
            <div className="service-card">
              <div className="service-number">04</div>
              <h3>Asesoría Inmobiliaria</h3>
              <p>Brindamos consultoría especializada para inversiones y proyectos inmobiliarios.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Por Qué Elegirnos */}
      <section className="why-us-section">
        <div className="container">
          <h2>¿Por Qué Elegir SONOGROUP?</h2>
          <div className="why-us-content">
            <div className="why-us-image">
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600" alt="Oficina SONOGROUP" />
            </div>
            <div className="why-us-list">
              <div className="why-us-item">
                <span className="check-icon">✓</span>
                <div>
                  <h4>Portafolio Diverso</h4>
                  <p>Amplia variedad de propiedades: casas, apartamentos, locales comerciales y más.</p>
                </div>
              </div>
              <div className="why-us-item">
                <span className="check-icon">✓</span>
                <div>
                  <h4>Atención Personalizada</h4>
                  <p>Equipo de profesionales dedicados a brindarte el mejor servicio.</p>
                </div>
              </div>
              <div className="why-us-item">
                <span className="check-icon">✓</span>
                <div>
                  <h4>Transparencia</h4>
                  <p>Información clara y detallada de cada propiedad sin costos ocultos.</p>
                </div>
              </div>
              <div className="why-us-item">
                <span className="check-icon">✓</span>
                <div>
                  <h4>Tecnología</h4>
                  <p>Plataforma digital moderna para facilitar tu búsqueda y gestión.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2>¿Listo para Encontrar tu Propiedad Ideal?</h2>
          <p>Explora nuestro portafolio y descubre las mejores oportunidades del mercado</p>
          <div className="cta-buttons">
            <button className="btn-primary" onClick={() => navigate('/propiedades')}>
              Ver Propiedades
            </button>
            <button className="btn-secondary" onClick={() => navigate('/contacto')}>
              Contáctanos
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

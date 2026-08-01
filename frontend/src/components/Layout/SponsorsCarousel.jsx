import { Carousel, Container, Row, Col } from 'react-bootstrap';
import '../../styles/SponsorsCarousel.css';

const SponsorsCarousel = () => {
  // Lista de marcas / sponsors
  const sponsors = [
    { id: 1, name: 'Sponsor 1', logo: 'https://via.placeholder.com/180x80?text=Sponsor+1' },
    { id: 2, name: 'Sponsor 2', logo: 'https://via.placeholder.com/180x80?text=Sponsor+2' },
    { id: 3, name: 'Sponsor 3', logo: 'https://via.placeholder.com/180x80?text=Sponsor+3' },
    { id: 4, name: 'Sponsor 4', logo: 'https://via.placeholder.com/180x80?text=Sponsor+4' },
    { id: 5, name: 'Sponsor 5', logo: 'https://via.placeholder.com/180x80?text=Sponsor+5' },
    { id: 6, name: 'Sponsor 6', logo: 'https://via.placeholder.com/180x80?text=Sponsor+6' },
  ];

  // Agrupamos los sponsors de a 3 por diapositiva
  const chunkSize = 3;
  const slides = [];
  for (let i = 0; i < sponsors.length; i += chunkSize) {
    slides.push(sponsors.slice(i, i + chunkSize));
  }

  return (
    <section className="sponsors-section py-4">
      <Container>
        <div className="text-center mb-3">
          <h6 className="text-uppercase fw-bold sponsors-title">Nuestros Auspiciantes</h6>
          <div className="title-underline mx-auto"></div>
        </div>

        <Carousel indicators={false} controls={true} interval={4000} className="sponsors-carousel">
          {slides.map((group, idx) => (
            <Carousel.Item key={idx}>
              <Row className="align-items-center justify-content-center g-3">
                {group.map((sponsor) => (
                  <Col key={sponsor.id} xs={6} md={4} className="text-center">
                    <div className="sponsor-card p-2">
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="img-fluid sponsor-logo"
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </section>
  );
};

export default SponsorsCarousel;
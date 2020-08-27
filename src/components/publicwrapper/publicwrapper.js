import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BrandContext } from 'brands/BrandContext';

import './publicwrapper.scss';

const PublicWrapper = ({ children }) => {
  const brand = useContext(BrandContext)

  return (
    <Container id="publicwrapper">
      <Row>
        <Col xs={12}>
          <h1>
            {brand.logo && <img src={brand.logo} alt={`${brand.title} Logo`} />}
            {brand.title}
          </h1>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          {children}
        </Col>
      </Row>
    </Container>
  )

};

export default PublicWrapper;
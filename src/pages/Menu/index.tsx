import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Button } from 'react-bootstrap';
import { Container as Cont } from './styles';

const Menu: React.FC = () => {
  return (
    <Cont>
      <Container>
        <Row className="justify-content-md-center">
          <Link to="/almoxarifado">
            <Button variant="outline-warning" size="lg">
              Almoxarifado
            </Button>
          </Link>
        </Row>
        <Row className="justify-content-md-center">
          <Link to="/montagem">
            <Button variant="outline-warning" size="lg">
              Montagem
            </Button>
          </Link>
        </Row>
        <Row className="justify-content-md-center">
          <Link to="/eletrica">
            <Button variant="outline-warning" size="lg">
              Elétrica
            </Button>
          </Link>
        </Row>
        <Row className="justify-content-md-center">
          <Link to="/usinagem">
            <Button variant="outline-warning" size="lg">
              Usinagem
            </Button>
          </Link>
        </Row>
        <Row className="justify-content-md-center">
          <Link to="/calderaria">
            <Button variant="outline-warning" size="lg">
              Calderaria
            </Button>
          </Link>
        </Row>
        <Row className="justify-content-md-center">
          <Link to="/pintura">
            <Button variant="outline-warning" size="lg">
              Pintura
            </Button>
          </Link>
        </Row>
      </Container>
    </Cont>
  );
};

export default Menu;

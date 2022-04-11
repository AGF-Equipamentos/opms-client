import React from 'react';
import { Container, Table } from 'react-bootstrap';
import {
  FiCheckCircle,
  FiPower,
  FiAlertTriangle,
  FiAlertOctagon,
} from 'react-icons/fi';
import { useFetch } from '../../hooks/useFetch';

export interface Data {
  id: string;
  cooperator: string;
  status: string;
  power: string;
}

const BaiaControl: React.FC = () => {
  const { data } = useFetch<Data[]>(
    `http://192.168.2.141:1880/baias`,
    {},
    1000,
  );

  const renderStatus = (status: string, power: string): React.ReactNode => {
    if (power === 'on') {
      switch (status) {
        case 'green':
          return <FiCheckCircle color="green" size="20" />;
        case 'yellow':
          return <FiAlertTriangle color="yellow" size="20" />;
        case 'red':
          return <FiAlertOctagon color="red" size="20" />;
        default:
          return <FiPower color="green" size="20" />;
      }
    }
    return <FiPower color="gray" size="20" />;
  };

  if (!data) {
    return (
      <Container>
        <h1>Carregando...</h1>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <Table
          responsive
          striped
          bordered
          hover
          variant="dark"
          style={{
            textAlign: 'center',
            marginTop: 12,
          }}
        >
          <thead>
            <tr>
              <th>Baia</th>
              <th>Colaborador</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((baia: Data) => (
              <tr>
                <td>{baia.id}</td>
                <td>{baia.cooperator}</td>
                <td>{renderStatus(baia.status, baia.power)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default BaiaControl;

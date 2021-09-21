import React, { useCallback, useRef, useState } from 'react';

import { FiEdit, FiX, FiCheckSquare, FiDownload } from 'react-icons/fi';
import { Table, Container, Badge, Modal, Button, Form } from 'react-bootstrap';
import { Form as FormUnform } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { format, parseISO } from 'date-fns';
import { Title } from './styles';
import Header from '../../components/Header';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import PrintModal from '../../components/PrintModal';
import { Container as Cont } from '../../components/PrintModal/styles';

export interface Data {
  id: string;
  status: string;
  op_number: string;
  department: string;
  part_number: string;
  description: string;
  created_at: string;
  updated_at: string;
  user: {
    name: string;
  };
}

export interface SaveData {
  status: string;
}

const Almoxarifado: React.FC = () => {
  const { data, mutate } = useFetch<Data[]>('ops', {}, 60000);
  const { user } = useAuth();
  const [showSave, setShowSave] = useState(false);
  const [showExclude, setShowExclude] = useState(false);
  const [showNewOP, setShowNewOP] = useState(false);
  const formSaveRef = useRef<FormHandles>(null);
  const [op, setOp] = useState<Data>({} as Data);
  const [opNumber, setOpNumber] = useState('');
  const [opStatus, setOpStatus] = useState('Entrega pendente');
  const { addToast } = useToast();
  const [showCommitsModal, setShowCommitsModal] = useState(false);
  const [dataCommits, setDataCommits] = useState([]);

  const handleClose = (): void => {
    setShowCommitsModal(false);
  };

  const handleNewOp = useCallback(() => {
    setOpStatus('Entrega pendente');
    setShowNewOP(true);
  }, []);

  const handleExcludeID = useCallback(opSelected => {
    setOp(opSelected);
    setShowExclude(true);
  }, []);

  const handleID = useCallback(opSelected => {
    setOpStatus('Entrega pendente');
    setOp(opSelected);
    setShowSave(true);
  }, []);

  const handleExcludeSubmit = useCallback(async () => {
    try {
      await api.delete(`/ops/${op.id}`);

      const newData = data?.filter(
        (opSelected: Data) => opSelected.id !== op.id,
      );

      mutate(newData, false);

      setShowExclude(false);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formSaveRef.current?.setErrors(errors);
        return;
      }

      addToast({
        type: 'error',
        title: 'Erro ao deletar OP',
        description:
          'Parte do material dessa OP já foi entregue e ela não poderá ser excluida',
      });
    }
  }, [addToast, data, mutate, op.id]);

  const handleSaveSubmit = useCallback(async () => {
    try {
      await api.put(`/ops/${op.id}`, {
        status: opStatus,
      });

      const newData = data?.map((opItem: Data) => {
        if (opItem.id === op.id) {
          return {
            ...opItem,
            status: opStatus,
            updated_at: new Date().toISOString(),
          };
        }
        return opItem;
      });

      mutate(newData, false);

      setShowSave(false);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formSaveRef.current?.setErrors(errors);
        return;
      }

      addToast({
        type: 'error',
        title: 'Erro ao editar OP',
        description: 'Occoreu um erro ao editar a OP, favor tente novamente',
      });
    }
  }, [addToast, data, mutate, op.id, opStatus]);

  const handleNewOPSubmit = useCallback(async () => {
    try {
      const newOP = await api.post(`/ops`, {
        op_number: opNumber,
        status: opStatus,
      });

      const newData = [...data, newOP.data];

      mutate(newData, false);

      setShowNewOP(false);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formSaveRef.current?.setErrors(errors);
        return;
      }

      addToast({
        type: 'error',
        title: 'Erro na criação da OP',
        description:
          'Parece que está OP não existe, já foi fechada, ou já foi criada.',
      });
    }
  }, [addToast, data, mutate, opNumber, opStatus]);

  const handleClickButtonShowCommitsModal = useCallback(async opItem => {
    const response = await api.get(`/commits/${opItem.id}`);
    setDataCommits(response.data);
    setShowCommitsModal(true);
  }, []);

  if (!data) {
    return (
      <Container>
        <h1>Carregando...</h1>
      </Container>
    );
  }

  function renderDepartmentList(department: string): React.ReactNode {
    switch (department) {
      case 'Almoxarifado':
        return (
          <h5>
            <Badge variant="danger">{department}</Badge>
          </h5>
        );
      case 'Montagem':
        return (
          <h5>
            <Badge variant="primary">{department}</Badge>
          </h5>
        );
      case 'Usinagem':
        return (
          <h5>
            <Badge variant="light">{department}</Badge>
          </h5>
        );
      case 'Pintura':
        return (
          <h5>
            <Badge variant="info">{department}</Badge>
          </h5>
        );
      case 'Elétrica':
        return (
          <h5>
            <Badge variant="warning">{department}</Badge>
          </h5>
        );
      case 'Calderaria':
        return (
          <h5>
            <Badge variant="secondary">{department}</Badge>
          </h5>
        );
      default:
        return <td>{department}</td>;
    }
  }

  const renderSwitch = (param: string): React.ReactNode => {
    switch (param) {
      case 'Entregue parcialmente':
        return (
          <h5>
            <Badge variant="warning">Entregue parcialmente</Badge>
          </h5>
        );
      case 'Entregue':
        return (
          <h5>
            <Badge variant="success">Entregue</Badge>
          </h5>
        );
      default:
        return (
          <h5>
            <Badge variant="danger">Entrega pendente</Badge>
          </h5>
        );
    }
  };
  return (
    <>
      <Header />
      <Cont>
        <PrintModal
          isOpen={showCommitsModal}
          handleClose={handleClose}
          commitsData={dataCommits}
          data={data}
        />
      </Cont>
      <Modal
        style={{ color: 'black' }}
        show={showNewOP}
        onHide={() => setShowNewOP(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Nova OP</Modal.Title>
        </Modal.Header>
        <FormUnform onSubmit={handleNewOPSubmit}>
          <Modal.Body>
            <Form>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Número da OP</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o número da OP"
                  onChange={e => setOpNumber(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  onChange={e => setOpStatus(e.target.value)}
                >
                  <option>Entrega pendente</option>
                  <option>Entregue parcialmente</option>
                  <option>Entregue</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowNewOP(false)}>
              Fechar
            </Button>
            <Button variant="warning" type="submit">
              Salvar
            </Button>
          </Modal.Footer>
        </FormUnform>
      </Modal>
      <Modal
        style={{ color: 'black' }}
        show={showSave}
        onHide={() => setShowSave(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar OP</Modal.Title>
        </Modal.Header>
        <FormUnform onSubmit={handleSaveSubmit}>
          <Modal.Body>
            <Form>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  onChange={e => setOpStatus(e.target.value)}
                >
                  <option>Entrega pendente</option>
                  <option>Entregue parcialmente</option>
                  <option>Entregue</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSave(false)}>
              Fechar
            </Button>
            <Button variant="warning" type="submit">
              Salvar
            </Button>
          </Modal.Footer>
        </FormUnform>
      </Modal>
      <Modal
        style={{ color: 'black' }}
        show={showExclude}
        onHide={() => setShowExclude(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Excluir OP</Modal.Title>
        </Modal.Header>
        <FormUnform onSubmit={handleExcludeSubmit}>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowExclude(false)}>
              Cancelar
            </Button>
            <Button variant="danger" type="submit">
              Excluir
            </Button>
          </Modal.Footer>
        </FormUnform>
      </Modal>
      <Container>
        <Button
          variant="outline-warning"
          size="sm"
          block
          onClick={() => handleNewOp()}
        >
          Nova OP
        </Button>
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
              <th>Status</th>
              <th>Número OP</th>
              <th>Produto</th>
              <th>Descrição</th>
              <th>Aberto por:</th>
              <th>Setor:</th>
              <th>Criado:</th>
              <th>Atualizado:</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.filter((opFilter: Data) => opFilter.status !== 'Entregue')
              .length !== 0 ? (
              data
                .filter((opFilter: Data) => opFilter.status !== 'Entregue')
                .map((opItem: Data) => (
                  <tr style={{ justifyItems: 'center' }} key={opItem.id}>
                    <td>{renderSwitch(opItem.status)}</td>
                    <td>{opItem.op_number}</td>
                    <td>{opItem.part_number}</td>
                    <td>{opItem.description}</td>
                    <td>{opItem.user.name}</td>
                    <td>{renderDepartmentList(opItem.department)}</td>
                    <td>
                      {format(
                        parseISO(opItem.created_at),
                        "dd/MM/yyyy 'às' HH:mm'h'",
                      )}
                    </td>
                    <td>
                      {format(
                        parseISO(opItem.updated_at),
                        "dd/MM/yyyy 'às' HH:mm'h'",
                      )}
                    </td>
                    <td>
                      {user.role === 'admin' ? (
                        <Button
                          block={false}
                          variant="link"
                          onClick={() => handleID(opItem)}
                          style={{ color: 'white', padding: 0 }}
                        >
                          <FiEdit />
                        </Button>
                      ) : null}{' '}
                      <Button
                        variant="link"
                        onClick={
                          () => handleClickButtonShowCommitsModal(opItem)
                          // eslint-disable-next-line react/jsx-curly-newline
                        }
                        style={{ color: 'white', padding: 0 }}
                      >
                        <FiCheckSquare />
                      </Button>
                      <Button
                        variant="link"
                        onClick={() => handleExcludeID(opItem)}
                        style={{ color: 'white', padding: 0 }}
                      >
                        <FiDownload />
                      </Button>
                      <Button
                        variant="link"
                        onClick={() => handleExcludeID(opItem)}
                        style={{ color: 'white', padding: 0 }}
                      >
                        <FiX />
                      </Button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={9}>Parece que não há nenhuma OP...</td>
              </tr>
            )}
          </tbody>
        </Table>
        <Title>OPs entregues</Title>
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
              <th>Status</th>
              <th>Número OP</th>
              <th>Produto</th>
              <th>Descrição</th>
              <th>Aberto por:</th>
              <th>Setor:</th>
              <th>Criado:</th>
              <th>Atualizado:</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.filter((opFilter: Data) => opFilter.status === 'Entregue')
              .length !== 0 ? (
              data
                .filter((opFilter: Data) => opFilter.status === 'Entregue')
                .map((opItem: Data) => (
                  <tr style={{ justifyItems: 'center' }} key={opItem.id}>
                    <td>{renderSwitch(opItem.status)}</td>
                    <td>{opItem.op_number}</td>
                    <td>{opItem.part_number}</td>
                    <td>{opItem.description}</td>
                    <td>{opItem.user.name}</td>
                    <td>{opItem.department}</td>
                    <td>
                      {format(
                        parseISO(opItem.created_at),
                        "dd/MM/yyyy 'às' HH:mm'h'",
                      )}
                    </td>
                    <td>
                      {format(
                        parseISO(opItem.updated_at),
                        "dd/MM/yyyy 'às' HH:mm'h'",
                      )}
                    </td>
                    <td>
                      {user.role === 'admin' ? (
                        <Button
                          block={false}
                          variant="link"
                          onClick={() => handleID(opItem)}
                          style={{ color: 'white', padding: 0 }}
                        >
                          <FiEdit />
                        </Button>
                      ) : null}{' '}
                      <Button
                        variant="link"
                        onClick={() => handleExcludeID(opItem)}
                        style={{ color: 'white', padding: 0 }}
                      >
                        <FiX />
                      </Button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={9}>Parece que não há nenhuma OP...</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default Almoxarifado;

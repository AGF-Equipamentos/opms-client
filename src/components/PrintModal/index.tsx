import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Modal, Overlay, Tooltip } from 'react-bootstrap';
import {
  DataGrid,
  GridCellEditCommitParams,
  GridInputSelectionModel,
} from '@material-ui/data-grid';
import { Container as Cont } from './styles';

type Commit = {
  created_at: string;
  description: string;
  id: string;
  location: string;
  op_id: string;
  part_number: string;
  qty: number;
  qty_delivered: number;
  updated_at: string;
  warehouse: string;
};

type CommitsModalProps = {
  isOpen: boolean;
  handleClose(): void;
  commitsData: Commit[];
};

const h1Style = {
  color: 'black',
};

const PrintModal: React.FC<CommitsModalProps> = ({
  isOpen,
  handleClose,
  commitsData,
}) => {
  const [selectionModel, setSelectionModel] = React.useState<
    GridInputSelectionModel
  >([]);
  const [rows, setRows] = useState<Commit[]>([]);
  const [dataSelectionModel, setDataSelectionModel] = useState<Commit[]>([]);

  function handlePreClose(): void {
    setSelectionModel([]);
    handleClose();
  }
  useEffect(() => {
    setRows(commitsData);
  }, [commitsData]);

  const [show, setShow] = useState(false);
  const target = useRef(null);

  const columns = [
    { field: 'part_number', headerName: 'CÓDIGO', width: 140 },
    { field: 'description', headerName: 'DESCRIÇÃO', width: 500 },
    {
      field: 'qty_delivered',
      headerName: 'QUANTIDADE ENTREGUE',
      width: 250,
      type: 'number',
      editable: true,
    },
    { field: 'qty', headerName: 'QUANTIDADE', width: 170 },
    { field: 'location', headerName: 'LOCAÇÃO', width: 190 },
    { field: 'warehouse', headerName: 'ARMAZEM', width: 150 },
  ];

  const handleEditCellChangeCommitted = useCallback(
    (props: GridCellEditCommitParams) => {
      console.log(props);
      if (props.field === 'qty_delivered') {
        const qty_delivered = props.value;
        console.log(qty_delivered);
        console.log(rows);
        const updatedRows = rows.map(row => {
          if (row.id === props.id) {
            return {
              ...row,
              qty_delivered: Number(qty_delivered),
            };
          }
          return row;
        });
        setRows(updatedRows);
        // console.log(updatedRows);
        // const newSelectionData = updatedRows.filter(row =>
        //   selectionModel.includes(row.id),
        // );
        // setDataSelectionModel(newSelectionData);
      }
    },
    [rows],
  );
  return (
    <Cont>
      <Modal size="xl" show={isOpen} onHide={handlePreClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h1 style={h1Style}>Lista de empenhos</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', height: 350 }}>
            <div style={{ flexGrow: 1 }}>
              <DataGrid
                rows={rows}
                columns={columns}
                checkboxSelection
                disableSelectionOnClick
                // isCellEditable={params => params.row.age % 2 === 0}
                onSelectionModelChange={newSelection => {
                  setSelectionModel(newSelection);
                  const newSelectionData = rows.filter(row =>
                    newSelection.includes(row.id),
                  ); 
                  setDataSelectionModel(newSelectionData);
                }}
                selectionModel={selectionModel}
                onCellEditCommit={handleEditCellChangeCommitted}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePreClose}>
            Fechar
          </Button>
          <Button ref={target} variant="warning">
            Salvar
          </Button>
          <Overlay target={target.current} show={show} placement="top">
            {props => (
              <Tooltip id="button-tooltip" {...props}>
                Copiado para a área de transferência!
              </Tooltip>
            )}
          </Overlay>
        </Modal.Footer>
      </Modal>
    </Cont>
  );
};

export default PrintModal;

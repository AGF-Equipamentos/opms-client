/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Modal, Overlay, Tooltip } from 'react-bootstrap';
import {
  DataGrid,
  GridCellEditCommitParams,
  GridRowId,
  GridValueGetterParams,
} from '@material-ui/data-grid';
import api from '../../services/api';
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
  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);
  const [rows, setRows] = useState<Commit[]>([]);
  const [dataSelectionModel, setDataSelectionModel] = useState<Commit[]>([]);
  const [buttonDisable, setButtonDisable] = useState(false);

  function handlePreClose(): void {
    setSelectionModel([]);
    handleClose();
  }

  function getBalance(params: GridValueGetterParams): number {
    const qtyValue = params.getValue(params.id, 'qty') || 0;
    const qtyDeliveredValue = params.getValue(params.id, 'qty_delivered') || 0;

    return Number(qtyValue) - Number(qtyDeliveredValue);
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
      headerName: 'QTD ENTREGUE',
      width: 150,
      type: 'number',
      editable: true,
    },
    { field: 'qty', headerName: 'QTD', width: 150 },
    {
      field: 'fullName',
      headerName: 'Saldo',
      width: 160,
      editable: true,
      valueGetter: getBalance,
      sortComparator: (v1: any, v2: any) =>
        v1?.toString().localeCompare(v2?.toString()),
    },
    { field: 'location', headerName: 'LOCAÇÃO', width: 190 },
    { field: 'warehouse', headerName: 'ARMAZEM', width: 150 },
  ];

  const handleEditCellChangeCommitted = useCallback(
    (props: GridCellEditCommitParams) => {
      if (props.field === 'qty_delivered') {
        const qty_delivered = props.value;
        // if(value > saldo)
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
        const newSelectionData = updatedRows.filter(row =>
          selectionModel.includes(row.id),
        );
        setDataSelectionModel(newSelectionData);
        setButtonDisable(false);
      }
    },
    [rows, selectionModel],
  );

  const handleClickUpdateDeliveryQuantities = async (): Promise<void> => {
    await Promise.all(
      dataSelectionModel.map(async commit => {
        await api.put(`/commits/${commit.id}`, {
          qty_delivered: commit.qty_delivered,
        });
      }),
    );
  };

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
                isCellEditable={params =>
                  // eslint-disable-next-line prettier/prettier
                  selectionModel.includes(params.row.id)}
                onSelectionModelChange={newSelection => {
                  setSelectionModel(newSelection);
                  const newSelectionData = rows.filter(row =>
                    newSelection.includes(row.id),
                  );
                  setDataSelectionModel(newSelectionData);
                }}
                selectionModel={selectionModel}
                onCellEditCommit={handleEditCellChangeCommitted}
                onCellEditStart={() => setButtonDisable(true)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePreClose}>
            Fechar
          </Button>
          <Button
            disabled={buttonDisable}
            ref={target}
            variant="warning"
            onClick={() => {
              handleClickUpdateDeliveryQuantities();
              handlePreClose();
            }}
          >
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

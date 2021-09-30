import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { mutate } from 'swr';
import FileSaver from 'file-saver';
import { makeStyles } from '@material-ui/styles';
import { FormHandles } from '@unform/core';
import {
  DataGrid,
  GridCellEditCommitParams,
  GridCellValue,
  GridEditRowsModel,
  GridRowId,
  GridValueGetterParams,
} from '@material-ui/data-grid';
import * as Yup from 'yup';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import { Container as Cont } from './styles';
import generateTxtData from '../../utils/generateTxtData';
import validadeCreationOfTXtFile from '../../utils/validadeCreationOfTXtFile';
import { Data } from '../Main';

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
  data: Data[];
};

const h1Style = {
  color: 'black',
};

const PrintModal: React.FC<CommitsModalProps> = ({
  isOpen,
  handleClose,
  commitsData,
  data,
}) => {
  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);
  const formSaveRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const [rows, setRows] = useState<Commit[]>([]);
  const [dataSelectionModel, setDataSelectionModel] = useState<Commit[]>([]);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [, setEditRowsModel] = React.useState<GridEditRowsModel>({});
  const useStyles = makeStyles(() => {
    return {
      root: {
        '& .Mui-error': {
          backgroundColor: `rgb(126,10,15,0.1)`,
          color: 'red',
        },
      },
    };
  });
  const classes = useStyles();
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const hours = String(today.getHours());
  const minutes = String(today.getMinutes());

  const completeDate = `Relatório de qtd entregue - ${dd}.${mm} as ${hours}.${minutes}.txt`;

  function handlePreClose(): void {
    setSelectionModel([]);
    setDataSelectionModel([]);
    handleClose();
  }

  const validateBalance = useCallback(
    (id: GridCellValue, qty_delivered: GridCellValue): boolean => {
      const commit = rows.filter(commitItem => commitItem.id === id);
      if (
        Number(qty_delivered) <= commit[0].qty &&
        Number(qty_delivered) >= 0
      ) {
        return true;
      }
      return false;
    },
    [rows],
  );

  const handleEditRowsModelChange = useCallback(
    (newModel: GridEditRowsModel) => {
      const updatedModel = { ...newModel };
      Object.keys(updatedModel).forEach(id => {
        if (updatedModel[id].qty_delivered) {
          const isValid = validateBalance(
            id,
            updatedModel[id].qty_delivered.value,
          );
          updatedModel[id].qty_delivered = {
            ...updatedModel[id].qty_delivered,
            error: !isValid,
          };
        }
      });
      setEditRowsModel(updatedModel);
    },
    [validateBalance],
  );

  function getBalance(params: GridValueGetterParams): number {
    const qtyValue = params.getValue(params.id, 'qty') || 0;
    const qtyDeliveredValue = params.getValue(params.id, 'qty_delivered') || 0;
    const balance: number = Number(qtyValue) - Number(qtyDeliveredValue);

    return Number(balance.toFixed(2));
  }

  useEffect(() => {
    setRows(commitsData);
  }, [commitsData]);

  const columns = [
    { field: 'part_number', headerName: 'CÓDIGO', width: 140 },
    { field: 'description', headerName: 'DESCRIÇÃO', width: 500 },
    { field: 'qty', headerName: 'QTD', width: 150 },
    {
      field: 'qty_delivered',
      headerName: 'QTD ENTREGUE',
      width: 200,
      type: 'number',
      editable: true,
    },
    {
      field: 'balance',
      headerName: 'SALDO',
      width: 160,
      editable: false,
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
  const commitsQtyID = dataSelectionModel.map(commit => ({
    commit_id: commit.id,
    qty_delivered: commit.qty_delivered,
  }));

  const deliveredBalance = rows.reduce(
    (acc, commit) => {
      if (commit.qty === commit.qty_delivered) {
        acc.entregue += 1;
        return acc;
      }

      if (commit.qty_delivered === 0) {
        acc.pedente += 1;
        return acc;
      }

      acc.parcial += 1;
      return acc;
    },
    {
      pedente: 0,
      parcial: 0,
      entregue: 0,
    },
  );

  const handleClickUpdateDeliveryQuantities = async (): Promise<void> => {
    const txtValidation = validadeCreationOfTXtFile(
      commitsData,
      dataSelectionModel,
    ).some((commit: number) => commit <= 0);
    if (txtValidation || dataSelectionModel.length === 0) {
      addToast({
        type: 'error',
        title: 'Erro na atualização do empenho. ',
        description:
          'Ocorreu algo errado. Verifique a quantidade entregue e tente novamente.',
      });
    } else {
      try {
        await api.put(`/commits/`, {
          commitsUpdated: commitsQtyID,
        });

        const newData = data?.map((commitSelected: Data) => {
          if (commitSelected.id === dataSelectionModel[0].op_id) {
            if (
              deliveredBalance.parcial === 0 &&
              deliveredBalance.pedente === 0 &&
              deliveredBalance.entregue === commitsData.length
            ) {
              return {
                ...commitSelected,
                status: 'Entregue',
                updated_at: new Date().toISOString(),
              };
            }
            if (
              deliveredBalance.parcial >= 1 ||
              deliveredBalance.entregue >= 1
            ) {
              return {
                ...commitSelected,
                status: 'Entregue parcialmente',
                updated_at: new Date().toISOString(),
              };
            }
            return {
              ...commitSelected,
              status: 'Entregua pendente',
              updated_at: new Date().toISOString(),
            };
          }
          return commitSelected;
        });
        mutate('ops', newData, false);
        handlePreClose();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formSaveRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na atualização do empenho. ',
          description: 'Ocorreu algo errado. Tente novamente.',
        });
      }
      const textData: string[] = generateTxtData(
        commitsData,
        dataSelectionModel,
      );
      const blobTxt = new Blob([String(textData.join('\n'))], {
        type: 'text/plain;charset=utf-8',
      });
      FileSaver.saveAs(blobTxt, `${completeDate}`);
    }
  };

  return (
    <Cont>
      <Modal size="xl" show={isOpen} onHide={handlePreClose} bsClass="my-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            <h1 style={h1Style}>Tabela de empenhos</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', height: 350 }}>
            <div style={{ flexGrow: 1 }}>
              <DataGrid
                className={classes.root}
                rows={rows}
                columns={columns}
                checkboxSelection
                disableSelectionOnClick
                isCellEditable={
                  params => selectionModel.includes(params.row.id)
                  // eslint-disable-next-line react/jsx-curly-newline
                }
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
                onEditRowsModelChange={handleEditRowsModelChange}
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
            variant="warning"
            onClick={() => {
              handleClickUpdateDeliveryQuantities();
            }}
          >
            Salvar
          </Button>
          ;
        </Modal.Footer>
      </Modal>
    </Cont>
  );
};
export default PrintModal;

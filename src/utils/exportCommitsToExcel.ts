import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

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

const collumNamesArray = [
  'CÓDIGO',
  'DESCRIÇÃO',
  'QTD',
  'QTD ENTREGUE',
  'SALDO',
  'LOCAÇÃO',
  'ARMAZEM',
];

export default function exportToSpreadSheet(
  commitsArray: Commit[],
  fileName: string,
): any {
  const commitsObjectArray = commitsArray.map(commit => {
    return [
      `${commit.part_number}`,
      `${commit.description}`,
      `${commit.qty}`,
      `${commit.qty_delivered}`,
      `${(commit.qty - commit.qty_delivered)
        .toFixed(2)
        .toString()
        .replace('.', ',')}`,
      `${commit.location}`,
      `${commit.warehouse}`,
    ];
  });

  commitsObjectArray.unshift(collumNamesArray);

  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  // Desired file extesion
  const fileExtension = '.xlsx';
  // Create a new Work Sheet using the data stored in an Array of Arrays.
  const workSheet = XLSX.utils.aoa_to_sheet(commitsObjectArray);
  // Generate a Work Book containing the above sheet.
  const workBook = {
    Sheets: { data: workSheet, cols: [] },
    SheetNames: ['data'],
  };
  // Exporting the file with the desired name and extension.
  const excelBuffer = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });
  const fileData = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(fileData, fileName + fileExtension);
}

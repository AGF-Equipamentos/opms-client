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

export default function generateXlsxData(commitsArray: Commit[]): string[][] {
  return commitsArray.map(commit => {
    return [
      `${commit.part_number}`,
      `${commit.description}`,
      `${commit.qty}`,
      `${commit.qty_delivered}`,
      `${(commit.qty - commit.qty_delivered).toFixed(2)}`,
      `${commit.location}`,
      `${commit.warehouse}`,
    ];
  });
}

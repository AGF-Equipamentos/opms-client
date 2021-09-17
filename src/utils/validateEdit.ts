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

export default function validadeEdit(
  oldData: Commit[],
  newData: Commit[],
): any {
  return newData.map(commit => {
    const oldCommit = oldData.find(commitData => commitData.id === commit.id);
    return `${oldCommit}`;
  });
}

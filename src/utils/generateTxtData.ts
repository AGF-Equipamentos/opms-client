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

const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
const yyyy = today.getFullYear();

const completeDate = `${yyyy}${mm}${dd}`;
export default function generateTxtData(
  oldData: Commit[],
  newData: Commit[],
): string[] {
  const headerArray = [`|A||508||${completeDate}|`];
  const commitsArray = newData.map(commit => {
    const oldCommit = oldData.find(commitData => commitData.id === commit.id);
    return [
      '',
      'B',
      `${commit.part_number}`,
      `${(
        commit.qty_delivered - (oldCommit ? oldCommit.qty_delivered : 0)
      ).toFixed(2)}`,
      '01',
      '',
      '',
    ].join('|');
  });

  return [...headerArray, ...commitsArray];
}

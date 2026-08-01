import CRUDToolbar from "../../../../components/Common/CRUD/CRUDToolbar";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
};

export default function TransferToolbar({
  search,
  onSearchChange,
  onAdd,
}: Props) {
  return (
    <CRUDToolbar
      search={search}
      onSearchChange={onSearchChange}
      onAdd={onAdd}
      addLabel="New Transfer"
      placeholder="Search Transfer..."
    />
  );
}
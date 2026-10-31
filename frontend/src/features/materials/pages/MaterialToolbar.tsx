import AddRoundedIcon from "@mui/icons-material/AddRounded";

import PCSButton from "../../../components/UI/PCSButton";
import PCSToolbar from "../../../components/Common/PCSToolbar/PCSToolbar";

type Props = {
  onAdd: () => void;
};

export default function MaterialToolbar({
  onAdd,
}: Props) {
  return (
    <PCSToolbar
      title="Materials"
      actions={
        <PCSButton
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={onAdd}
        >
          New Material
        </PCSButton>
      }
    />
  );
}
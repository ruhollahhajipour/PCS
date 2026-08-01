import { Box } from "@mui/material";
import SearchBox from "../../../../components/Common/SearchBox/SearchBox";
import PCSButton from "../../../../components/UI/PCSButton";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  onNew: () => void;
};

export default function ReceiveToolbar({
  search,
  setSearch,
  onNew,
}: Props) {

  return (

    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >

      <SearchBox
        value={search}
        onChange={setSearch}
      />

      <PCSButton onClick={onNew}>
        New Receive
      </PCSButton>

    </Box>

  );

}
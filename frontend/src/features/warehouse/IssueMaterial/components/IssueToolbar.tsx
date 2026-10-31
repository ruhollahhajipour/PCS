import {
  Button,
  Stack,
} from "@mui/material";

type Props = {
  onNew: () => void;
};

export default function IssueToolbar({
  onNew,
}: Props) {

  return (

    <Stack
      direction="row"
      justifyContent="flex-end"
      sx={{
        mt: 2,
        mb: 2,
      }}
    >

      <Button
        variant="contained"
        onClick={onNew}
      >
        New Issue
      </Button>

    </Stack>

  );

}
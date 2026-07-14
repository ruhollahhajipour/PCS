import { Card, type CardProps } from "@mui/material";

export default function PCSCard(props: CardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        boxShadow: "0 12px 30px rgba(15,23,42,.08)",

        transition: ".25s",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 20px 40px rgba(37,99,235,.18)",
        },

        ...props.sx,
      }}
      {...props}
    />
  );
}
import { Avatar } from "@mui/material";

interface CompanyAvatarProps {
  name: string;
  logo?: string;
}

export default function CompanyAvatar({
  name,
  logo,
}: CompanyAvatarProps) {
  const initials = name
    .split(" ")
    .map((x) => x[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  if (logo) {
    return (
      <Avatar
        src={logo}
        sx={{
          width: 64,
          height: 64,
        }}
      />
    );
  }

  return (
    <Avatar
      sx={{
        width: 64,
        height: 64,
        bgcolor: "#2563EB",
        fontWeight: 700,
        fontSize: 22,
      }}
    >
      {initials}
    </Avatar>
  );
}
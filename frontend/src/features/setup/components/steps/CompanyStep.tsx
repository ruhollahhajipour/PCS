import {
  Box,
  Button,
  Avatar,
  TextField,
  Typography,
} from "@mui/material";

import { useState } from "react";

import CompanySetupService from "../../services/company.setup.service";

interface CompanyStepProps {
  onComplete?: (companyId: string) => void;
}

export default function CompanyStep({
  onComplete,
}: CompanyStepProps) {
  const [saving, setSaving] = useState(false);

  const [logoPreview, setLogoPreview] =
    useState<string | null>(null);

  const [company, setCompany] = useState({
    code: "",
    name: "",
    nationalId: "",
    address: "",
    phone: "",
    email: "",
    logo: "",
  });

  function updateField(
    field: keyof typeof company,
    value: string
  ) {
    setCompany((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleLogoChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setLogoPreview(URL.createObjectURL(file));

    setCompany((prev) => ({
      ...prev,
      logo: file.name,
    }));
  }

  async function handleSubmit() {
    console.log("========== CLICK ==========");
    console.log(company);

    try {
      setSaving(true);

      const payload = {
        code: company.code,
        name: company.name,
        nationalId: company.nationalId,
        address: company.address,
        phone: company.phone,
        email: company.email,
      };

      console.log("Sending Payload:");
      console.log(payload);

      const result =
        await CompanySetupService.create(payload);

      console.log("API Result:");
      console.log(result);

      if (onComplete) {
        console.log("Calling onComplete");
        onComplete(result);
      }
    } catch (err) {
      console.error("ERROR");
      console.error(err);
      alert("Save Failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box>
      <Typography
        variant="h6"
        fontWeight={700}
        mb={3}
      >
        Company Information
      </Typography>

      <Box
        display="flex"
        alignItems="center"
        gap={3}
        mb={4}
      >
        <Avatar
          src={logoPreview ?? undefined}
          sx={{
            width: 90,
            height: 90,
          }}
        />

        <Button
          variant="outlined"
          component="label"
        >
          Upload Logo

          <input
            hidden
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
          />
        </Button>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          md: "1fr 1fr",
        }}
        gap={2}
      >
        <TextField
          label="Company Code"
          value={company.code}
          onChange={(e) =>
            updateField("code", e.target.value)
          }
        />

        <TextField
          label="Company Name"
          value={company.name}
          onChange={(e) =>
            updateField("name", e.target.value)
          }
        />

        <TextField
          label="National ID"
          value={company.nationalId}
          onChange={(e) =>
            updateField(
              "nationalId",
              e.target.value
            )
          }
        />

        <TextField
          label="Phone"
          value={company.phone}
          onChange={(e) =>
            updateField("phone", e.target.value)
          }
        />

        <TextField
          label="Email"
          value={company.email}
          onChange={(e) =>
            updateField("email", e.target.value)
          }
        />

        <TextField
          label="Address"
          value={company.address}
          onChange={(e) =>
            updateField(
              "address",
              e.target.value
            )
          }
        />
      </Box>

      <Box
        mt={4}
        display="flex"
        justifyContent="flex-end"
      >
        <Button
          variant="contained"
          size="large"
          disabled={saving}
          onClick={handleSubmit}
        >
          {saving
            ? "Saving..."
            : "Save & Continue"}
        </Button>
      </Box>
    </Box>
  );
}
import {
  useEffect,
  useState,
} from "react";

import { Grid } from "@mui/material";

import PCSDialog from "../../../components/Common/Form/PCSDialog";
import PCSFormActions from "../../../components/Common/Form/PCSFormActions";
import PCSTextField from "../../../components/Common/Form/PCSTextField";
import PCSSelect from "../../../components/Common/Form/PCSSelect";

import type { Plant } from "../types/plant";


const EMPTY_GUID =
  "00000000-0000-0000-0000-000000000000";


const initialForm: Plant = {
  id: EMPTY_GUID,

  code: "",

  name: "",

  shortName: "",

  description: "",

  companyId: EMPTY_GUID,

  address: "",

  phone: "",

  email: "",

  isActive: true,

  createdAt: "",

  updatedAt: "",
};


type Props = {
  open: boolean;

  plant: Plant | null;

  onClose: () => void;

  onSave: (
    plant: Plant
  ) => Promise<void>;
};


export default function PlantDialog({
  open,

  plant,

  onClose,

  onSave,
}: Props) {
  const [loading, setLoading] =
    useState(false);


  const [form, setForm] =
    useState<Plant>(initialForm);


  useEffect(() => {
    if (!open)
      return;


    if (plant) {
      setForm({
        ...plant,

        shortName:
          plant.shortName ?? "",

        description:
          plant.description ?? "",

        address:
          plant.address ?? "",

        phone:
          plant.phone ?? "",

        email:
          plant.email ?? "",
      });
    }
    else {
      setForm(initialForm);
    }
  }, [plant, open]);


  function change(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const {
      name,
      value,
    } = e.target;


    setForm((current) => ({
      ...current,

      [name]: value,
    }));
  }


  async function submit(
    e: React.FormEvent
  ) {
    e.preventDefault();


    setLoading(true);


    try {
      await onSave({
        ...form,

        shortName:
          form.shortName || null,

        description:
          form.description || null,

        address:
          form.address || null,

        phone:
          form.phone || null,

        email:
          form.email || null,

        isActive:
          form.isActive,
      });


      onClose();
    }
    finally {
      setLoading(false);
    }
  }


  return (
    <PCSDialog
      open={open}
      width="md"
      title={
        plant
          ? "Edit Plant"
          : "New Plant"
      }
      onClose={onClose}
    >
      <form onSubmit={submit}>

        <Grid
          container
          spacing={2}
        >

          {/* Code */}
          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <PCSTextField
              label="Code"
              name="code"
              value={form.code}
              onChange={change}
              required
            />
          </Grid>


          {/* Name */}
          <Grid
            size={{
              xs: 12,
              md: 8,
            }}
          >
            <PCSTextField
              label="Plant Name"
              name="name"
              value={form.name}
              onChange={change}
              required
            />
          </Grid>


          {/* Short Name */}
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <PCSTextField
              label="Short Name"
              name="shortName"
              value={
                form.shortName ?? ""
              }
              onChange={change}
            />
          </Grid>


          {/* Company ID */}
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <PCSTextField
              label="Company ID"
              name="companyId"
              value={
                form.companyId
              }
              onChange={change}
              required
            />
          </Grid>


          {/* Address */}
          <Grid size={12}>
            <PCSTextField
              label="Address"
              name="address"
              value={
                form.address ?? ""
              }
              onChange={change}
            />
          </Grid>


          {/* Phone */}
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <PCSTextField
              label="Phone"
              name="phone"
              value={
                form.phone ?? ""
              }
              onChange={change}
            />
          </Grid>


          {/* Email */}
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <PCSTextField
              label="Email"
              name="email"
              value={
                form.email ?? ""
              }
              onChange={change}
            />
          </Grid>


          {/* Description */}
          <Grid size={12}>
            <PCSTextField
              label="Description"
              name="description"
              value={
                form.description ?? ""
              }
              onChange={change}
            />
          </Grid>


          {/* Status */}
          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <PCSSelect
              label="Status"
              name="isActive"
              value={
                form.isActive
                  ? "true"
                  : "false"
              }
              onChange={(e) =>
                setForm((current) => ({
                  ...current,

                  isActive:
                    e.target.value ===
                    "true",
                }))
              }
              options={[
                {
                  value: "true",
                  label: "Active",
                },
                {
                  value: "false",
                  label: "Inactive",
                },
              ]}
            />
          </Grid>

        </Grid>


        <PCSFormActions
          loading={loading}
          onCancel={onClose}
        />

      </form>
    </PCSDialog>
  );
}
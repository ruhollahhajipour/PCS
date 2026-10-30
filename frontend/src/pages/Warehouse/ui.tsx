import {
  Alert,
  Autocomplete,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Snackbar,
  TextField,
} from "@mui/material";
import { useState } from "react";

import { DOC_STATUS_COLOR, DOC_STATUS_LABEL } from "../../constants/warehouse";
import { normalizeJalali } from "../../utils/jalali";
import type { DocStatus, Item } from "../../types/warehouse";
import type { ToastState } from "./hooks";
import { POPUP_CLASS } from "./styles";

import "./warehouse.css";

// ---------- Select ----------------------------------------------------------

export interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectFieldProps {
  label: string;
  value: string | number | "";
  onChange: (value: string) => void;
  options: Option[];
  emptyLabel?: string; // when set, adds an empty choice with this label
  disabled?: boolean;
  required?: boolean;
  size?: "small" | "medium";
  minWidth?: number;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  emptyLabel,
  disabled,
  required,
  size = "medium",
  minWidth,
}: SelectFieldProps) {
  return (
    <TextField
      select
      fullWidth
      size={size}
      label={label}
      required={required}
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={minWidth ? { minWidth } : undefined}
      slotProps={{
        select: { MenuProps: { className: POPUP_CLASS } },
        inputLabel: { shrink: emptyLabel !== undefined || value !== "" ? true : undefined },
      }}
    >
      {emptyLabel !== undefined && (
        <MenuItem value="">
          <em>{emptyLabel}</em>
        </MenuItem>
      )}
      {options.map((o) => (
        <MenuItem key={o.value} value={o.value} disabled={o.disabled}>
          {o.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

// ---------- Item picker -----------------------------------------------------

interface ItemPickerProps {
  items: Item[];
  value: number | null;
  onChange: (id: number | null) => void;
  disabled?: boolean;
  label?: string;
  size?: "small" | "medium";
}

export function ItemPicker({
  items,
  value,
  onChange,
  disabled,
  label,
  size = "small",
}: ItemPickerProps) {
  const selected = items.find((i) => i.id === value) ?? null;
  return (
    <Autocomplete
      size={size}
      options={items}
      value={selected}
      disabled={disabled}
      onChange={(_, v) => onChange(v ? v.id : null)}
      getOptionLabel={(i) => `${i.code} – ${i.name}`}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      noOptionsText="کالایی پیدا نشد"
      slotProps={{ popper: { className: POPUP_CLASS } }}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder="کد یا نام کالا…" />
      )}
      sx={{ minWidth: 260 }}
    />
  );
}

// ---------- Jalali date field -----------------------------------------------

interface JalaliFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  size?: "small" | "medium";
  required?: boolean;
  fullWidth?: boolean;
}

export function JalaliField({
  label = "تاریخ",
  value,
  onChange,
  disabled,
  size = "medium",
  required,
  fullWidth = true,
}: JalaliFieldProps) {
  const invalid = value.trim() !== "" && normalizeJalali(value) === null;
  return (
    <TextField
      fullWidth={fullWidth}
      size={size}
      label={label}
      required={required}
      disabled={disabled}
      value={value}
      error={invalid}
      helperText={invalid ? "تاریخ معتبر نیست (۱۴۰۵/۰۸/۰۸)" : undefined}
      placeholder="1405/08/08"
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => {
        const n = normalizeJalali(value);
        if (n) onChange(n);
      }}
      className="pcs-ltr-num"
    />
  );
}

// ---------- Status chip -----------------------------------------------------

export function StatusChip({ status }: { status: DocStatus }) {
  return (
    <Chip
      size="small"
      label={DOC_STATUS_LABEL[status]}
      color={DOC_STATUS_COLOR[status]}
      variant={status === "Final" ? "filled" : "outlined"}
    />
  );
}

// ---------- Confirm dialog ---------------------------------------------------

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  danger,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} dir="rtl" className={POPUP_CLASS}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, justifyContent: "flex-start" }}>
        <Button
          variant="contained"
          color={danger ? "error" : "primary"}
          disableElevation
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
        <Button onClick={onClose}>انصراف</Button>
      </DialogActions>
    </Dialog>
  );
}

/** Keeps the "pending confirmation" state of a row action in one place. */
export function useConfirm<T>() {
  const [pending, setPending] = useState<T | null>(null);
  return { pending, ask: setPending, clear: () => setPending(null) };
}

// ---------- Toast ------------------------------------------------------------

export function Toast({
  toast,
  onClose,
}: {
  toast: ToastState;
  onClose: () => void;
}) {
  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={onClose}
        severity={toast.severity}
        variant="filled"
        sx={{ width: "100%" }}
        className={POPUP_CLASS}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  );
}

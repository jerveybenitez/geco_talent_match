export interface ConfigRow {
  id: string;
  active: boolean;
  [key: string]: unknown;
}

export interface ConfigColumn {
  key: string;
  label: string;
  render?: (row: ConfigRow) => React.ReactNode;
}

export interface ConfigField {
  key: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "textarea";
}

export interface ComboBoxOption {
    id: string;
    label: string;
  }

  export interface ComboBoxProps {
    options: ComboBoxOption[];
    placeholder?: string;
    onChange?: (selectedOptions: ComboBoxOption[]) => void;
    defaultValue?: ComboBoxOption[];
    multiSelect?: boolean;
  }
type Gift = {
  name: string;
  isEditing: boolean;
  editingText: string;
};

type DeleteModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

type User = {
  name: string;
  email: string;
  isEditing: boolean;
  editingText: string;
  editingEmail: string;
};

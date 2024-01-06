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

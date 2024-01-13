type DeleteModalProps = {
  text: string;
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

// USER CONTEXT
type UserData = {
  id: number;
  userName: string;
  email: string;
  SantaOf: string;
  SantaOfGiftsLists: SantaOfGift[];
  SantaOfId: number;
  gifts: UserGift[];
  userGiftListId: number;
  roles: string[];
};

type UserState = {
  data: UserData | null;
  loading: boolean;
  error: Error | null;
};

type UserContextType = {
  userState: UserState;
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
};

type SantaOfGift = {
  id: number;
  name: string;
};

type UserGift = {
  id: number;
  name: string;
  isEditing?: boolean;
  editingText?: string;
};

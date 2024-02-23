type DeleteDialogProps = {
  text: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

interface PasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (newPassword: string) => void;
}
type User = {
  username: string;
  email: string;
  isEditing: boolean;
  editingText: string;
  editingEmail: string;
};

type GiftList = {
  id: number;
  gifts: Gift[];
};

type Events = {
  id: number;
  name: string;
  giftList: GiftList;
  santaOf: string | null;
  santaOfGiftList: GiftList | null;
  santaOfId: number | null;
};

type UserData = {
  id: number;
  userName: string;
  email: string;
  events: Events[];
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
  currentEventId: number | null;
  changeCurrentEvent: (eventId: number) => void;
};

type Gift = {
  id: number;
  name: string;
};

type UserGift = {
  id: number;
  name: string;
  isEditing?: boolean;
  editingText?: string;
};

interface NewUser {
  username: string;
  email: string;
  password: string;
}

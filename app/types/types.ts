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
type UserInAdmin = User & {
  isEditing: boolean;
  editingText: string;
  editingEmail: string;
};

type GiftList = {
  id: number;
  gifts: Gift[];
};

type EventInUser = {
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
  events: EventInUser[];
  roles: string[];
  isOrganizerOfEvent: boolean;
  organizedEventIds: number[];
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
  currentEvent: EventInUser | null;
  changeCurrentEvent: (eventId: number) => void;
  isAdministrator: boolean;
  canOnlyManageEvent: boolean;
  flushAllData: () => void;
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

type SantaEvent = {
  id: number;
  name: string;
  users: User[];
  organizer: User;
  giftList: any[];
  santas: any[];
};

type User = {
  id: number;
  username: string;
  email: string;
  roles?: string[];
};

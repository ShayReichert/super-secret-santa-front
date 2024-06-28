import { useState, useEffect } from "react";
import { useAuth } from "@/app/hook/useAuth/useAuth";
import styles from "./LoginForm.module.scss";
import CreateUserDialog from "@/app/admin/components/CreateUserDialog/CreateUserDialog";
import { useUserList } from "@/app/hook/useUserList/useUserList";

interface Props {
  onForgotPassword: () => void;
}

export default function LoginForm({ onForgotPassword }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [disabledButton, setDisabledButton] = useState(true);
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const { login, authState } = useAuth();
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const { createUser } = useUserList();

  useEffect(() => {
    setDisabledButton(!(inputs.email && inputs.password));
  }, [inputs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const honeypot = (e.target as HTMLFormElement).querySelector('[name="bot-field"]') as HTMLInputElement;
    if (honeypot && honeypot.value) return;

    setIsLoading(true);
    await login(inputs.email, inputs.password);
    setIsLoading(false);
  };

  const handleOpenCreateUserDialog = () => {
    setIsCreateUserDialogOpen(true);
  };

  const handleCreateUser = async (newUserData: NewUser) => {
    const result = await createUser(newUserData);
  };

  return (
    <form className={styles["form"]} onSubmit={handleSubmit}>
      <p className={styles["hidden"]}>
        <label>
          <input name="bot-field" autoComplete="new-password" tabIndex={-1} />
        </label>
      </p>
      <div className={styles["form-group"]}>
        <input type="text" className="" placeholder="Ton email" name="email" value={inputs.email} onChange={handleChange} autoComplete="email" />
        <input type="password" className="" placeholder="Ton mot de passe" name="password" value={inputs.password} onChange={handleChange} />
        {authState.errorMessage && <p className={styles["error-message"]}>{authState.errorMessage}</p>}
        <p className={styles["forgot-password"]}>
          <a href="#" onClick={onForgotPassword}>
            Mot de passe oublié ?
          </a>
        </p>
        <button className={styles["button"]} disabled={disabledButton || isLoading} type="submit">
          {isLoading ? "Connexion..." : "Connexion"}
        </button>

        <p className={styles["create-account"]}>
          Tu n’as pas de compte ?{" "}
          <a href="#" onClick={handleOpenCreateUserDialog}>
            Créer un compte
          </a>
        </p>
        <CreateUserDialog open={isCreateUserDialogOpen} onClose={() => setIsCreateUserDialogOpen(false)} onConfirm={handleCreateUser} />
      </div>
    </form>
  );
}

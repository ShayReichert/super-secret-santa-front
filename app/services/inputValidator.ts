export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isPasswordComplex = (password: string): boolean => {
  // 8 caracters minimum, contains numbers and letters
  const minLength = 8;
  const hasNumbers = /\d/.test(password);
  const hasLetters = /[a-zA-Z]/.test(password);

  return password.length >= minLength && hasNumbers && hasLetters;
};

export function validateEmail(email: string): string {
    if (!email) {
      return 'Proszę podać adres email';
    }
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    if (!emailRegex.test(email)) {
      return 'Niepoprawny format adresu email';
    }
  
    return '';
  }

  export function validatePasswardStrength(password: string): string {
    if (!password) {
      return 'Proszę podać hasło';
    }
  
    if (password.length < 8) {
      return 'Hasło musi zawierać co najmniej 8 znaków';
    }
  
    // Sprawdzenie białych znaków
    if (/\s/.test(password)) {
      return 'Hasło nie może zawierać białych znaków';
    }
  
    if (!/[a-z]/.test(password)) {
      return 'Hasło musi zawierać co najmniej jedną małą literę';
    }
  
    if (!/[A-Z]/.test(password)) {
      return 'Hasło musi zawierać co najmniej jedną dużą literę';
    }
  
    if (!/[0-9]/.test(password)) {
      return 'Hasło musi zawierać co najmniej jedną cyfrę';
    }
  
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Hasło musi zawierać co najmniej jeden znak specjalny';
    }
  
    return '';
  }

export function validateCode(password: string): string {
    if (!password) {
      return 'Proszę podać kod';
    }
  
    if (password.length != 8) {
      return 'Kodo musi zawierać dokładnie 8 znaków';
    }
  
    return '';
  }
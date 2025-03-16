
// Password validation utility
export const usePasswordValidator = () => {
  // Function to validate the password according to requirements
  const validatePassword = (password: string) => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push("A senha deve ter pelo menos 8 caracteres");
    }
    
    const letterCount = (password.match(/[a-zA-Z]/g) || []).length;
    if (letterCount < 2) {
      errors.push("A senha deve ter pelo menos duas letras");
    }
    
    if (!password.match(/[A-Z]/)) {
      errors.push("A senha deve ter pelo menos uma letra maiúscula");
    }
    
    if (!password.match(/[a-z]/)) {
      errors.push("A senha deve ter pelo menos uma letra minúscula");
    }
    
    const numberCount = (password.match(/[0-9]/g) || []).length;
    if (numberCount < 2) {
      errors.push("A senha deve ter pelo menos dois números");
    }
    
    if (!password.match(/[!€@.*]/)) {
      errors.push("A senha deve ter pelo menos um caractere especial (!,€,@,.,*)");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  return { validatePassword };
};

export default usePasswordValidator;

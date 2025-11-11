export async function login(email: string, senha: string) {
  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        senha
      })
    });

    if (!response.ok) {
      throw new Error("Credenciais inválidas");
    }

    const data = await response.json();

    localStorage.setItem("token", data.token);

    return data;

  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  } 
}

export async function register(nome: string, email: string, senha: string) {
  try {
    const response = await fetch("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, email, senha }),
    });

    if (!response.ok) {
      throw new Error("Erro ao registrar usuário");
    }

    const data = await response.json();

    return data;
  
  } catch (error) {
    console.error("Erro no registro:", error);
    throw error;
  }
}


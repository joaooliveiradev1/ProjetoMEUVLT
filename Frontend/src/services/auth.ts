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

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // === ROTA PASSAGEIRO (Criptografada como v1) ===
      {
        source: '/secure/v1/dashboard',
        destination: '/passageiro/linhas',
      },
      {
        source: '/secure/v1/account',
        destination: '/passageiro/perfil',
      },

      // === ROTA CONDUTOR (Criptografada como v2) ===
      {
        source: '/secure/v2/console',
        destination: '/condutor/operacao',
      },
      {
        source: '/secure/v2/account',
        destination: '/condutor/perfil',
      },

      // === ROTA ADMINISTRADOR (Criptografada como v3) ===
      {
        source: '/secure/v3/master',
        destination: '/adm/gerenciamento',
      },
      {
        source: '/secure/v3/signals',
        destination: '/adm/alertas',
      },
      {
        source: '/secure/v3/account',
        destination: '/adm/perfil',
      },
    ];
  },
};

export default nextConfig;
import { redirect } from 'next/navigation';

// Esta página redireciona para os cadastros existentes
// CLIENT -> /cadastro/cliente
// PROFESSIONAL -> /cadastro/profissional
export default function CompletarCadastroPage() {
  // Por padrão, redirecionar para escolha de tipo
  redirect('/completar-cadastro/escolher-tipo');
}
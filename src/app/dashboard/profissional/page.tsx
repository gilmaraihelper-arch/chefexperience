// TODO: Implementar dashboard profissional igual ao arquivo original
// Por enquanto, redireciona para a página de orçamentos

import { redirect } from 'next/navigation';

export default function DashboardProfissionalPage() {
  redirect('/dashboard/profissional/orcamentos');
}

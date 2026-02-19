"use client";

import Link from "next/link";
import { ChefHat, Shield } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo + descrição */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Chef Experience</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Conectando talentos da gastronomia aos eventos mais especiais da sua vida.
            </p>
          </div>

          {/* Para Clientes */}
          <div>
            <h4 className="text-white font-semibold mb-4">Para Clientes</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/criar-evento" className="hover:text-amber-400 transition-colors">
                  Publicar Evento
                </Link>
              </li>
              <li>
                <Link href="/dashboard/cliente" className="hover:text-amber-400 transition-colors">
                  Meus Eventos
                </Link>
              </li>
              <li>
                <Link href="/#como-funciona" className="hover:text-amber-400 transition-colors">
                  Como Funciona
                </Link>
              </li>
            </ul>
          </div>

          {/* Para Profissionais */}
          <div>
            <h4 className="text-white font-semibold mb-4">Para Profissionais</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/cadastro/profissional" className="hover:text-amber-400 transition-colors">
                  Cadastrar
                </Link>
              </li>
              <li>
                <Link href="/dashboard/profissional" className="hover:text-amber-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/profissional" className="hover:text-amber-400 transition-colors">
                  Ver Orçamentos
                </Link>
              </li>
              <li>
                <Link href="/planos" className="hover:text-amber-400 transition-colors">
                  Planos e Preços
                </Link>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h4 className="text-white font-semibold mb-4">Suporte</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/faq" className="hover:text-amber-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-amber-400 transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/termos" className="hover:text-amber-400 transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="hover:text-amber-400 transition-colors">
                  Privacidade
                </Link>
              </li>
              <li className="pt-2 border-t border-gray-800 mt-2">
                <Link
                  href="/admin"
                  className="text-amber-500 hover:text-amber-400 transition-colors text-sm flex items-center gap-1"
                >
                  <Shield className="w-3 h-3" /> Painel Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 Chef Experience. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

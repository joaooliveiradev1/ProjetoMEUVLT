import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex-1 bg-white text-gray-800">
    
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
       
        <section className="flex flex-col md:flex-row items-center gap-12 mb-20">
          
        
          <div className="md:w-1/2 flex flex-col gap-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              Mobilidade inteligente e transparente em Fortaleza
            </h1>
            <p className="text-lg text-gray-600">
              Com o Meu VLT, acompanhe horários, rotas e alertas em tempo real. Planeje seus trajetos de forma fácil e rápida, melhorando sua experiência com o transporte público.
            </p>
            <div className="mt-4">
              <Button asChild size="lg">
              
              
                <Link href="/auth">Acompanhar rotas</Link>
              </Button>
            </div>
          </div>

        
          <div className="md:w-1/2 w-full">
           
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127399.98730992383!2d-38.5938550005717!3d-3.792550882194604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c74c017910363%3A0x8a0f6de396d8e647!2sFortaleza%20-%20CE!5e0!3m2!1spt-BR!2sbr!4v1730799425488!5m2!1spt-BR!2sbr"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>
        </section>

       
        <div className="border-t border-gray-200 my-16"></div>
 
        <section className="max-w-4xl mx-auto text-left md:text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Sobre o Meu VLT
          </h2>
          <div className="flex flex-col gap-4 text-gray-600 text-base md:text-lg">
            <p>
              O Meu VLT é uma plataforma digital desenvolvida com o propósito de aprimorar a experiência de mobilidade urbana em Fortaleza, oferecendo informações atualizadas e confiáveis sobre a operação do Veículo Leve sobre Trilhos (VLT).
            </p>
            <p>
              Inspirado em soluções de transporte inteligente como o Moovit, o sistema permite que passageiros consultem rotas, horários e localização dos trens em tempo real, além de receber notificações automáticas sobre atrasos, manutenções ou ocorrências durante o trajeto. Condutores podem registrar eventos diretamente pelo aplicativo móvel, e administradores têm acesso a painéis de controle para gerenciar alertas, usuários e relatórios de desempenho.
            </p>
            <p>
              O projeto nasceu de uma iniciativa acadêmica da Universidade de Fortaleza (UNIFOR) com o objetivo de unir tecnologia, eficiência e cidadania. A proposta é reduzir o tempo de espera dos passageiros, melhorar a comunicação entre usuários e operadores, e contribuir para uma cidade mais conectada e sustentável.
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Instagram,
  Linkedin,
  Facebook,
  Smartphone,
  Info,
  Database,
  HelpCircle,
  FileText,
  Users,
  Zap,
  Sparkles
} from 'lucide-react';

const faqData = [
  {
    question: "O QR Code do LIMMI Granel expira?",
    answer: "Não.\nO QR Code é fixo e não expira. Ele direciona para uma página dinâmica, permitindo atualizar informações do produto sem a necessidade de trocar etiquetas físicas na loja."
  },
  {
    question: "Os dados gerados pelo LIMMI utilizam informações da minha loja?",
    answer: "Sim.\nAs informações geradas pelo LIMMI partem das interações feitas no ponto de venda, como leituras de QR Code e uso das funcionalidades disponíveis, sempre respeitando o contexto da própria operação."
  },
  {
    question: "Que tipo de dados o LIMMI utiliza?",
    answer: "O LIMMI utiliza informações públicas e dados gerados pela interação dos clientes com a solução, com o objetivo de apoiar o varejo na organização da experiência e na tomada de decisões."
  },
  {
    question: "O LIMMI substitui o vendedor ou o atendimento no balcão?",
    answer: "Não.\nA LIMMI atua como ferramenta de apoio ao atendimento, ajudando a organizar informações e reduzir dúvidas recorrentes, enquanto o vendedor segue sendo central na experiência do cliente."
  },
  {
    question: "Que tipo de informação o cliente acessa ao escanear o QR Code?",
    answer: "O cliente acessa informações educativas e públicas sobre o produto, como descrição, usos e orientações gerais, pensadas para ajudar na decisão de compra com mais segurança."
  },
  {
    question: "A LIMMI pode evoluir para atender novas dores do varejo?",
    answer: "Sim.\nA LIMMI foi criada para resolver dores reais do varejo físico e pode evoluir conforme novas necessidades sejam identificadas, sempre usando tecnologia para melhorar a experiência de compra e o dia a dia da loja."
  }
];

export default function LandingPage() {

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="bg-white text-slate-900 font-sans selection:bg-blue-100">

      {/* 
        =============================================
        1. HERO SECTION
        =============================================
      */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center pt-20 pb-10 overflow-hidden">
        {/* Full Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Hero.png"
            alt="Hero Background"
            fill
            className="object-cover object-center hidden md:block"
            priority
          />
          <Image
            src="/Hero_mob.png"
            alt="Hero Background Mobile"
            fill
            className="object-cover object-center md:hidden"
            priority
          />
          {/* Overlay removed for clarity */}
        </div>



        {/* Navbar (Simple Logo + Contact) */}
        <nav className="absolute top-0 w-full flex justify-center py-6 z-50">
          <div className="flex flex-col items-center">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-2">
              <div className="relative w-32 h-10">
                <Image src="/LOGO LIMMI 1.png" fill alt="LIMMI" className="object-contain" />
              </div>
            </div>
            <span className="text-xs uppercase tracking-widest text-slate-500">Tecnologia Inteligente</span>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="container mx-auto px-4 z-10 flex flex-col items-center text-center mt-12">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[2rem] md:text-[57px] font-extrabold max-w-4xl leading-tight mb-6 text-slate-900 font-title"
          >
            A Limmi <span className="text-[#1E85C7]">é uma Retailtech</span> que veio para trazer <span className="text-[#1E85C7]">clareza</span> no momento da compra.
          </motion.h1>




        </div>

      </section>

      {/* Bottom Strip Image */}
      <div className="w-full">
        <Image
          src="/faixa-hero.png"
          alt="Strip"
          width={1920}
          height={200}
          className="w-full h-auto hidden md:block"
          priority
        />
        <Image
          src="/faixa-hero_mob.png"
          alt="Strip Mobile"
          width={800}
          height={200}
          className="w-full h-auto md:hidden"
          priority
        />
      </div>



      {/* 
        =============================================
        3. OFFERINGS SECTION ("O que podemos oferecer?")
        =============================================
      */}
      <section className="py-12 md:py-24 bg-[url('/background_pattern.png')] bg-cover bg-center text-center relative">
        <div className="container mx-auto px-4">
          <span className="text-[0.75rem] md:text-sm font-semibold text-slate-400 uppercase tracking-widest">Tecnologia aplicada ao ponto de venda.</span>
          <h2 className="text-[32px] md:text-[53px] font-bold text-slate-900 mt-2 mb-12 font-title">
            O que a LIMMI pode oferecer <span className="text-[#1E85C7]">ao seu varejo?</span>
          </h2>

          {/* 
             =============================================
             4. FEATURES SECTION (Dynamic Content)
             =============================================
           */}
          <div className="text-left max-w-6xl mx-auto space-y-32">

            {/* CONTENT FOR LIMMI GRANEL */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left Column: Content */}
                <div>
                  <h3 className="w-fit bg-[#1E85C7] text-white px-6 py-2 rounded-full text-[18px] font-bold mb-4 font-title mx-auto md:mx-0">Limmi Granel</h3>
                  <h4 className="text-[20px] md:text-[30px] font-bold text-slate-700 mb-6 font-title text-center md:text-left">Praticidade <span className="text-[#1E85C7]">&</span> padronização</h4>
                  <p className="text-slate-500 text-[16px] md:text-[24px] max-w-md mb-4 text-center md:text-left mx-auto md:mx-0">Informação correta e acessível para a decisão de compra.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Card 1 */}
                    <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
                      <div className="mb-4">
                        <HelpCircle className="w-10 h-10 text-white" />
                      </div>
                      <p className="font-bold text-sm leading-tight">Redução de duvidas operacionais no balcão</p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
                      <div className="mb-4">
                        <FileText className="w-10 h-10 text-white" />
                      </div>
                      <p className="font-bold text-sm leading-tight">Informação padronizada no ponto de venda</p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
                      <div className="mb-4">
                        <Users className="w-10 h-10 text-white" />
                      </div>
                      <p className="font-bold text-sm leading-tight">Apoio ao atendimento e à jornada do cliente</p>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
                      <div className="mb-4">
                        <Zap className="w-10 h-10 text-white" />
                      </div>
                      <p className="font-bold text-sm leading-tight">Mais fluidez operacional</p>
                    </div>

                    {/* Card 5 */}
                    <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
                      <div className="mb-4">
                        <Sparkles className="w-10 h-10 text-white" />
                      </div>
                      <p className="font-bold text-sm leading-tight">Diferenciação da experiência no granel</p>
                    </div>

                    {/* Card 6 */}
                    <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
                      <div className="mb-4">
                        <Database className="w-10 h-10 text-white" />
                      </div>
                      <p className="font-bold text-sm leading-tight">Dados gerados no ponto de venda para apoiar decisões do negócio</p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Phone Mockup with Blue Strip Overlay */}
                <div className="relative flex justify-center mt-0 md:mt-0">
                  <div className="relative z-10 w-full max-w-[300px]">
                    {/* Phone Image */}
                    <div>
                      <Image
                        src="/GIFLIMMI.gif"
                        width={300}
                        height={600}
                        alt="App Feature"
                        className="w-full h-auto drop-shadow-2xl"
                        priority
                      />
                    </div>


                  </div>

                  {/* Decorative Elements behind phone */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-3xl -z-10"></div>
                </div>
              </div>
            </motion.div>

            {/* CONTENT FOR LIMMI ASSIST */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left Column (Was Right): Man Shopping Image */}
                <div className="relative flex justify-center order-last md:order-first">
                  <div className="relative w-full max-w-[400px] aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl">
                    <Image
                      src="/MODELO.png"
                      fill
                      alt="Cliente usando Limmi Assist"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Right Column (Was Left): Content */}
                <div>
                  <h3 className="w-fit bg-[#1E85C7] text-white px-6 py-2 rounded-full text-[18px] font-bold mb-4 font-title mx-auto md:mx-0">Limmi Assist</h3>
                  <h4 className="text-[20px] md:text-[30px] font-bold text-slate-700 mb-6 font-title text-center md:text-left">Eficiência <span className="text-[#1E85C7]">&</span> inteligência</h4>
                  <p className="text-slate-500 text-[16px] md:text-[24px] max-w-2xl mb-4 text-center md:text-left mx-auto md:mx-0">
                    O LIMMI Assist permite que o cliente acompanhe o valor da compra ao longo do percurso, trazendo previsibilidade e mais segurança antes de chegar ao caixa.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Assist Card 1 */}
                    <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
                      <div className="mb-4">
                        <Image src="/assist1.png" width={40} height={40} alt="Assist 1" className="w-[40px] h-[40px]" />
                      </div>
                      <p className="font-bold text-sm leading-tight">Experiência de compra diferenciada</p>
                    </div>

                    {/* Assist Card 2 */}
                    <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
                      <div className="mb-4">
                        <Image src="/assist2.png" width={40} height={40} alt="Assist 2" className="w-[40px] h-[40px]" />
                      </div>
                      <p className="font-bold text-sm leading-tight">Cliente mais tranquilo no caixa</p>
                    </div>

                    {/* Assist Card 3 */}
                    <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
                      <div className="mb-4">
                        <Image src="/assist3.png" width={40} height={40} alt="Assist 3" className="w-[40px] h-[40px]" />
                      </div>
                      <p className="font-bold text-sm leading-tight">Dados de comportamento de compra</p>
                    </div>

                    {/* Assist Card 4 */}
                    <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
                      <div className="mb-4">
                        <Image src="/assist4.png" width={40} height={40} alt="Assist 4" className="w-[40px] h-[40px]" />
                      </div>
                      <p className="font-bold text-sm leading-tight">Apoio à reposição e análise de giro</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>




      {/* 
        =============================================
        BANNER SECTION
        =============================================
      */}
      <div className="w-full relative h-auto md:h-[500px] flex flex-col md:block">
        <Image
          src="/meio.png"
          fill
          alt="Banner Promocional"
          className="object-cover object-center hidden md:block"
        />
        <Image
          src="/meio-mob.png"
          width={768}
          height={600}
          alt="Banner Promocional Mobile"
          className="w-full h-auto md:hidden"
        />

        {/* Blue Info Strip Overlay - Full Width */}
        <div className="relative md:absolute bottom-0 left-0 right-0 w-full h-auto min-h-[100px] bg-[#1C7DBE] flex flex-col md:flex-row items-center justify-center px-8 py-8 md:py-6 text-white shadow-xl z-20 gap-8 md:gap-8">

          {/* Item 1 */}
          <div className="flex items-center gap-3 flex-1 md:border-r border-white/30 md:pr-8 justify-center py-2 md:py-0 max-w-xs">
            <div className="text-center text-xs md:text-sm leading-tight">
              <p className="font-bold">Clareza gera confiança.</p>
              <p className="opacity-90">Confiança gera venda.</p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-center gap-3 flex-1 md:border-r border-white/30 md:px-8 justify-center py-2 md:py-0 max-w-xs">
            <div className="text-center text-xs md:text-sm leading-tight">
              <p className="font-bold">O cliente entende melhor.</p>
              <p className="opacity-90">A loja vende mais.</p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-center gap-3 flex-1 md:pl-8 justify-center py-2 md:py-0 max-w-xs">
            <div className="text-center text-xs md:text-sm leading-tight">
              <p className="font-bold">A tecnologia organiza a experiência.</p>
              <p className="opacity-90">A experiência valoriza a loja.</p>
            </div>
          </div>

        </div>
      </div>

      {/* 
        =============================================
        7. FAQ SECTION ("Perguntas Frequentes") & FOOTER
        =============================================
      */}
      <section className="bg-white py-12 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest text-center block md:inline">F.A.Q</span>
          <h2 className="text-[32px] md:text-[48px] font-bold text-slate-900 mt-2 mb-12 font-title text-center">
            Perguntas <span className="text-[#1E85C7]">frequentes</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-left">
            {/* FAQ List */}
            {faqData.map((item, index) => (
              <div
                key={index}
                className={`border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow ${openIndex === index ? 'shadow-md' : ''}`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex justify-between items-start p-6 bg-white text-left font-bold text-slate-900 text-lg gap-4"
                >
                  <span className="leading-snug">{item.question}</span>
                  <div className="flex-shrink-0">
                    <Image
                      src={openIndex === index ? "/colapse.png" : "/open.png"}
                      width={32}
                      height={32}
                      alt={openIndex === index ? "Fechar" : "Abrir"}
                      className="w-8 h-8"
                    />
                  </div>
                </button>
                {/* Accordion Content */}
                <motion.div
                  initial={false}
                  animate={{ height: openIndex === index ? 'auto' : 0, opacity: openIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 bg-white text-slate-500 text-sm leading-relaxed whitespace-pre-line">
                    {item.answer}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">Copyright © 2025. Todos os Direitos Reservados. Limmi.</p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/5511958236106?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20LIMMI%20e%20gostaria%20de%20entender%20melhor%20como%20a%20solu%C3%A7%C3%A3o%20pode%20ajudar%20no%20meu%20varejo."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 animate-bounce-slow"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a >

    </div >
  );
}

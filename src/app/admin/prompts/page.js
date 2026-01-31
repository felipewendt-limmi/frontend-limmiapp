"use client";
import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button/Button';
import { Save, Copy, Check, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/Toast/ToastProvider';
import styles from './page.module.css';

export default function AdminPrompts() {
    const { addToast } = useToast();
    const [promptMaster, setPromptMaster] = useState("");
    const [promptClient, setPromptClient] = useState("");
    const [promptExtra, setPromptExtra] = useState("");
    const [copySuccess, setCopySuccess] = useState(null);

    // Initial default prompts if nothing is saved
    const DEFAULT_MASTER = `Atue como um Engenheiro Mestre de Dados Nutricionais e Especialista em Bioquímica Alimentar. Sua tarefa é transformar a lista de produtos fornecida em um JSON estruturado de altíssima qualidade para o catálogo MASTER do sistema LIMMI.

REGRAS DE OURO (CRITICAL):
1. PROIBIDO "N/A": Nunca retorne "N/A" ou valores vazios. Se o dado não existir, pesquise e use a MÉDIA TÉCNICA (TBCA, TACO ou USDA). Alucinações de texto como "Informação não disponível" são proibidas.
2. PREÇO DE MERCADO: O campo "marketPrice" deve representar o preço médio praticado no mercado brasileiro (por 100g). Este valor será a base global do sistema.
3. ENRIQUECIMENTO MÁXIMO: Exatamente 5 benefícios e 5 dicas de "ajuda com" (helpsWith) por produto.
4. CATEGORIAS PADRÃO: Grãos e Cereais, Leguminosas, Frutas Secas, Oleaginosas, Farinhas, Temperos, Adoçantes, Chás, Suplementos.
5. DESCRIÇÃO RICA: Texto vendedora e informativo de 3 a 4 linhas.

ESTRUTURA JSON:
[
  {
    "name": "Nome do Produto",
    "category": "Categoria padrão",
    "marketPrice": 0.00,
    "description": "Texto rico...",
    "benefits": ["B1", "B2", "B3", "B4", "B5"],
    "helpsWith": ["A1", "A2", "A3", "A4", "A5"],
    "tags": ["Alimento 1", "Alimento 2"],
    "nutrition": [
      { "label": "Calorias", "value": "X kcal" },
      { "label": "Proteína", "value": "Xg" },
      { "label": "Carboidratos", "value": "Xg" },
      { "label": "Gordura", "value": "Xg" },
      { "label": "Fibra", "value": "Xg" }
    ]
  }
]`;

    const DEFAULT_CLIENT = `Atue como um Engenheiro de Dados. Sua tarefa é cruzar a Base Master e a Lista da Loja para gerar o JSON de importação.

INSTRUÇÕES:
1. PRODUTO EXISTENTE (SLUG/NOME): Se o produto já existe na Base Master, use o "id" correspondente.
2. PREÇOS SEPARADOS:
   - "clientPrice": O preço exato informado na lista da loja (preço final do cliente).
   - "marketPrice": Preço base de mercado (referência global). Utilize valores médios reais por 100g.
3. REGRAS RÍGIDAS:
   - PROIBIDO "N/A": Nunca use "N/A" ou placeholders vazios. Se faltar info nutricional, use médias técnicas reais.
   - ENRIQUECIMENTO: Mesmo que o produto já exista, gere Descrição Rica, 5 Benefícios e 5 Dicas.
   - TAGS: Apenas alimentos reais que combinam (arroz, frango, etc).

ESTRUTURA JSON:
[
  {
    "id": "UUID-DA-BASE-MASTER-SE-HOUVER",
    "name": "Nome do Produto",
    "clientPrice": 10.50,
    "marketPrice": 12.00,
    "category": "Categoria válida",
    "description": "Descrição rica...",
    "benefits": ["...", "...", "...", "...", "..."],
    "helpsWith": ["...", "...", "...", "...", "..."],
    "tags": ["Alimento 1", "Alimento 2"],
    "nutrition": [
      { "label": "Calorias", "value": "X kcal" },
      { "label": "Proteína", "value": "X g" },
      { "label": "Carboidratos", "value": "X g" },
      { "label": "Gordura", "value": "X g" },
      { "label": "Fibra", "value": "X g" }
    ]
  }
]`;

    const DEFAULT_EXTRA = `Atue como um especialista em varejo de produtos a granel, com foco em operação, legislação sanitária e experiência do cliente.

Receberá uma lista de produtos.
Sua tarefa é FILTRAR e RETORNAR APENAS os produtos que fazem sentido serem vendidos a granel, com pesagem variável a cada 100g.

Critérios OBRIGATÓRIOS para MANTER o produto:
- Produto seco, desidratado, em pó, grão, floco, semente, castanha, farinha, açúcar, sal, tempero, erva seca, chá, cereal, leguminosa, fruta seca ou snack seco.
- Produto estável em temperatura ambiente.
- Produto normalmente vendido por peso (100g, 200g, 500g, etc).
- Produto que o cliente espera escolher quantidade (granel).

Critérios OBRIGATÓRIOS para EXCLUIR:
- Produtos vendidos por unidade (UND, bandeja, maço, espiga, metade).
- Produtos frescos (frutas, verduras, legumes in natura).
- Produtos refrigerados ou congelados.
- Produtos prontos, assados, recheados ou de padaria.
- Carnes, frios, laticínios, embutidos.
- Bebidas líquidas.
- Utensílios, embalagens, decoração, brindes, brinquedos.
- Produtos não alimentícios (máscaras, marcadores, moringas, cestas, lenha, taxas, regulamentos).
- Serviços ou taxas.
- Produtos infantis industrializados com marca fechada.
- Massas frescas, pizzas, salgados, pratos prontos.

Regras de saída:
- Retorne APENAS a lista final dos produtos válidos.
- Um produto por linha.
- Não categorizar.
- Não explicar.
- Não justificar.
- Não corrigir nomes.
- Não adicionar produtos novos.
- Não remover palavras do nome.
- Apenas copiar exatamente o nome do produto aprovado.

Lista de produtos:
[COLAR A LISTA COMPLETA AQUI]`;

    useEffect(() => {
        const savedMaster = localStorage.getItem('limmi_prompt_master');
        const savedClient = localStorage.getItem('limmi_prompt_client');
        const savedExtra = localStorage.getItem('limmi_prompt_extra');

        setPromptMaster(savedMaster || DEFAULT_MASTER);
        setPromptClient(savedClient || DEFAULT_CLIENT);
        setPromptExtra(savedExtra || DEFAULT_EXTRA);
    }, []);

    const handleSaveMaster = () => {
        localStorage.setItem('limmi_prompt_master', promptMaster);
        addToast("Prompt Master salvo com sucesso!", "success");
    };

    const handleSaveClient = () => {
        localStorage.setItem('limmi_prompt_client', promptClient);
        addToast("Prompt de Clientes salvo com sucesso!", "success");
    };

    const handleSaveExtra = () => {
        localStorage.setItem('limmi_prompt_extra', promptExtra);
        addToast("Prompt Extra salvo com sucesso!", "success");
    };

    const handleResetMaster = () => {
        if (!confirm("Deseja restaurar o padrão original para este prompt? Isso apagará suas mudanças atuais.")) return;
        setPromptMaster(DEFAULT_MASTER);
        localStorage.setItem('limmi_prompt_master', DEFAULT_MASTER);
        addToast("Prompt Master restaurado para o padrão v5.", "info");
    };

    const handleResetClient = () => {
        if (!confirm("Deseja restaurar o padrão original para este prompt? Isso apagará suas mudanças atuais.")) return;
        setPromptClient(DEFAULT_CLIENT);
        localStorage.setItem('limmi_prompt_client', DEFAULT_CLIENT);
        addToast("Prompt de Clientes restaurado para o padrão v5.", "info");
    };

    const handleResetExtra = () => {
        if (!confirm("Deseja restaurar o padrão original para este prompt? Isso apagará suas mudanças atuais.")) return;
        setPromptExtra(DEFAULT_EXTRA);
        localStorage.setItem('limmi_prompt_extra', DEFAULT_EXTRA);
        addToast("Prompt Extra restaurado para o padrão v5.", "info");
    };

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(type);
        setTimeout(() => setCopySuccess(null), 2000);
    };

    const handleResetAll = () => {
        if (!confirm("Isso apagará TODOS os seus prompts customizados e restaurará os padrões de fábrica (v5). Tem certeza?")) return;

        localStorage.removeItem('limmi_prompt_master');
        localStorage.removeItem('limmi_prompt_client');
        localStorage.removeItem('limmi_prompt_extra');

        setPromptMaster(DEFAULT_MASTER);
        setPromptClient(DEFAULT_CLIENT);
        setPromptExtra(DEFAULT_EXTRA);

        addToast("Sistema de Prompts resetado com sucesso!", "success");
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gerenciador de Prompts</h1>
                    <p className={styles.subtitle}>Configure e salve os prompts que você usa com as IAs.</p>
                </div>
                <Button variant="secondary" onClick={handleResetAll} style={{ color: '#dc2626', borderColor: '#fee2e2' }}>
                    Resetar Todos (Fábrica)
                </Button>
            </header>

            <div className={styles.grid}>
                {/* Master Section */}
                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardInfo}>
                            <FileText size={20} className={styles.icon} />
                            <div>
                                <h2 className={styles.cardTitle}>Promp Master (Catálogo Global)</h2>
                                <p className={styles.cardSubtitle}>Use para criar o catálogo principal a partir de listas brutas.</p>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <button className={styles.copyBtn} onClick={() => handleCopy(promptMaster, 'master')}>
                                {copySuccess === 'master' ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>
                    <textarea
                        className={styles.textarea}
                        value={promptMaster}
                        onChange={(e) => setPromptMaster(e.target.value)}
                        placeholder="Cole aqui o seu prompt master..."
                    />
                    <div className={styles.footer}>
                        <Button icon={Save} onClick={handleSaveMaster}>Salvar Master</Button>
                        <Button variant="ghost" onClick={handleResetMaster} style={{ color: '#64748b', border: '1px solid #e2e8f0' }}>Restaurar Padrão v5</Button>
                    </div>
                </section>

                {/* Client Section */}
                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardInfo}>
                            <FileText size={20} className={styles.icon} />
                            <div>
                                <h2 className={styles.cardTitle}>Prompt de Novos Clientes (Vínculo)</h2>
                                <p className={styles.cardSubtitle}>Use para cruzar a Base Master com a lista individual da loja.</p>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <button className={styles.copyBtn} onClick={() => handleCopy(promptClient, 'client')}>
                                {copySuccess === 'client' ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>
                    <textarea
                        className={styles.textarea}
                        value={promptClient}
                        onChange={(e) => setPromptClient(e.target.value)}
                        placeholder="Cole aqui o seu prompt de clientes..."
                    />
                    <div className={styles.footer}>
                        <Button icon={Save} onClick={handleSaveClient}>Salvar Cliente</Button>
                        <Button variant="ghost" onClick={handleResetClient} style={{ color: '#64748b', border: '1px solid #e2e8f0' }}>Restaurar Padrão v5</Button>
                    </div>
                </section>

                {/* Extra Section */}
                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardInfo}>
                            <FileText size={20} className={styles.icon} />
                            <div>
                                <h2 className={styles.cardTitle}>Prompt Customizado (Extra)</h2>
                                <p className={styles.cardSubtitle}>Espaço livre para salvar qualquer prompt adicional.</p>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <button className={styles.copyBtn} onClick={() => handleCopy(promptExtra, 'extra')}>
                                {copySuccess === 'extra' ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>
                    <textarea
                        className={styles.textarea}
                        value={promptExtra}
                        onChange={(e) => setPromptExtra(e.target.value)}
                        placeholder="Escreva ou cole aqui qualquer outro prompt..."
                    />
                    <div className={styles.footer}>
                        <Button icon={Save} onClick={handleSaveExtra}>Salvar Extra</Button>
                        <Button variant="ghost" onClick={handleResetExtra} style={{ color: '#64748b', border: '1px solid #e2e8f0' }}>Restaurar Padrão v5</Button>
                    </div>
                </section>
            </div>
        </div>
    );
}

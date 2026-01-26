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
    const [copySuccess, setCopySuccess] = useState(null);

    // Initial default prompts if nothing is saved
    const DEFAULT_MASTER = `Atue como um Engenheiro Mestre de Dados Nutricionais e Especialista em Bioquímica Alimentar. Sua tarefa é transformar a lista de produtos fornecida em um JSON estruturado de altíssima qualidade para o catágo MASTER do sistema LIMMI.
REGRAS DE OURO (CRITICAL):
1. PROIBIDO "N/A": Nunca retorne "N/A" ou valores vazios para dados nutricionais. Se o dado exato não for encontrado, você DEVE pesquisar e usar a MÉDIA TÉCNICA (baseando-se em tabelas oficiais como TBCA, TACO ou USDA) para o tipo de produto genérico.
2. ENRIQUECIMENTO MÁXIMO: Gere exatamente 5 benefícios reais e 5 dicas de "ajuda com" (helpsWith) por produto. Use termos que destaquem as propriedades de saúde.
3. CATEGORIAS PADRÃO: Utilize APENAS uma destas categorias: Grãos e Cereais, Leguminosas, Frutas Secas, Oleaginosas, Farinhas, Temperos, Adoçantes, Chás, Suplementos.
4. DESCRIÇÃO RICA: A descrição deve ser vendedora e informativa, destacando a origem e as propriedades nutricionais.
5. PREÇO: O campo "price" deve representar o preço médio por 100g do produto, calculado a partir de benchmarking do mercado brasileiro, utilizando como referência empórios, lojas a granel e mercados naturais. A estimativa deve seguir faixas fixas por categoria, sempre escolhendo o valor médio da faixa, evitando variações aleatórias entre execuções.
ESTRUTURA JSON (Schema):
[
  {
    "name": "Nome exato do produto",
    "category": "Uma das categorias padrão",
    "price": 0.00,
    "description": "Texto rico e informativo...",
    "benefits": ["B1", "B2", "B3", "B4", "B5"],
    "helpsWith": ["A1", "A2", "A3", "A4", "A5"],
    "tags": ["Dica 1", "Característica 1"],
    "nutrition": [
      { "label": "Calorias", "value": "X kcal" },
      { "label": "Proteína", "value": "Xg" },
      { "label": "Carboidratos", "value": "Xg" },
      { "label": "Gordura", "value": "Xg" },
      { "label": "Fibra", "value": "Xg" }
    ]
  }
]`;

    const DEFAULT_CLIENT = `Atue como um Engenheiro de Dados e Analista de Mercado. Sua tarefa é cruzar dois conjuntos de dados (Base Master e Lista da Loja) fornecidos via Excel para gerar o JSON de importação de um cliente no sistema LIMMI.

INSTRUÇÕES DE EXECUÇÃO:

1. LEIA A BASE MASTER: Este arquivo contém os produtos já existentes com as colunas "id" (UUID), "name" e "category".
2. LEIA A LISTA DA LOJA: Este arquivo contém os nomes dos produtos e os preços específicos praticados pelo cliente.

LÓGICA DE CRUZAMENTO:
* Antes de comparar, normalize os nomes dos produtos, removendo acentos, diferenças de maiúsculas/minúsculas, espaços extras e variações simples de plural/singular.
* Se o nome do produto na Lista da Loja existir na Base Master, você DEVE:
* Incluir o campo "id" com o UUID correspondente da Base Master.
* Utilizar a "category" exatamente como definida na Base Master.
* O campo "price" DEVE refletir exatamente o valor numérico presente na planilha da loja, sem qualquer alteração.
* Se o nome NÃO existir na Base Master:
* Gere o objeto SEM o campo "id".
* Atribua uma "category" válida conforme o padrão do sistema.
REGRAS RÍGIDAS DE QUALIDADE:
1. PROIBIDO "N/A": Nunca retorne "N/A", null ou valores vazios. Se dados nutricionais estiverem ausentes, utilize MÉDIAS TÉCNICAS confiáveis (TBCA, TACO ou USDA) para o tipo de produto.
2. PREÇO NÃO ESTIMADO: É terminantemente proibido estimar, recalcular ou ajustar preços. O valor deve ser exatamente o informado pelo cliente.
3. ENRIQUECIMENTO COMPLETO: Todos os produtos devem conter: descrição; exatamente 5 benefícios; exatamente 5 helpsWith; tabela nutricional completa. Mesmo quando o produto já existir na Base Master.
4. DESCRIÇÃO RICA: O campo "description" deve ser informativo e comercial, destacando: origem do alimento; uso culinário comum; propriedades nutricionais reais. O texto deve ser claro, educativo e atrativo.
5. TAGS CULINÁRIAS:O campo "tags" deve conter exclusivamente nomes de ALIMENTOS REAIS que combinam com o produto (ex: arroz, frango, banana, iogurte). É proibido usar características, adjetivos, propriedades nutricionais ou termos técnicos como tags.
6. CATEGORIAS VÁLIDAS: Caso o produto não exista na Base Master, a categoria atribuída DEVE ser uma das categorias padrão do sistema e semanticamente compatível com o produto, sendo proibido criar novas categorias.
ORDEM DETERMINÍSTICA:
Os campos do JSON devem seguir exatamente a ordem definida na estrutura abaixo, sem omissões ou reordenação.
SAÍDA:
Retorne APENAS um array JSON puro, pronto para ser processado pela API, sem comentários ou texto adicional.

ESTRUTURA JSON:
[
  {
    "id": "UUID-DO-ARQUIVO-BASE-SE-HOUVER",
    "name": "Nome do Produto",
    "price": 10.50,
    "category": "Categoria válida",
    "description": "Descrição rica e informativa...",
    "benefits": ["...", "...", "...", "...", "..."],
    "helpsWith": ["...", "...", "...", "...", "..."
],
    "tags": ["Alimento 1", "Alimento 2", "Alimento 3"],
    "nutrition": [
      { "label": "Calorias", "value": "X kcal" },
      { "label": "Proteína", "value": "X g" },
      { "label": "Carboidratos", "value": "X g" },
      { "label": "Gordura", "value": "X g" },
      { "label": "Fibra", "value": "X g" }
    ]
  }
]`;

    useEffect(() => {
        const savedMaster = localStorage.getItem('limmi_prompt_master');
        const savedClient = localStorage.getItem('limmi_prompt_client');

        setPromptMaster(savedMaster || DEFAULT_MASTER);
        setPromptClient(savedClient || DEFAULT_CLIENT);
    }, []);

    const handleSaveMaster = () => {
        localStorage.setItem('limmi_prompt_master', promptMaster);
        addToast("Prompt Master salvo com sucesso!", "success");
    };

    const handleSaveClient = () => {
        localStorage.setItem('limmi_prompt_client', promptClient);
        addToast("Prompt de Clientes salvo com sucesso!", "success");
    };

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(type);
        setTimeout(() => setCopySuccess(null), 2000);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Gerenciador de Prompts</h1>
                <p className={styles.subtitle}>Configure e salve os prompts que você usa com as IAs.</p>
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
                    </div>
                </section>
            </div>
        </div>
    );
}

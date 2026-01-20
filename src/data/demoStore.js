export const DemoStoreData = {
    id: 'demo-store',
    name: 'Empório Natural ®',
    slug: 'demo-store',
    description: 'Experimente a revolução do granel digital. Produtos selecionados, rastreáveis e com informação completa.',
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop', // A nice grocery/market vibe
    isActive: true,
    themeColor: '#16a34a',
    products: [
        {
            id: 'demo-1',
            name: 'Granola Artesanal Premium',
            slug: 'granola-artesanal',
            description: 'Mix crocante de aveia, castanhas nobres (caju e pará), sementes de abóbora e girassol, adoçada levemente com mel silvestre. Sem conservantes.',
            price: 'R$ 4,50',
            unit: '100g',
            image: 'https://img.freepik.com/fotos-gratis/pan-de-vista-superior-com-granola-deliciosa_23-2148543631.jpg', // Granola
            images: [
                'https://img.freepik.com/fotos-gratis/pan-de-vista-superior-com-granola-deliciosa_23-2148543631.jpg'
            ],
            benefits: ['Rico em Fibras', 'Sem Açúcar Refinado', 'Energia Duradoura'],
            tips: [
                'Perfeito com iogurte natural no café da manhã.',
                'Adicione frutas vermelhas para mais antioxidantes.',
                'Pode ser usado como topping em açaí.'
            ],
            combinations: ['Iogurte Grego', 'Açaí', 'Leite Vegetal'],
            nutrition: [
                { name: 'Valor Energético', amount: '380 kcal', dv: '19%' },
                { name: 'Carboidratos', amount: '52g', dv: '17%' },
                { name: 'Proteínas', amount: '12g', dv: '16%' },
                { name: 'Gorduras Totais', amount: '15g', dv: '27%' },
                { name: 'Fibra Alimentar', amount: '8g', dv: '32%' }
            ],
            isActive: true
        },
        {
            id: 'demo-2',
            name: 'Castanha de Caju Torrada e Salgada W1',
            slug: 'castanha-caju',
            description: 'Castanhas de caju selecionadas tipo W1 (exportação), torradas lentamente para manter a crocância e sabor, com leve toque de sal marinho.',
            price: 'R$ 12,90',
            unit: '100g',
            image: 'https://www.mariachocolate.com.br/static/21111/sku/confeitaria-castanha-de-caju-em-banda-com-sal-250g-norte-minas--p-1715961850845.png', // Cashews
            images: [
                'https://www.mariachocolate.com.br/static/21111/sku/confeitaria-castanha-de-caju-em-banda-com-sal-250g-norte-minas--p-1715961850845.png'
            ],
            benefits: ['Gorduras Boas', 'Magnésio', 'Controle de Colesterol'],
            tips: [
                'Ideal para lanches rápidos entre refeições.',
                'Use triturada para finalizar pratos salgados.',
                'Combine com frutas secas para um mix energético.'
            ],
            combinations: ['Cerveja Artesanal', 'Damasco', 'Queijos'],
            nutrition: [
                { name: 'Valor Energético', amount: '570 kcal', dv: '28%' },
                { name: 'Carboidratos', amount: '33g', dv: '11%' },
                { name: 'Proteínas', amount: '18g', dv: '24%' },
                { name: 'Gorduras Totais', amount: '44g', dv: '80%' },
                { name: 'Fibra Alimentar', amount: '3.3g', dv: '13%' }
            ],
            isActive: true
        },
        {
            id: 'demo-3',
            name: 'Quinoa Real Orgânica',
            slug: 'quinoa-real',
            description: 'Superalimento andino completo. Grãos de quinoa branca orgânica, fonte de proteína vegetal completa e livre de glúten.',
            price: 'R$ 6,90',
            unit: '100g',
            image: 'https://images.tcdn.com.br/img/img_prod/1002447/quinoa_em_graos_branca_1_kg_1347_1_d912f99e42a3e5604c1a1ba2ec3241fd.jpg', // Quinoa
            images: [
                'https://images.tcdn.com.br/img/img_prod/1002447/quinoa_em_graos_branca_1_kg_1347_1_d912f99e42a3e5604c1a1ba2ec3241fd.jpg'
            ],
            benefits: ['Proteína Completa', 'Sem Glúten', 'Baixo Índice Glicêmico'],
            tips: [
                'Substitua o arroz branco por quinoa para mais nutrientes.',
                'Adicione em saladas frias com vegetais picados.',
                'Use em sopas para encorpar.'
            ],
            combinations: ['Saladas', 'Legumes Grelhados', 'Peixes'],
            nutrition: [
                { name: 'Valor Energético', amount: '368 kcal', dv: '18%' },
                { name: 'Carboidratos', amount: '64g', dv: '21%' },
                { name: 'Proteínas', amount: '14g', dv: '19%' },
                { name: 'Gorduras Totais', amount: '6g', dv: '11%' },
                { name: 'Fibra Alimentar', amount: '7g', dv: '28%' }
            ],
            isActive: true
        },
        {
            id: 'demo-4',
            name: 'Damasco Turco Seco',
            slug: 'damasco-turco',
            description: 'Damascos importados da Turquia, secos naturalmente. Textura macia, sabor doce intenso e cor laranja vibrante. Sem adição de açúcar.',
            price: 'R$ 8,50',
            unit: '100g',
            image: 'https://media.istockphoto.com/id/542330328/pt/foto/organic-raw-dry-apricots.jpg?s=612x612&w=0&k=20&c=37unxMhKkFe9YMMDAxbN-5inm6n3oL4xRh-rXt4fMMU=', // Apricots
            images: [
                'https://media.istockphoto.com/id/542330328/pt/foto/organic-raw-dry-apricots.jpg?s=612x612&w=0&k=20&c=37unxMhKkFe9YMMDAxbN-5inm6n3oL4xRh-rXt4fMMU='
            ],
            benefits: ['Antioxidantes', 'Saúde Ocular', 'Potássio'],
            tips: [
                'Perfeito para quando bate aquela vontade de doce.',
                'Corte em cubos e adicione ao iogurte.',
                'Harmoniza muito bem com queijos brie ou gorgonzola.'
            ],
            combinations: ['Queijo Brie', 'Nozes', 'Vinho Branco'],
            nutrition: [
                { name: 'Valor Energético', amount: '241 kcal', dv: '12%' },
                { name: 'Carboidratos', amount: '63g', dv: '21%' },
                { name: 'Proteínas', amount: '3.4g', dv: '5%' },
                { name: 'Gorduras Totais', amount: '0.5g', dv: '1%' },
                { name: 'Fibra Alimentar', amount: '7.3g', dv: '29%' }
            ],
            isActive: true
        }
    ]
};

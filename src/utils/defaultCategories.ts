
import { TransactionCategory } from "./mockData";

// Categorias padrão para comissões de seguradoras e despesas
export const defaultCategories: TransactionCategory[] = [
  // RECEITAS - Nível 2 - Categoria principal de Comissões
  {
    id: 'income-comissoes',
    name: 'Comissões',
    type: 'income',
    level: 2
  },
  
  // Nível 3 - Seguradoras (subcategorias de Comissões)
  {
    id: 'income-comissoes-zurich',
    name: 'Zurich',
    type: 'income',
    parentId: 'income-comissoes',
    level: 3
  },
  {
    id: 'income-comissoes-liberty',
    name: 'Liberty',
    type: 'income',
    parentId: 'income-comissoes',
    level: 3
  },
  {
    id: 'income-comissoes-caravela',
    name: 'Caravela',
    type: 'income',
    parentId: 'income-comissoes',
    level: 3
  },
  {
    id: 'income-comissoes-allianz',
    name: 'Allianz',
    type: 'income',
    parentId: 'income-comissoes',
    level: 3
  },
  {
    id: 'income-comissoes-lusitania',
    name: 'Lusitania',
    type: 'income',
    parentId: 'income-comissoes',
    level: 3
  },
  {
    id: 'income-comissoes-victoria',
    name: 'Victoria',
    type: 'income',
    parentId: 'income-comissoes',
    level: 3
  },
  {
    id: 'income-comissoes-ageas',
    name: 'Ageas',
    type: 'income',
    parentId: 'income-comissoes',
    level: 3
  },
  {
    id: 'income-comissoes-una',
    name: 'Una',
    type: 'income',
    parentId: 'income-comissoes',
    level: 3
  },
  
  // Nível 4 - Tipos de comissão para Zurich
  {
    id: 'income-comissoes-zurich-normal',
    name: 'Normal',
    type: 'income',
    parentId: 'income-comissoes-zurich',
    level: 4
  },
  {
    id: 'income-comissoes-zurich-extra',
    name: 'Extra',
    type: 'income',
    parentId: 'income-comissoes-zurich',
    level: 4
  },
  
  // Nível 4 - Tipos de comissão para Liberty
  {
    id: 'income-comissoes-liberty-normal',
    name: 'Normal',
    type: 'income',
    parentId: 'income-comissoes-liberty',
    level: 4
  },
  {
    id: 'income-comissoes-liberty-extra',
    name: 'Extra',
    type: 'income',
    parentId: 'income-comissoes-liberty',
    level: 4
  },
  
  // Nível 4 - Tipos de comissão para Caravela
  {
    id: 'income-comissoes-caravela-normal',
    name: 'Normal',
    type: 'income',
    parentId: 'income-comissoes-caravela',
    level: 4
  },
  {
    id: 'income-comissoes-caravela-extra',
    name: 'Extra',
    type: 'income',
    parentId: 'income-comissoes-caravela',
    level: 4
  },
  
  // Nível 4 - Tipos de comissão para Allianz
  {
    id: 'income-comissoes-allianz-normal',
    name: 'Normal',
    type: 'income',
    parentId: 'income-comissoes-allianz',
    level: 4
  },
  {
    id: 'income-comissoes-allianz-extra',
    name: 'Extra',
    type: 'income',
    parentId: 'income-comissoes-allianz',
    level: 4
  },
  
  // Nível 4 - Tipos de comissão para Lusitania
  {
    id: 'income-comissoes-lusitania-normal',
    name: 'Normal',
    type: 'income',
    parentId: 'income-comissoes-lusitania',
    level: 4
  },
  {
    id: 'income-comissoes-lusitania-extra',
    name: 'Extra',
    type: 'income',
    parentId: 'income-comissoes-lusitania',
    level: 4
  },
  
  // Nível 4 - Tipos de comissão para Victoria
  {
    id: 'income-comissoes-victoria-normal',
    name: 'Normal',
    type: 'income',
    parentId: 'income-comissoes-victoria',
    level: 4
  },
  {
    id: 'income-comissoes-victoria-extra',
    name: 'Extra',
    type: 'income',
    parentId: 'income-comissoes-victoria',
    level: 4
  },
  
  // Nível 4 - Tipos de comissão para Ageas
  {
    id: 'income-comissoes-ageas-normal',
    name: 'Normal',
    type: 'income',
    parentId: 'income-comissoes-ageas',
    level: 4
  },
  {
    id: 'income-comissoes-ageas-extra',
    name: 'Extra',
    type: 'income',
    parentId: 'income-comissoes-ageas',
    level: 4
  },
  
  // Nível 4 - Tipos de comissão para Una
  {
    id: 'income-comissoes-una-normal',
    name: 'Normal',
    type: 'income',
    parentId: 'income-comissoes-una',
    level: 4
  },
  {
    id: 'income-comissoes-una-extra',
    name: 'Extra',
    type: 'income',
    parentId: 'income-comissoes-una',
    level: 4
  },
  
  // DESPESAS - Categorias de nível 2
  {
    id: 'expense-pessoal',
    name: 'Pessoal',
    type: 'expense',
    level: 2
  },
  {
    id: 'expense-impostos',
    name: 'Impostos',
    type: 'expense',
    level: 2
  },
  {
    id: 'expense-seguros',
    name: 'Seguros',
    type: 'expense',
    level: 2
  },
  {
    id: 'expense-diversos',
    name: 'Diversos',
    type: 'expense',
    level: 2
  },
  {
    id: 'expense-comida-escritorio',
    name: 'Comida escritório',
    type: 'expense',
    level: 2
  },
  {
    id: 'expense-automoveis',
    name: 'Automóveis',
    type: 'expense',
    level: 2
  },
  {
    id: 'expense-escritorio',
    name: 'Escritório',
    type: 'expense',
    level: 2
  },
  {
    id: 'expense-impostos-gerais',
    name: 'Impostos',
    type: 'expense',
    level: 2
  },
  {
    id: 'expense-outras-despesas',
    name: 'Outras despesas',
    type: 'expense',
    level: 2
  },
  
  // PESSOAL - Nível 3
  {
    id: 'expense-pessoal-salarios',
    name: 'Salários',
    type: 'expense',
    parentId: 'expense-pessoal',
    level: 3
  },
  
  // PESSOAL > SALÁRIOS - Nível 4
  {
    id: 'expense-pessoal-salarios-carlos',
    name: 'Carlos',
    type: 'expense',
    parentId: 'expense-pessoal-salarios',
    level: 4
  },
  {
    id: 'expense-pessoal-salarios-leandro',
    name: 'Leandro',
    type: 'expense',
    parentId: 'expense-pessoal-salarios',
    level: 4
  },
  {
    id: 'expense-pessoal-salarios-morais',
    name: 'Morais',
    type: 'expense',
    parentId: 'expense-pessoal-salarios',
    level: 4
  },
  {
    id: 'expense-pessoal-salarios-isabel',
    name: 'Isabel',
    type: 'expense',
    parentId: 'expense-pessoal-salarios',
    level: 4
  },
  {
    id: 'expense-pessoal-salarios-ana-paula',
    name: 'Ana Paula',
    type: 'expense',
    parentId: 'expense-pessoal-salarios',
    level: 4
  },
  
  // IMPOSTOS - Nível 3
  {
    id: 'expense-impostos-seguranca-social',
    name: 'Segurança Social',
    type: 'expense',
    parentId: 'expense-impostos',
    level: 3
  },
  {
    id: 'expense-impostos-irs',
    name: 'IRS',
    type: 'expense',
    parentId: 'expense-impostos',
    level: 3
  },
  
  // SEGUROS - Nível 3
  {
    id: 'expense-seguros-at',
    name: 'AT',
    type: 'expense',
    parentId: 'expense-seguros',
    level: 3
  },
  {
    id: 'expense-seguros-saude',
    name: 'Saúde',
    type: 'expense',
    parentId: 'expense-seguros',
    level: 3
  },
  
  // DIVERSOS - Nível 3
  {
    id: 'expense-diversos-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-diversos',
    level: 3
  },
  
  // COMIDA ESCRITÓRIO - Nível 3
  {
    id: 'expense-comida-escritorio-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-comida-escritorio',
    level: 3
  },
  
  // AUTOMÓVEIS - Nível 3
  {
    id: 'expense-automoveis-combustivel',
    name: 'Combustível',
    type: 'expense',
    parentId: 'expense-automoveis',
    level: 3
  },
  {
    id: 'expense-automoveis-portagens',
    name: 'Portagens',
    type: 'expense',
    parentId: 'expense-automoveis',
    level: 3
  },
  {
    id: 'expense-automoveis-parques',
    name: 'Parques',
    type: 'expense',
    parentId: 'expense-automoveis',
    level: 3
  },
  {
    id: 'expense-automoveis-seguros',
    name: 'Seguros',
    type: 'expense',
    parentId: 'expense-automoveis',
    level: 3
  },
  {
    id: 'expense-automoveis-manutencao',
    name: 'Manutenção',
    type: 'expense',
    parentId: 'expense-automoveis',
    level: 3
  },
  {
    id: 'expense-automoveis-impostos',
    name: 'Impostos',
    type: 'expense',
    parentId: 'expense-automoveis',
    level: 3
  },
  {
    id: 'expense-automoveis-multas',
    name: 'Multas',
    type: 'expense',
    parentId: 'expense-automoveis',
    level: 3
  },
  {
    id: 'expense-automoveis-compra-carro',
    name: 'Compra de carro',
    type: 'expense',
    parentId: 'expense-automoveis',
    level: 3
  },
  {
    id: 'expense-automoveis-diversos',
    name: 'Diversos',
    type: 'expense',
    parentId: 'expense-automoveis',
    level: 3
  },
  
  // AUTOMÓVEIS > COMBUSTÍVEL - Nível 4
  {
    id: 'expense-automoveis-combustivel-carlos',
    name: 'Carlos',
    type: 'expense',
    parentId: 'expense-automoveis-combustivel',
    level: 4
  },
  {
    id: 'expense-automoveis-combustivel-morais',
    name: 'Morais',
    type: 'expense',
    parentId: 'expense-automoveis-combustivel',
    level: 4
  },
  
  // AUTOMÓVEIS > PORTAGENS - Nível 4
  {
    id: 'expense-automoveis-portagens-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-automoveis-portagens',
    level: 4
  },
  
  // AUTOMÓVEIS > PARQUES - Nível 4
  {
    id: 'expense-automoveis-parques-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-automoveis-parques',
    level: 4
  },
  
  // AUTOMÓVEIS > SEGUROS - Nível 4
  {
    id: 'expense-automoveis-seguros-carlos',
    name: 'Carlos',
    type: 'expense',
    parentId: 'expense-automoveis-seguros',
    level: 4
  },
  {
    id: 'expense-automoveis-seguros-morais',
    name: 'Morais',
    type: 'expense',
    parentId: 'expense-automoveis-seguros',
    level: 4
  },
  
  // AUTOMÓVEIS > MANUTENÇÃO - Nível 4
  {
    id: 'expense-automoveis-manutencao-carlos',
    name: 'Carlos',
    type: 'expense',
    parentId: 'expense-automoveis-manutencao',
    level: 4
  },
  {
    id: 'expense-automoveis-manutencao-morais',
    name: 'Morais',
    type: 'expense',
    parentId: 'expense-automoveis-manutencao',
    level: 4
  },
  
  // AUTOMÓVEIS > IMPOSTOS - Nível 4
  {
    id: 'expense-automoveis-impostos-carlos',
    name: 'Carlos',
    type: 'expense',
    parentId: 'expense-automoveis-impostos',
    level: 4
  },
  {
    id: 'expense-automoveis-impostos-morais',
    name: 'Morais',
    type: 'expense',
    parentId: 'expense-automoveis-impostos',
    level: 4
  },
  
  // AUTOMÓVEIS > MULTAS - Nível 4
  {
    id: 'expense-automoveis-multas-carlos',
    name: 'Carlos',
    type: 'expense',
    parentId: 'expense-automoveis-multas',
    level: 4
  },
  {
    id: 'expense-automoveis-multas-morais',
    name: 'Morais',
    type: 'expense',
    parentId: 'expense-automoveis-multas',
    level: 4
  },
  
  // AUTOMÓVEIS > COMPRA DE CARRO - Nível 4
  {
    id: 'expense-automoveis-compra-carro-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-automoveis-compra-carro',
    level: 4
  },
  
  // AUTOMÓVEIS > DIVERSOS - Nível 4
  {
    id: 'expense-automoveis-diversos-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-automoveis-diversos',
    level: 4
  },
  
  // ESCRITÓRIO - Nível 3
  {
    id: 'expense-escritorio-aluguer',
    name: 'Aluguer',
    type: 'expense',
    parentId: 'expense-escritorio',
    level: 3
  },
  {
    id: 'expense-escritorio-luz',
    name: 'Luz',
    type: 'expense',
    parentId: 'expense-escritorio',
    level: 3
  },
  {
    id: 'expense-escritorio-telecomunicacoes',
    name: 'Telecomunicações',
    type: 'expense',
    parentId: 'expense-escritorio',
    level: 3
  },
  {
    id: 'expense-escritorio-agua',
    name: 'Água',
    type: 'expense',
    parentId: 'expense-escritorio',
    level: 3
  },
  {
    id: 'expense-escritorio-limpeza',
    name: 'Limpeza',
    type: 'expense',
    parentId: 'expense-escritorio',
    level: 3
  },
  {
    id: 'expense-escritorio-consumiveis',
    name: 'Consumíveis',
    type: 'expense',
    parentId: 'expense-escritorio',
    level: 3
  },
  {
    id: 'expense-escritorio-informatica-soft',
    name: 'Informática (Soft)',
    type: 'expense',
    parentId: 'expense-escritorio',
    level: 3
  },
  {
    id: 'expense-escritorio-informatica-hard',
    name: 'Informática (Hard)',
    type: 'expense',
    parentId: 'expense-escritorio',
    level: 3
  },
  {
    id: 'expense-escritorio-correios',
    name: 'Correios',
    type: 'expense',
    parentId: 'expense-escritorio',
    level: 3
  },
  {
    id: 'expense-escritorio-seguros',
    name: 'Seguros',
    type: 'expense',
    parentId: 'expense-escritorio',
    level: 3
  },
  {
    id: 'expense-escritorio-mobiliario',
    name: 'Mobiliário',
    type: 'expense',
    parentId: 'expense-escritorio',
    level: 3
  },
  {
    id: 'expense-escritorio-obras-manutencao',
    name: 'Obras / Manutenção',
    type: 'expense',
    parentId: 'expense-escritorio',
    level: 3
  },
  
  // ESCRITÓRIO > ALUGUER - Nível 4
  {
    id: 'expense-escritorio-aluguer-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-escritorio-aluguer',
    level: 4
  },
  
  // ESCRITÓRIO > LUZ - Nível 4
  {
    id: 'expense-escritorio-luz-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-escritorio-luz',
    level: 4
  },
  
  // ESCRITÓRIO > TELECOMUNICAÇÕES - Nível 4
  {
    id: 'expense-escritorio-telecomunicacoes-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-escritorio-telecomunicacoes',
    level: 4
  },
  
  // ESCRITÓRIO > ÁGUA - Nível 4
  {
    id: 'expense-escritorio-agua-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-escritorio-agua',
    level: 4
  },
  
  // ESCRITÓRIO > LIMPEZA - Nível 4
  {
    id: 'expense-escritorio-limpeza-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-escritorio-limpeza',
    level: 4
  },
  
  // ESCRITÓRIO > CONSUMÍVEIS - Nível 4
  {
    id: 'expense-escritorio-consumiveis-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-escritorio-consumiveis',
    level: 4
  },
  
  // ESCRITÓRIO > INFORMÁTICA (SOFT) - Nível 4
  {
    id: 'expense-escritorio-informatica-soft-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-escritorio-informatica-soft',
    level: 4
  },
  
  // ESCRITÓRIO > INFORMÁTICA (HARD) - Nível 4
  {
    id: 'expense-escritorio-informatica-hard-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-escritorio-informatica-hard',
    level: 4
  },
  
  // ESCRITÓRIO > CORREIOS - Nível 4
  {
    id: 'expense-escritorio-correios-selos',
    name: 'Selos',
    type: 'expense',
    parentId: 'expense-escritorio-correios',
    level: 4
  },
  {
    id: 'expense-escritorio-correios-registos',
    name: 'Registos',
    type: 'expense',
    parentId: 'expense-escritorio-correios',
    level: 4
  },
  
  // ESCRITÓRIO > SEGUROS - Nível 4
  {
    id: 'expense-escritorio-seguros-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-escritorio-seguros',
    level: 4
  },
  
  // ESCRITÓRIO > MOBILIÁRIO - Nível 4
  {
    id: 'expense-escritorio-mobiliario-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-escritorio-mobiliario',
    level: 4
  },
  
  // ESCRITÓRIO > OBRAS / MANUTENÇÃO - Nível 4
  {
    id: 'expense-escritorio-obras-manutencao-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-escritorio-obras-manutencao',
    level: 4
  },
  
  // IMPOSTOS GERAIS - Nível 3
  {
    id: 'expense-impostos-gerais-irc-pagamento-conta',
    name: 'IRC/Pag. Por conta',
    type: 'expense',
    parentId: 'expense-impostos-gerais',
    level: 3
  },
  {
    id: 'expense-impostos-gerais-multas',
    name: 'Multas',
    type: 'expense',
    parentId: 'expense-impostos-gerais',
    level: 3
  },
  
  // IMPOSTOS GERAIS > IRC/PAG. POR CONTA - Nível 4
  {
    id: 'expense-impostos-gerais-irc-pagamento-conta-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-impostos-gerais-irc-pagamento-conta',
    level: 4
  },
  
  // IMPOSTOS GERAIS > MULTAS - Nível 4
  {
    id: 'expense-impostos-gerais-multas-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-impostos-gerais-multas',
    level: 4
  },
  
  // OUTRAS DESPESAS - Nível 3
  {
    id: 'expense-outras-despesas-contabilista',
    name: 'Contabilista',
    type: 'expense',
    parentId: 'expense-outras-despesas',
    level: 3
  },
  {
    id: 'expense-outras-despesas-jantares-almocos',
    name: 'Jantares / almoços',
    type: 'expense',
    parentId: 'expense-outras-despesas',
    level: 3
  },
  {
    id: 'expense-outras-despesas-marketing-publicidade',
    name: 'Marketing / Publicidade',
    type: 'expense',
    parentId: 'expense-outras-despesas',
    level: 3
  },
  {
    id: 'expense-outras-despesas-banco',
    name: 'Banco',
    type: 'expense',
    parentId: 'expense-outras-despesas',
    level: 3
  },
  {
    id: 'expense-outras-despesas-telemoveis',
    name: 'Telemóveis',
    type: 'expense',
    parentId: 'expense-outras-despesas',
    level: 3
  },
  {
    id: 'expense-outras-despesas-comissoes-externas',
    name: 'Comissões externas',
    type: 'expense',
    parentId: 'expense-outras-despesas',
    level: 3
  },
  {
    id: 'expense-outras-despesas-juridicas',
    name: 'Despesas jurídicas',
    type: 'expense',
    parentId: 'expense-outras-despesas',
    level: 3
  },
  {
    id: 'expense-outras-despesas-taxas',
    name: 'Taxas',
    type: 'expense',
    parentId: 'expense-outras-despesas',
    level: 3
  },
  {
    id: 'expense-outras-despesas-representacao',
    name: 'Despesas de representação',
    type: 'expense',
    parentId: 'expense-outras-despesas',
    level: 3
  },
  {
    id: 'expense-outras-despesas-erros-trabalho',
    name: 'Erros trabalho',
    type: 'expense',
    parentId: 'expense-outras-despesas',
    level: 3
  },
  {
    id: 'expense-outras-despesas-diversos',
    name: 'Diversos',
    type: 'expense',
    parentId: 'expense-outras-despesas',
    level: 3
  },
  
  // OUTRAS DESPESAS > CONTABILISTA - Nível 4
  {
    id: 'expense-outras-despesas-contabilista-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-outras-despesas-contabilista',
    level: 4
  },
  
  // OUTRAS DESPESAS > JANTARES / ALMOÇOS - Nível 4
  {
    id: 'expense-outras-despesas-jantares-almocos-clientes',
    name: 'Clientes',
    type: 'expense',
    parentId: 'expense-outras-despesas-jantares-almocos',
    level: 4
  },
  {
    id: 'expense-outras-despesas-jantares-almocos-fornecedores',
    name: 'Fornecedores',
    type: 'expense',
    parentId: 'expense-outras-despesas-jantares-almocos',
    level: 4
  },
  
  // OUTRAS DESPESAS > MARKETING / PUBLICIDADE - Nível 4
  {
    id: 'expense-outras-despesas-marketing-publicidade-envelopes',
    name: 'Envelopes',
    type: 'expense',
    parentId: 'expense-outras-despesas-marketing-publicidade',
    level: 4
  },
  {
    id: 'expense-outras-despesas-marketing-publicidade-outros',
    name: 'Outros',
    type: 'expense',
    parentId: 'expense-outras-despesas-marketing-publicidade',
    level: 4
  },
  
  // OUTRAS DESPESAS > BANCO - Nível 4
  {
    id: 'expense-outras-despesas-banco-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-outras-despesas-banco',
    level: 4
  },
  
  // OUTRAS DESPESAS > TELEMÓVEIS - Nível 4
  {
    id: 'expense-outras-despesas-telemoveis-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-outras-despesas-telemoveis',
    level: 4
  },
  
  // OUTRAS DESPESAS > COMISSÕES EXTERNAS - Nível 4
  {
    id: 'expense-outras-despesas-comissoes-externas-ze-santos',
    name: 'Ze Santos',
    type: 'expense',
    parentId: 'expense-outras-despesas-comissoes-externas',
    level: 4
  },
  {
    id: 'expense-outras-despesas-comissoes-externas-abilio',
    name: 'Abilio',
    type: 'expense',
    parentId: 'expense-outras-despesas-comissoes-externas',
    level: 4
  },
  
  // OUTRAS DESPESAS > DESPESAS JURÍDICAS - Nível 4
  {
    id: 'expense-outras-despesas-juridicas-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-outras-despesas-juridicas',
    level: 4
  },
  
  // OUTRAS DESPESAS > TAXAS - Nível 4
  {
    id: 'expense-outras-despesas-taxas-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-outras-despesas-taxas',
    level: 4
  },
  
  // OUTRAS DESPESAS > DESPESAS DE REPRESENTAÇÃO - Nível 4
  {
    id: 'expense-outras-despesas-representacao-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-outras-despesas-representacao',
    level: 4
  },
  
  // OUTRAS DESPESAS > ERROS TRABALHO - Nível 4
  {
    id: 'expense-outras-despesas-erros-trabalho-carlos',
    name: 'Carlos',
    type: 'expense',
    parentId: 'expense-outras-despesas-erros-trabalho',
    level: 4
  },
  {
    id: 'expense-outras-despesas-erros-trabalho-morais',
    name: 'Morais',
    type: 'expense',
    parentId: 'expense-outras-despesas-erros-trabalho',
    level: 4
  },
  {
    id: 'expense-outras-despesas-erros-trabalho-leandro',
    name: 'Leandro',
    type: 'expense',
    parentId: 'expense-outras-despesas-erros-trabalho',
    level: 4
  },
  {
    id: 'expense-outras-despesas-erros-trabalho-fernando',
    name: 'Fernando',
    type: 'expense',
    parentId: 'expense-outras-despesas-erros-trabalho',
    level: 4
  },
  
  // OUTRAS DESPESAS > DIVERSOS - Nível 4
  {
    id: 'expense-outras-despesas-diversos-geral',
    name: 'Geral',
    type: 'expense',
    parentId: 'expense-outras-despesas-diversos',
    level: 4
  }
];

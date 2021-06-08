export interface RegistroInfo {
  id: number;
  tipo: 'RegistroFinanceiroRh' | 'RegistroFinanceiroRm';
  projetoId: number;
  mesReferencia: Date;
  atividadeRealizada: string;
  observacaoInterna: string;
  funcaoEtapa: string;
  nomeItem: null;
  beneficiado: null;
  cnpjBeneficiado: null;
  equipaLaboratorioExistente: null;
  equipaLaboratorioNovo: null;
  isNacional: null;
  status: 'Pendente' | 'Aprovado' | 'Reprovado';
  tipoDocumento: string;
  numeroDocumento: string;
  dataDocumento: Date;
  recurso: string;
  recursoHumanoId: number;
  recursoMaterialId: null;
  financiadoraId: number;
  coExecutorFinanciadorId: null;
  recebedoraId: null;
  coExecutorRecebedorId: number;
  categoriaContabilId: null;
  categoriaContabil: string;
  financiador: string;
  recebedor: string;
  valor: number;
  custo: number;
  quantidadeHoras: number;
}

export interface Registro {
  id: number;
  tipo: 'RegistroFinanceiroRh' | 'RegistroFinanceiroRm';
  projetoId: number;
  status: 'Pendente' | 'Aprovado' | 'Reprovado';
  financiadoraId: number;
  coExecutorFinanciadorId: null;
  financiadora: null;
  mesReferencia: Date;
  tipoDocumento: string;
  numeroDocumento: string;
  dataDocumento: Date;
  atividadeRealizada: string;
  recursoHumanoId: number;
  recursoHumano: string;
  horas: number;
  nomeItem: null;
  beneficiado: null;
  recursoMaterialId: number;
  recursoMaterial: null;
  cnpjBeneficiado: null;
  categoriaContabilId: number;
  categoriaContabil: null;
  equipaLaboratorioExistente: boolean;
  equipaLaboratorioNovo: boolean;
  isNacional: boolean;
  quantidade: number;
  valor: number;
  especificaoTecnica: null;
  funcaoEtapa: null;
  recebedoraId: null;
  recebedora: null;
  coExecutorRecebedorId: null;
  coExecutorRecebedor: null;
}

export interface RegistroObservacao {
  createdAt: Date;
  registroId: number;
  authorId: string;
  author: string;
  content: string;
  id: number;
}

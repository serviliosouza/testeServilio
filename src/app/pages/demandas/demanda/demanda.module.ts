import {NgModule} from '@angular/core';

import {DemandaComponent} from './demanda.component';
import {DocumentoAprovacoesComponent} from './documento-aprovacoes/documento-aprovacoes.component';
import {AprovacaoComponent} from './aprovacao/aprovacao.component';
import {EquipeValidacaoComponent} from './equipe-validacao/equipe-validacao.component';
import {FormEditorComponent} from '@app/pages/demandas/demanda/form-editor/form-editor.component';
import {EtapaAvaliacaoComponent} from './etapa-avaliacao/etapa-avaliacao.component';
import {AvaliarDemandaComponent} from './aprovacao/avaliar-demanda/avaliar-demanda.component';
import {DefinirRevisorComponent} from './aprovacao/definir-revisor/definir-revisor.component';
import {DemandaComentarioComponent} from './demanda-comentarios/demanda-comentario/demanda-comentario.component';
import {DemandaComentariosComponent} from './demanda-comentarios/demanda-comentarios.component';
import {DemandaGuard} from '@app/pages/demandas/demanda/guards/demanda.guard';
import {DemandaLogsComponent} from '@app/pages/demandas/demanda/demanda-logs/demanda-logs.component';
import {LogComponent} from '@app/pages/demandas/demanda/demanda-logs/log.component';
import {FormViewerComponent} from '@app/pages/demandas/demanda/form-viewer/form-viewer.component';
import {HistoricoComponent} from './historico/historico.component';
import {DemandaResolver} from '@app/pages/demandas/demanda/demanda.resolver';
import {CoreModule} from '@app/core';
import {DemandaRoutingModule} from '@app/pages/demandas/demanda/demanda-routing.module';
import {SharedModule} from '@app/dashboard/shared';
import {DashboardModule} from '@app/dashboard';
import {IndexComponent} from '@app/pages/demandas/demanda/index.component';
import {EquipePedResolver} from '@app/resolvers/equipe-ped.resolver';
import {PipesModule} from '@app/core/pipes';

const components = [
  DemandaComponent,
  DemandaComentarioComponent,
  DemandaComentariosComponent,
  DemandaLogsComponent,
  DocumentoAprovacoesComponent,
  EquipeValidacaoComponent,
  FormEditorComponent,
  AprovacaoComponent,
  EtapaAvaliacaoComponent,
  AvaliarDemandaComponent,
  DefinirRevisorComponent,
  LogComponent,
  FormViewerComponent,
  HistoricoComponent
];

@NgModule({
  imports: [CoreModule, DemandaRoutingModule, SharedModule, DashboardModule, PipesModule],
  declarations: [...components, IndexComponent],
  exports: [...components],
  providers: [DemandaGuard, DemandaResolver, EquipePedResolver],
})
export class DemandaModule {
}

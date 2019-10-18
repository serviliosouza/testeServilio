import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PainelDemandasComponent } from './painel-demandas.component';


const routes: Routes = [
  {
    path: '',
    component: PainelDemandasComponent,
    children: [
      {
        path: '',
        redirectTo: 'gestao-de-demandas',
        pathMatch: 'full'
      },
      {
        path: 'configuracoes-do-sistema',
        loadChildren: '@app/dashboard/painel-demandas/configuracoes-sistema/configuracoes-sistema.module#ConfiguracoesSistemaModule'
      }
    ]
  },

  {
    path: 'demanda',
    loadChildren: '@app/dashboard/painel-demandas/demanda/demanda.module#DemandaModule'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PainelDemandasRoutingModule { }

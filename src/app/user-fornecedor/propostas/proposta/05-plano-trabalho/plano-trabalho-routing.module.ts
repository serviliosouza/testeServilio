import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PlanoTrabalhoComponent} from '@app/user-fornecedor/propostas/proposta/05-plano-trabalho/plano-trabalho.component';
import {PlanoTrabalhoResolver} from '@app/user-fornecedor/resolvers/plano-trabalho.resolver';


const routes: Routes = [
  {
    path: '',
    component: PlanoTrabalhoComponent,
    resolve: {
      plano: PlanoTrabalhoResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanoTrabalhoRoutingModule {
}

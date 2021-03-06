import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AdministrativoComponent} from '@app/pages/projetos/projeto/administrativo/administrativo.component';
import {LogsDutoComponent} from '@app/pages/projetos/projeto/administrativo/logs-duto/logs-duto.component';
import {RepositorioXmlComponent} from '@app/pages/projetos/projeto/administrativo/repositorio-xml/repositorio-xml.component';
import {AlterarSatusComponent} from '@app/pages/projetos/projeto/administrativo/alterar-satus/alterar-satus.component';
import {GeradorXmlComponent} from './gerador-xml/gerador-xml.component';

const routes: Routes = [
  {
    path: '',
    component: AdministrativoComponent,
    children: [
      {
        path: '',
        redirectTo: 'logs-duto'
      },
      {
        path: 'gerador-xml',
        component: GeradorXmlComponent,
      },
      {
        path: 'logs-duto',
        component: LogsDutoComponent,
        resolve: {
          logs: 'projetoLogsDuto'
        }
      },
      {
        path: 'repositorio-xml',
        component: RepositorioXmlComponent,
        resolve: {
          xmls: 'projetoXmls',
        }
      },
      {
        path: 'status',
        canActivate: ['isAdmin'],
        component: AlterarSatusComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrativoRoutingModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NovoProjetoComponent } from './novo-projeto/novo-projeto.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProjetoCardComponent } from './projeto-card/projeto-card.component';
import { RouterModule } from '@angular/router';
import { ProdutoFormComponent } from './produto-form/produto-form.component';
import { EtapaFormComponent } from './etapa-form/etapa-form.component';
import { EmpresaFormComponent } from './empresa-form/empresa-form.component';
import { RecursoHumanoFormComponent } from './recurso-humano-form/recurso-humano-form.component';
import { AlocarRecursoHumanoFormComponent } from './alocar-recurso-humano-form/alocar-recurso-humano-form.component';
import { RecursoMaterialFormComponent } from './recurso-material-form/recurso-material-form.component';
import { AlocarRecursoMaterialFormComponent } from './alocar-recurso-material-form/alocar-recurso-material-form.component';



@NgModule({
    declarations: [
        NovoProjetoComponent,
        ProjetoCardComponent,
        ProdutoFormComponent,
        EtapaFormComponent,
        EmpresaFormComponent,
        RecursoHumanoFormComponent,
        AlocarRecursoHumanoFormComponent,
        RecursoMaterialFormComponent,
        AlocarRecursoMaterialFormComponent,
    ],
    entryComponents: [
        NovoProjetoComponent,
        ProdutoFormComponent,
        EtapaFormComponent,
        EmpresaFormComponent,
        RecursoHumanoFormComponent,
        AlocarRecursoHumanoFormComponent,
        RecursoMaterialFormComponent,
        AlocarRecursoMaterialFormComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        RouterModule
    ],
    exports: [
        NovoProjetoComponent, ProjetoCardComponent
    ]
})
export class ProjetosModule { }

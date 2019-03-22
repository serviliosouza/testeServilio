import { Component, OnInit, ViewChild } from '@angular/core';
import { AlocarRecursoMaterialFormComponent } from '@app/projetos/projeto/common/alocar-recurso-material-form/alocar-recurso-material-form.component';
import { ProjetosService } from '@app/projetos/projetos.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap } from 'rxjs/operators';
import { Projeto, AlocacaoRM, CategoriasContabeis, EmpresaProjeto } from '@app/models';
import { zip, of } from 'rxjs';
import { AppService } from '@app/app.service';
import { LoadingComponent } from '@app/shared/loading/loading.component';
import { EmpresaProjetoFacade, ProjetoFacade } from '@app/facades';

@Component({
    selector: 'app-alocacao',
    templateUrl: './alocacao.component.html',
    styleUrls: []
})
export class AlocacaoComponent implements OnInit {

    categoriaContabel = CategoriasContabeis;
    alocacoes: Array<any>;
    projeto: ProjetoFacade;

    listOrder: { field: string; direction: 'asc' | 'desc'; } = {
        field: 'recursoMaterial.nome',
        direction: 'asc'
    };

    @ViewChild(LoadingComponent) loading: LoadingComponent;

    constructor(protected app: AppService) { }

    ngOnInit() {
        this.loadData();
    }

    async loadData() {

        this.loading.show();

        const data$ = this.app.projetos.projetoLoaded.pipe(
            mergeMap((p: ProjetoFacade) => zip(
                of(p),
                p.REST.AlocacaoRms.listar<Array<any>>(),
                p.REST.Empresas.listar<Array<EmpresaProjeto>>().pipe(map(empresas => empresas.map(e => new EmpresaProjetoFacade(e))))
            ))
        );

        const categoriasContabeisGestao = <Array<any>>await this.app.catalogo.categoriasContabeisGestao().toPromise();

        data$.subscribe(([projeto, alocacoes, empresas]) => {
            this.projeto = projeto;

            if (this.projeto.isPG) {
                this.categoriaContabel = categoriasContabeisGestao.map(cat => {
                    return { text: cat.nome, value: String(cat.id), atividades: cat.atividades };
                });
            }
            this.alocacoes = alocacoes.map(aloc => {

                if (aloc.empresaFinanciadoraId) {
                    const empresa = empresas.find(e => aloc.empresaFinanciadoraId === e.id);
                    aloc.empresaFinanciadoraNome = empresa ? empresa.nome : "Não encontrada";
                }

                if (aloc.recursoMaterial) {
                    try {
                        if (this.projeto.isPD) {
                            aloc.categoriaContabelNome = this.categoriaContabel.find(e => aloc.recursoMaterial.categoriaContabilValor === e.value).text;
                        } else {
                            aloc.categoriaContabelNome = this.categoriaContabel.find(e => String(aloc.recursoMaterial.catalogCategoriaContabilGestaoId) === e.value).text;
                        }
                    } catch (err) {
                        aloc.categoriaContabelNome = "Não encontrado";
                    }
                }

                aloc.valorTotal = aloc.qtd * aloc.recursoMaterial.valorUnitario;

                return aloc;
            });
            this.loading.hide();
        });
    }

    openModal(alocacao: AlocacaoRM | {} = {}) {
        const modalRef = this.app.modal.open(AlocarRecursoMaterialFormComponent, { size: 'lg' });
        modalRef.componentInstance.alocacao = alocacao;
        modalRef.componentInstance.projeto = this.projeto;

        modalRef.result.then(result => {
            this.loadData();

        }, e => {

        });

    }

    order(data: { field: string; direction: 'asc' | 'desc'; }) {
        this.listOrder = data;
    }

}

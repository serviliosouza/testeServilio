import { Component, OnInit } from '@angular/core';
import { AppService } from '@app/app.service';
import { ProjetoFacade, EmpresaProjetoFacade } from '@app/facades';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ExtratoItem, EmpresaProjeto, TextValue, CategoriasContabeis } from '@app/models';
import { zip } from 'rxjs';
import { AlocarRecursoHumanoFormComponent } from '../../common/alocar-recurso-humano-form/alocar-recurso-humano-form.component';
import { AlocarRecursoMaterialFormComponent } from '../../common/alocar-recurso-material-form/alocar-recurso-material-form.component';

@Component({
    selector: 'app-orcamento-atividades',
    templateUrl: './orcamento-atividades.component.html',
    styles: []
})
export class OrcamentoAtividadesComponent implements OnInit {

    projeto: ProjetoFacade;
    relatorio: any;
    empresas: Array<EmpresaProjetoFacade>;
    alocacoesRH: Array<any> = [];
    alocacoesRM: Array<any> = [];
    categoriasContabeis: { [propName: string]: TextValue } = {
        "RH": { text: "Recursos Humanos", value: "RH" }
    };

    constructor(protected app: AppService) {
        CategoriasContabeis.forEach(c => {
            this.categoriasContabeis[c.value] = c;
        });
    }
    get extratoAtividades() {
        return this.relatorio ? this.relatorio.atividades : [];
    }

    categoriaPorCod(cod) {
        if (this.categoriasContabeis[cod]) {
            return this.categoriasContabeis[cod].text;
        }
        return '';
    }

    get totalGeral() {
        return this.relatorio ? this.relatorio.valor : 0;
    }

    ngOnInit() {
        this.app.projetos.projetoLoaded.subscribe(projeto => {
            this.projeto = projeto;
            this.load();
        });
    }

    load() {
        const relatorio$ = this.projeto.getOrcamentoAtividades(); // this.app.projetos.getOrcamentoEmpresas(this.projeto.id);
        // const empresas$ = this.projeto.REST.Empresas.listar<Array<EmpresaProjeto>>();
        const categoriasContabeis$ = this.app.catalogo.categoriasContabeisGestao();
        zip(relatorio$, categoriasContabeis$, this.projeto.REST.AlocacaoRhs.listar<Array<any>>(), this.projeto.REST.AlocacaoRms.listar<Array<any>>())
            .subscribe(([relatorio, categoriasContabeis, AlocacaoRhs, AlocacaoRms]) => {
                this.alocacoesRH = AlocacaoRhs;
                this.alocacoesRM = AlocacaoRms;
                // this.empresas = empresas.map(e => new EmpresaProjetoFacade(e));
                this.relatorio = relatorio;
                this.relatorio.atividades.forEach(atividade => {
                    atividade.empresas = atividade.empresas.map(empresa => {
                        empresa.empresa = new EmpresaProjetoFacade(empresa.empresa);
                        return empresa;
                    });
                });
                categoriasContabeis.forEach(c => {
                    this.categoriasContabeis[c.valor] = { text: c.nome, value: c.id };
                });
            });
    }

    empresaRecebedoraFromItem(item) {
        try {

            const id = item.alocacaoRm ? item.alocacaoRm.empresaRecebedoraId : item.alocacaoRh.empresaId;
            const empresa = this.empresas.find(e => e.id === id);
            if (id === undefined) {
                console.log({ item, empresa, id, empresas: this.empresas });
            }

            if (empresa) {
                return empresa.nome;
            }
        } catch (e) {

        }
        return "Não encontrado";
    }

    openModal(item: ExtratoItem) {
        let modal: NgbModalRef;

        if (item.recursoHumano) {
            const alocacao = this.alocacoesRH.find(a => a.id === item.alocacaoId);
            modal = this.app.modal.open(AlocarRecursoHumanoFormComponent, { size: 'lg' });
            modal.componentInstance.alocacao = alocacao;

        } else if (item.recursoMaterial) {
            const alocacao = this.alocacoesRM.find(a => a.id === item.alocacaoId);
            modal = this.app.modal.open(AlocarRecursoMaterialFormComponent, { size: 'lg' });
            modal.componentInstance.alocacao = alocacao;
        }

        if (modal) {
            modal.componentInstance.projeto = this.projeto;
            modal.result.then(result => {
                console.log(result);
            }, error => {

            });
        }
    }
    orcamentoGerarCSV() {
        this.projeto.orcamentoGerarCSV().subscribe(result => {

        }, error => {
            this.app.alert("Não foi possível gerar o relatório", "Erro!");
            console.log({ error });

        });
    }

}

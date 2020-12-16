import { Component, OnInit, ViewChild } from '@angular/core';
import { RecursoHumanoFormComponent } from '@app/dashboard/projeto/common/recursos-humanos/recurso-humano-form/recurso-humano-form.component';
import { map, mergeMap } from 'rxjs/operators';
import { AppService } from '@app/services/app.service';
import { zip, of } from 'rxjs';
import { Projeto, RecursoHumano, Funcoes, Graduacoes, EmpresaProjeto } from '@app/commons';
import { LoadingComponent } from '@app/core/components/loading/loading.component';
import { EmpresaFacade, EmpresaProjetoFacade, ProjetoFacade, RecursoHumanoFacade } from '@app/facades/index';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-recursos-humanos',
  templateUrl: './recursos-humanos.component.html',
  styles: []
})
export class RecursosHumanosComponent implements OnInit {

  recursosHumano: Array<RecursoHumano>;
  projeto: ProjetoFacade;

  listOrder: { field: string; direction: 'asc' | 'desc'; } = {
    field: 'nomeCompleto',
    direction: 'asc'
  };

  @ViewChild(LoadingComponent, { static: true }) loading: LoadingComponent;

  constructor(protected app: AppService, protected modal: NgbModal) {
  }

  openModal(recurso_humano: RecursoHumano | any = {}) {
    const modalRef = this.modal.open(RecursoHumanoFormComponent, { size: 'lg' });
    modalRef.componentInstance.recursoHumano = recurso_humano;
    modalRef.componentInstance.projeto = this.projeto;

    modalRef.result.then(result => {
      this.loadData(true);
    }, e => {
      //
    });
  }

  async ngOnInit() {
    this.projeto = await this.app.projetos.getCurrent();
    this.loadData();
  }

  async loadData(clearCache = false) {

    this.loading.show();

    if (clearCache) {
      this.projeto.REST.RecursoHumanos.clearCache();
    }
    const recursos_humanos = await this.projeto.REST.RecursoHumanos.listar<Array<any>>().toPromise();

    this.recursosHumano = recursos_humanos.map(rec => {
      rec.funcaoNome = Funcoes.find(e => rec.funcaoValor === e.value).text;
      rec.titulacaoNome = Graduacoes.find(e => rec.titulacaoValor === e.value).text;
      if (!(rec.empresa instanceof EmpresaProjetoFacade)) {
        rec.empresa = new EmpresaProjetoFacade(<EmpresaProjeto>rec.empresa);
      }

      return rec;
    });

    this.loading.hide();

  }

  order(data: { field: string; direction: 'asc' | 'desc'; }) {
    this.listOrder = data;
  }

}

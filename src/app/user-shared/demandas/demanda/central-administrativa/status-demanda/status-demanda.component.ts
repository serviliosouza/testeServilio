import {Component, Inject, OnInit} from '@angular/core';
import {DemandaEtapa} from '@app/user-shared/demandas/commons';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AppService} from '@app/services/app.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute} from '@angular/router';
import {Demanda} from '@app/commons/demandas';
import {DEMANDA} from '@app/user-shared/demandas/demanda/providers';

@Component({
  selector: 'app-status-demanda',
  templateUrl: './status-demanda.component.html',
  styleUrls: ['./status-demanda.component.scss']
})
export class StatusDemandaComponent implements OnInit {
  form = new FormGroup({
    status: new FormControl('', Validators.required)
  });
  menuStatusEtapas = [
    {value: DemandaEtapa.Elaboracao, text: 'Elaboração Demanda'},
    {value: DemandaEtapa.PreAprovacao, text: 'Pre-Aprovação'},
    {value: DemandaEtapa.RevisorPendente, text: 'Revisor Pendente'},
    {value: DemandaEtapa.AprovacaoRevisor, text: 'Aprovação Revisor'},
    {value: DemandaEtapa.AprovacaoCoordenador, text: 'Aprovação Coordenador'},
    {value: DemandaEtapa.AprovacaoGerente, text: 'Aprovação Gerente'},
    {value: DemandaEtapa.AprovacaoDiretor, text: 'Aprovação Diretor'},
    {value: DemandaEtapa.Captacao, text: 'Captação'},
  ];

  constructor(
    @Inject(DEMANDA) protected demanda: Demanda,
    private app: AppService, protected route: ActivatedRoute) {

  }

  ngOnInit() {
    this.form.get('status').setValue(this.demanda.etapaAtual);
  }

  async saveStatus() {
    this.app.showLoading();
    try {
      await this.app.demandas.setEtapa(this.demanda.id, this.form.value);
    } catch (e) {
      console.error(e);
    }
    this.app.hideLoading();
  }
}

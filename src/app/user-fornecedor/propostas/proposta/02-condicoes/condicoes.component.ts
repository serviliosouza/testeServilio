import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseEntity, ROOT_URL} from '@app/commons';
import {AppService} from '@app/services';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalComponent} from '@app/user-fornecedor/propostas/proposta/02-condicoes/modal/modal.component';
import {PropostasService} from '@app/user-fornecedor/services/propostas.service';
import {PropostaComponent} from '@app/user-fornecedor/propostas/proposta/proposta.component';

@Component({
  templateUrl: './condicoes.component.html',
  styleUrls: ['./condicoes.component.scss']
})
export class CondicoesComponent implements OnInit {

  clausulas: Array<BaseEntity>;
  clausulasAceitas: Map<number, boolean> = new Map<number, boolean>();
  indiceAtual = 0;

  get proposta() {
    return this.parent.proposta;
  }

  get clausulaAceita() {
    return this.clausulasAceitas.has(this.indiceAtual) && this.clausulasAceitas.get(this.indiceAtual);
  }

  constructor(
    @Inject(ROOT_URL) protected root_url: string,
    protected router: Router,
    protected route: ActivatedRoute,
    protected app: AppService, protected modal: NgbModal,
    protected propostasService: PropostasService,
    protected parent: PropostaComponent
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.clausulas = (data.clausulas as Array<BaseEntity>).sort((a, b) => Math.sign(a.ordem - b.ordem));
    });
  }

  clausulaAnterior() {
    if (this.indiceAtual > 0) {
      this.indiceAtual--;
    } else {
      this.indiceAtual = this.clausulas.length - 1;
    }
  }


  proximaClausulaPendente() {
    if (this.clausulasAceitas.size === this.clausulas.length) {
      return;
    }
    const i = this.clausulas.findIndex((b, idx) => !this.clausulasAceitas.has(idx));
    this.indiceAtual = i >= 0 ? i : this.indiceAtual;
  }

  proximaClausula() {
    this.indiceAtual++;
    this.indiceAtual = this.indiceAtual % this.clausulas.length;
  }

  concordar() {
    this.clausulasAceitas.set(this.indiceAtual, true);
    if (this.clausulasAceitas.size === this.clausulas.length) {
      this.finalizar().then();
    }
    this.proximaClausulaPendente();
  }

  async discordar() {
    const ref = this.modal.open(ModalComponent, {size: 'lg'});
    const result = await ref.result;
    if (result) {
      const clausula = this.clausulas[this.indiceAtual];
      if (clausula) {
        const proposta = await this.propostasService.rejeitarCondicoes(this.proposta.captacaoId, clausula.id);
        this.parent.proposta.participacao = proposta.participacao;
        this.router.navigate([this.root_url]).then();
      }
    }
  }

  async finalizar() {
    if (this.clausulas.length === this.clausulasAceitas.size) {
      const proposta = await this.propostasService.aceitarCondicoes(this.proposta.captacaoId);
      this.parent.proposta.dataClausulasAceitas = proposta.dataClausulasAceitas;
      await this.app.alert('Proposta atualizada com sucesso!');
      await this.router.navigate([this.root_url]);
      await this.router.navigate([this.root_url, 'propostas', this.proposta.captacaoId]);
    } else {
      throw new Error('Finalizar foi chamado sem ter todas as clausulas aceitas');
    }


  }


}

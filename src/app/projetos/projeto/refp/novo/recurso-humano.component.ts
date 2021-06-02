import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CurrencyPipe} from '@angular/common';
import {ProjetoService} from '@app/projetos/projeto/services/projeto.service';
import {Projeto} from '@app/projetos/projeto/projeto.component';
import {LoadingController} from '@app/services';

@Component({
  selector: 'app-recurso-humano',
  templateUrl: './recurso-humano.component.html',
  styles: []
})
export class RecursoHumanoComponent implements OnInit {
  projeto: Projeto;
  file: File;
  valorHora = 0;
  custo: any;
  data: { etapas: any[], meses: any[], colaboradores: any[], recursos: any[], coexecutores: any[], empresas: any[] };

  recursoHumanoCtrl = this.fb.control('', [Validators.required]);
  horasCtrl = this.fb.control('', [Validators.required, Validators.min(1)]);

  financiadoraCtrl = this.fb.control('');
  coExecutorFinanciadorCtrl = this.fb.control('');

  form = this.fb.group({
    recursoHumanoId: this.recursoHumanoCtrl,
    horas: this.horasCtrl,
    atividadeRealizada: ['', Validators.required],
    //
    etapaId: ['', Validators.required],
    financiadoraId: this.financiadoraCtrl,
    coExecutorFinanciadorId: this.coExecutorFinanciadorCtrl,
    mesReferencia: ['', Validators.required],
    tipoDocumento: ['', Validators.required],
    numeroDocumento: ['', Validators.required],
    dataDocumento: ['', Validators.required],
    observacaoInterna: ['', Validators.required],
  }, {
    validators: form => {
      if (form.value.financiadoraId === '' && form.value.coExecutorFinanciadorId === '') {
        return {financiador: true};
      }
      return null;
    }
  });

  constructor(protected fb: FormBuilder,
              protected router: Router,
              protected route: ActivatedRoute, protected service: ProjetoService,
              protected loading: LoadingController) {
  }

  ngOnInit(): void {
    this.service.projeto.subscribe(p => this.projeto = p);
    this.route.data.subscribe(data => {
      this.data = data.items;
    });
    this.recursoHumanoCtrl.valueChanges.subscribe(id => {
      this.valorHora = this.data.colaboradores.find(_c => _c.id === parseFloat(id))?.valorHora || 0;
      this.updateCusto(this.horasCtrl.value);
    });
    this.horasCtrl.valueChanges.subscribe(value => {
      this.updateCusto(value);
    });
    this.updateCusto(0);
  }

  updateFinanciador(cod: string) {
    this.financiadoraCtrl.setValue('');
    this.coExecutorFinanciadorCtrl.setValue('');
    if (cod.length > 0) {

      const [type, id] = cod.split('-');

      if (type === 'e') {
        this.financiadoraCtrl.setValue(id);
      } else {
        this.coExecutorFinanciadorCtrl.setValue(id);
      }
    }


  }

  updateCusto(value) {
    const custo = this.valorHora * parseFloat(value) || 0;
    const p = new CurrencyPipe('pt-BR', 'R$');
    this.custo = p.transform(custo);

  }

  fileChange(evt: Event) {
    const files = (evt.target as HTMLInputElement).files;
    this.file = files.length > 0 ? files.item(0) : null;
  }

  async submit() {
    if (this.form.invalid || this.file === null) {
      return;
    }
    try {
      this.loading.show().then();
      const registro = await this.service.post(`${this.projeto.id}/RegistroFinanceiro/RecursoHumano`, this.form.value);
      await this.service.upload([this.file], `${this.projeto.id}/RegistroFinanceiro/${registro.id}/Comprovante`);
      this.router.navigate(['..', '..', 'pendente']).then();
    } catch (e) {
      console.error(e);
    } finally {
      this.loading.hide();
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { AtividadesComponent } from '../../proposta/atividades/atividades.component';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ProjetoGestaoAtividades } from '@app/models';

@Component({
    selector: 'app-relatorio-atividades',
    templateUrl: './relatorio-atividades.component.html',
    styles: []
})
export class RelatorioAtividadesComponent extends AtividadesComponent {
    disabled = true;

    setup() {
        this.loading.show();
        this.projeto.REST.AtividadesGestao.listar<ProjetoGestaoAtividades>().subscribe(atividades => {
            this.form = new FormGroup({});

            this.atividades.forEach(atividade => {
                this.form.addControl(atividade.formName, new FormControl({ value: '', disabled: this.disabled }, Validators.required));
            });
            if (atividades) {
                this.form.addControl('id', new FormControl(atividades.id));
                this.projetoAtividades = atividades;
                try {
                    this.form.patchValue(atividades);
                } catch (e) {
                    console.log(e);

                }
            } else {
                this.form.addControl('projetoId', new FormControl(this.projeto.id));
            }
            this.loading.hide();
        });
    }
}

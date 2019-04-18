import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {FormGroup, FormControl, Validators, FormArray} from '@angular/forms';

import * as moment from 'moment';
import {zip, of} from 'rxjs';

import {AppService} from '@app/app.service';
import {RecursoHumano, Projeto, Empresa, TiposDoc, EmpresaProjeto, Etapa, TextValue, RecursoMaterial, AppValidators, CategoriasContabeis, NoRequest} from '@app/models';
import {ProjetoFacade, EmpresaProjetoFacade} from '@app/facades';
import {LoadingComponent} from '@app/shared/loading/loading.component';
import {tap, map} from 'rxjs/operators';
import {isNil} from 'lodash-es';

@Component({
    selector: 'app-recurso-material',
    templateUrl: './recurso-material.component.html',
    styles: []
})
export class RecursoMaterialComponent implements OnInit {

    etapas: Array<Etapa>;
    projeto: ProjetoFacade;
    recursos: Array<RecursoMaterial>;
    recurso: FormControl;

    empresas: Array<EmpresaProjetoFacade>;
    empresasFinanciadoras: Array<EmpresaProjetoFacade>;
    // empresasRecebedoras: Array<{ id: number; nome: string; classificacao: string; }>;
    tipoDocs = TiposDoc;
    form: FormGroup;
    obsInternas: FormGroup;
    mesesRef: Array<TextValue>;
    categoriasContabeis: Array<{ text: string; value: string; atividades: Array<any> }>;

    errors: Array<Error>;
    isValid = true;

    @ViewChild(LoadingComponent) loading: LoadingComponent;
    @ViewChild('file') file: ElementRef;

    get empresasRecebedoras(): Array<EmpresaProjetoFacade> {
        if (this.empresas === undefined) {
            return [];
        }
        return this.empresas.filter(empresa => {
            if (empresa.classificacaoValor.match(/(Energia|Proponente)/)) {
                const financiadora = this.form.get('empresaFinanciadoraId');
                return empresa.id === parseInt(financiadora.value, 10);
            } else {
                return empresa.classificacaoValor === 'Executora';
            }
        });
    }

    get categoriaContabil() {
        return this.form.get(this.projeto.isPG ? 'catalogCategoriaContabilGestaoId' : 'categoriaContabil');
    }

    get qtdItens() {
        return this.form.get('qtdItens');
    }

    get valorUnitario() {
        return this.form.get('valorUnitario');
    }

    get valorFinal() {
        if (this.qtdItens && this.valorUnitario) {
            return parseFloat(this.qtdItens.value) * parseFloat(this.valorUnitario.value);
        }
        return 0;
    }

    get atividades() {
        if (this.projeto.isPD || this.form === undefined) {
            return [];
        }

        try {
            const c = this.categoriasContabeis.find(c => String(c.value) === this.categoriaContabil.value);
            return c ? c.atividades.map(a => {
                return {text: a.nome, value: a.id};
            }) : [];
        } catch (e) {

            return [];
        }

    }

    constructor(protected app: AppService) {
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.app.projetos.projetoLoaded.subscribe(projeto => {
            this.projeto = projeto;

            const recursos$ = this.projeto.relations.recursosMateriais.get();
            const empresas$ = this.projeto.REST.Empresas.listar<Array<EmpresaProjetoFacade>>();
            const etapas$ = this.projeto.relations.etapas.get(); // this.projeto.isPD ? this.projeto.relations.etapas.get() : of([]);
            const categorias$ = this.projeto.isPD ? of(CategoriasContabeis) :
                this.app.catalogo.categoriasContabeisGestao().pipe(map(cats => {
                    return cats.map(c => {
                        return {
                            text: c.nome,
                            value: c.id,
                            atividades: c.atividades
                        };
                    });
                }));

            this.loading.show(1000);
            zip(recursos$, empresas$, etapas$, categorias$).subscribe(([recursos, empresas, etapas, categorias]) => {

                this.etapas = etapas ? etapas : [];
                this.recursos = recursos;
                this.empresas = empresas.map(e => new EmpresaProjetoFacade(e));
                this.empresasFinanciadoras = this.empresas.filter(e => e.classificacaoValor !== 'Executora');
                this.categoriasContabeis = categorias;
                try {
                    this.validate();
                    this.buildForm();
                } catch (error) {
                    this.isValid = false;
                }
            });
            // const empresas = this.app.projetos

        });
    }

    validate() {
        this.errors = [];
        if (isNil(this.etapas) || this.etapas.length === 0) {
            this.errors.push(new Error(`Este projeto ainda não tem nenhuma etapa cadastrada. 
            Para inserir um registro REFP é necessário ter etapas cadastradas já que cada registro é vinculado a uma etapa. 
            Por favor, volte para o Planejamento do projeto e cadastre alguma etapa para continuar.`));

        }
        if (isNil(this.recursos) || this.recursos.length === 0) {
            this.errors.push(new Error(`Este projeto ainda não tem nenhum Recurso Material cadastrado. 
            Para inserir um registro REFP é necessário ter Recursos Materiais cadastrados já que cada registro é vinculado a um Recurso Material específico. 
            Por favor, volte para o Planejamento do projeto e cadastre algum Recurso Material para continuar.`));
        }
        if (isNil(this.empresas) || this.empresas.length === 0) {
            this.errors.push(new Error(`Este projeto ainda não tem nenhuma Empresa cadastrada. 
            Para inserir um registro REFP é necessário ter Empresas cadastradas já que cada registro é vinculado a uma Empresa específica. 
            Por favor, volte para o Planejamento do projeto e cadastre alguma Empresa para continuar.`));
        }

        if (this.errors.length > 0) {
            throw new Error('Errors');
        }

    }

    buildForm() {
        this.obsInternas = new FormGroup({
            texto: new FormControl('')
        });

        this.recurso = new FormControl('', [Validators.required]);

        this.mesesRef = [];

        if (this.projeto.isPD) {

            this.etapas.map(etapa => {
                const start = moment(etapa.dataInicio);
                const end = moment(etapa.dataFim);
                while (start.isBefore(end)) {
                    const ano = start.format('YYYY');
                    const mes = start.format('MMMM'); // .padEnd(9, '*').replace(/\*/g, '&nbsp;');
                    this.mesesRef.push({
                        text: `${mes} - ${ano}`,
                        value: start.format('YYYY-MM-DD')
                    });
                    start.add(1, 'months');
                }
            });


        } else {
            const start = moment(this.projeto.dataInicio);
            const end = moment(this.projeto.dataInicio).add(24, 'months');
            while (start.isBefore(end)) {
                const ano = start.format('YYYY');
                const mes = start.format('MMMM'); // .padEnd(9, '*').replace(/\*/g, '&nbsp;');
                this.mesesRef.push({
                    text: `${mes} - ${ano}`,
                    value: start.format('YYYY-MM-DD')
                });
                start.add(1, 'month');
            }
        }

        this.form = new FormGroup({
            projetoId: new FormControl(this.projeto.id),
            tipo: new FormControl('RM'),
            tipoDocumento: new FormControl('', [Validators.required]),
            numeroDocumento: new FormControl('', [Validators.required]),
            dataDocumento: new FormControl('', [Validators.required]),
            nomeItem: new FormControl('', [Validators.required]),
            recursoMaterialId: this.recurso,
            empresaFinanciadoraId: new FormControl('', [Validators.required]),
            beneficiado: new FormControl('', [Validators.required]),
            cnpjBeneficiado: new FormControl('', [Validators.required, AppValidators.cnpj]),
            // categoriaContabil: new FormControl(''),
            // 
            equiparLabExistente: new FormControl(''),
            equiparLabNovo: new FormControl(''),
            itemNacional: new FormControl(''),
            //
            qtdItens: new FormControl(''),
            mes: new FormControl('', [Validators.required]),
            valorUnitario: new FormControl('', [Validators.required]),
            especificacaoTecnica: new FormControl('', [Validators.required]),
            funcaoRecurso: new FormControl('', [Validators.required]),
            obsInternas: new FormArray([this.obsInternas])
        });

        if (this.projeto.isPG) {
            const catalogCategoriaContabilGestaoId = new FormControl('', [Validators.required]);
            this.form.addControl('catalogCategoriaContabilGestaoId', catalogCategoriaContabilGestaoId);
            this.form.addControl('catalogAtividadeId', new FormControl('', [Validators.required]));
            catalogCategoriaContabilGestaoId.valueChanges.subscribe(v => {
                this.form.get('catalogAtividadeId').setValue('');
            });
        } else {
            this.form.addControl('categoriaContabil', new FormControl('', Validators.required));
            this.form.addControl('empresaRecebedoraId', new FormControl('', Validators.required));
        }

        this.categoriaContabil.valueChanges.subscribe(value => {
            if (value === 'MP') {
                this.form.addControl('equiparLabExistente', new FormControl('', [Validators.required]));
                this.form.addControl('equiparLabNovo', new FormControl('', [Validators.required]));
                this.form.addControl('itemNacional', new FormControl('', [Validators.required]));
            } else {
                this.form.removeControl('equiparLabExistente');
                this.form.removeControl('equiparLabNovo');
                this.form.removeControl('itemNacional');
            }
            this.form.updateValueAndValidity();
        });

        this.form.updateValueAndValidity();
    }

    submit() {
        if (this.form.valid) {
            this.loading.show();
            this.app.projetos.criarRegistroREFP(this.form.value).subscribe(result => {

                if (result.sucesso) {
                    this.sendFile(result.id).subscribe(_result => {
                        this.loading.hide();
                        this.form.reset();
                        this.app.alert('Salvo com sucesso!');
                    });
                } else {
                    this.loading.hide();
                    this.app.alert(result.inconsistencias.join(', '));
                }
            });
        }
    }

    changeFile(event) {
    }

    sendFile(id?) {
        const el = this.file.nativeElement as HTMLInputElement;

        if (el.files.length > 0) {
            return this.app.file.upload(el.files.item(0), new FormGroup({
                RegistroFinanceiroId: new FormControl(id),
            })).pipe(tap(result => {
                if (result.sucesso) {
                    this.file.nativeElement.value = '';
                }
            }));
        }

        return of(NoRequest);
    }

}

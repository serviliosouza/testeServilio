import {Component, OnInit, ViewChild} from '@angular/core';
import {AppService} from '@app/services/app.service';
import {Subscription} from 'rxjs';
import {Projeto, FileUploaded} from '@app/commons';
import {LoadingComponent} from '@app/core/components/loading/loading.component';

@Component({
    selector: 'app-repositorio-xml',
    templateUrl: './repositorio-xml.component.html',
    styles: []
})
export class RepositorioXmlComponent implements OnInit {
    projeto: Projeto;
    xmls: Array<FileUploaded> = [];
    listOrder: { field: string; direction: 'asc' | 'desc'; } = {
        field: 'created',
        direction: 'asc'
    };

    @ViewChild(LoadingComponent, { static: true }) loading: LoadingComponent;

    constructor(protected app: AppService) {
    }

    async ngOnInit() {
        this.projeto = await this.app.projetos.getCurrent();
        this.loadXmlList();

    }

    loadXmlList() {
        this.loading.show();
        this.app.projetos.obterXmls(this.projeto.id).subscribe(result => {
            this.loading.hide();
            this.xmls = result;
        }, error => {
            this.loading.hide();
        });
    }

}

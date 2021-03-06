import {NgModule} from '@angular/core';
import {PipesModule} from '@app/core/pipes';
import {DirectivesModule} from '@app/core/directives';
import {AccordionComponent} from '@app/core/components/accordion/accordion.component';
import {AlertComponent} from '@app/core/components/alert/alert.component';
import {ConfirmComponent} from '@app/core/components/confirm/confirm.component';
import {FileUploaderComponent} from '@app/core/components/file-uploader/file-uploader.component';
import {LoadingComponent} from '@app/core/components/loading/loading.component';
import {ModalPageComponent} from '@app/core/components/modal-page/modal-page.component';
import {OrderContentComponent} from '@app/core/components/order-content/order-content.component';
import {OrdersComponent} from '@app/core/components/orders/orders.component';
import {PromptComponent} from '@app/core/components/prompt/prompt.component';
import {TableComponent} from '@app/core/components/table/table.component';
import {SharedModule} from '@app/core/shared';
import {FormsModule} from '@app/core/components/forms';
import {PdfViewerComponent} from '@app/core/components/pdf-viewer/pdf-viewer.component';
import {CrudComponent} from './crud/crud.component';
import {HelpComponent} from '@app/core/components/help/help.component';

const components = [
  CrudComponent,
  AccordionComponent,
  AlertComponent,
  ConfirmComponent,
  FileUploaderComponent,
  HelpComponent,
  LoadingComponent,
  ModalPageComponent,
  OrderContentComponent,
  OrdersComponent,
  PdfViewerComponent,
  PromptComponent,
  TableComponent,
];

@NgModule({
  declarations: [
    ...components,
  ],
  imports: [
    FormsModule,
    SharedModule,
    DirectivesModule,
    PipesModule
  ],
  exports: [...components, FormsModule],

})
export class ComponentsModule {
}

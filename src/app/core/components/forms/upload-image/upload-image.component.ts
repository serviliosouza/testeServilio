import {Component, ViewChild, Input, ElementRef, forwardRef, Output, EventEmitter} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadImageComponent),
      multi: true
    }
  ],
})
export class UploadImageComponent implements ControlValueAccessor {

  onChange: (...args) => any;
  onTouched: (...args) => any;

  @Input() previewImage: string;

  @ViewChild('input', {static: true}) input: ElementRef;

  @Input() name = '';
  @Input() disabled = '';
  @Input() asBase64 = false;
  @Output() removed: EventEmitter<any> = new EventEmitter<any>();

  file: File | string;


  get hasImage() {

    return !(
      this.value === null ||
      typeof this.value === 'undefined' ||
      (typeof this.value === 'string' && this.value.length === 0)
    );
  }

  get value() {
    if (this.asBase64) {
      return (this.file && (this.file as string).length > 0) ? `data:image/jpeg;base64,${this.file}` : '';
    }
    return this.file;
  }

  set value(val) {
    if (this.asBase64) {
      const p = (val as string).split(',');
      this.file = p.length > 1 ? p[1] : p[0];
      this.previewImage = `data:image/jpeg;base64,${this.file}`;
    } else {
      this.file = val;
    }
    this.onChange?.(this.file);
    this.onTouched?.();
  }

  get style() {
    if (this.previewImage) {
      return {
        'background-image': `url(${this.previewImage})`
      };
    }
    return {};
  }

  preventDefault(event) {
    event.preventDefault();
  }

  remove(event) {
    this.preventDefault(event);
    this.changeFile();
    this.onChange?.(null);
    this.removed.emit();
  }

  elOnChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.changeFile(input.files);
  }

  onDrop(event: DragEvent) {
    this.preventDefault(event);
    this.changeFile(event.dataTransfer.files);
  }


  changeFile(files: FileList = null) {
    if (files && files.length > 0) {
      const file = files.item(0);
      const fr = new FileReader();

      fr.addEventListener('load', (event: ProgressEvent) => {
        this.previewImage = (event.target as FileReader).result as string;
        this.value = this.asBase64 ? this.previewImage : file;
      });

      fr.readAsDataURL(file);

    } else {
      this.value = '';
      this.previewImage = null;
      (this.input.nativeElement as HTMLInputElement).value = '';
    }
  }

  writeValue(value) {
    if (value) {
      this.value = value;
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

}

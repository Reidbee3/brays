import { Directive,
         ElementRef,
         ViewContainerRef,
         ComponentFactoryResolver,
         ComponentRef,
         OnInit,
         Input,
         Output, EventEmitter, HostListener } from '@angular/core';
import { VocabularyAutocompleteComponent } from 'app/components/vocabulary-autocomplete/vocabulary-autocomplete.component';

import { VocabularyService } from 'app/services/vocabulary.service';

@Directive({
  selector: "[vocab-autocomplete]"
})
export class VocabularyAutocomplete implements OnInit {

  componentRef: ComponentRef<VocabularyAutocompleteComponent>;
  vocabList: string[];
  dropdownVisible: boolean = false;

  selectedIndex: number;
  filteredList: string[];

  constructor(
    private resolver: ComponentFactoryResolver,
    private el: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private vocabularyService: VocabularyService) {
  }

  @Input('range')  range: any;

  @Input() ngModel: string;

  @Output() ngModelChange:EventEmitter<any> = new EventEmitter();

  @HostListener('keyup', ['$event']) onKeyup(e) {
    //if (!this.dropdownVisible) { return; }

    if (e.code === 'Escape') {
      this.hideAutocomplete();
    }
    else if (
      (e.which <= 90 && e.which >= 48) ||
      e.code === "Delete" ||
      e.code === 'Backspace') {
      this.setFilteredList();
    }
  }
  @HostListener('keydown', ['$event']) onKeydown(e) {
    if (e.code === 'ArrowUp' && this.dropdownVisible) {
      e.stopPropagation();
      e.preventDefault();

      this.selectedIndex = Math.max(0, --this.selectedIndex);
      this.vocabularyService.setListIndex(this.selectedIndex);
    }
    else if (e.code === 'ArrowDown' && this.dropdownVisible) {
      e.stopPropagation();
      e.preventDefault();

      this.selectedIndex = Math.min(this.filteredList.length - 1, ++this.selectedIndex);
      this.vocabularyService.setListIndex(this.selectedIndex);
    }
    else if (e.code === 'Enter' && this.dropdownVisible) {
      this.setSelection();
    }
    else if (e.code === 'Tab' && this.dropdownVisible) {
      e.stopPropagation();
      e.preventDefault();
      this.hideAutocomplete();
    }
  }

  ngOnInit(): void {
    this.vocabularyService.listValue.subscribe((value) => {
      this.setSelection(value);
    });
  }

  showAutocomplete() {
    if (this.vocabList) {
      let factory = this.resolver.resolveComponentFactory(VocabularyAutocompleteComponent);
      this.componentRef = this.viewContainerRef.createComponent(factory);
      this.dropdownVisible = true;
      this.selectedIndex = 0;
    }
  }

  hideAutocomplete() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }

    this.vocabularyService.setList(null);
    this.dropdownVisible = false;
  }

  setSelection(selectedText: string = null) {
    if (!this.dropdownVisible) { return; }

    if (!selectedText) {
      selectedText = this.filteredList[this.selectedIndex];
    }
    this.ngModelChange.emit(selectedText);
    // Need to save the changes. Otherwise it won't do anything.
    let event = new Event('change');
    this.el.nativeElement.dispatchEvent(event);
    this.hideAutocomplete();
  }

  highlightText(value: string) {
    if (!value) { return }

    let oldTxtValue = this.ngModel;
    let txtValue = this.ngModel + value.substring(this.ngModel.length);
    this.ngModelChange.emit(txtValue);
  }

  setFilteredList(): void {
    if (!this.getVocabList()) { return; }

    this.filteredList = this.vocabList.filter((value) => {
      return value && value.toLowerCase().indexOf(this.ngModel.toLowerCase()) > -1;
    });

    if (this.ngModel === '') {
      this.filteredList = null;
      this.hideAutocomplete();
    }
    if (this.filteredList && this.filteredList.length > 0 && !this.dropdownVisible) {
      this.showAutocomplete();
    }
    else if (this.filteredList && this.filteredList.length === 0 && this.dropdownVisible) {
      this.hideAutocomplete();
    }
    this.vocabularyService.setList(this.filteredList);
  }

  private getVocabList(): string[] {
    this.vocabList = [];
    if (!this.range) {
      return [];
    }
    for (let range of this.range) {
      if (range.uri) {
        this.vocabList = this.vocabList.concat(
          this.vocabularyService.getPrefLabelsByRange(String(range.label)));
      }
      if (range.values) {
        this.vocabList = this.vocabList.concat(range.values);
      }
    }

    return this.vocabList;
  }

  @HostListener('document:click') onClick() {
    this.hideAutocomplete();
  }

}

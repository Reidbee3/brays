import { Component, Input, OnInit, ElementRef, Renderer, ViewChild, ViewEncapsulation } from '@angular/core';
import { shell } from 'electron';

import { Object } from '../shared/object';
import { ObjectService } from '../shared/object.service';
import { File } from '../shared/file';

import { ObligationHighlight } from './obligation-highlight.directive';
import { VocabularyAutocomplete } from './vocabulary-autocomplete.directive';

@Component({
  selector: 'metadata',
  templateUrl: './metadata/metadata.component.html',
  styles: [ require('./metadata.component.scss') ],
  encapsulation: ViewEncapsulation.None,
  directives:[
    ObligationHighlight,
    VocabularyAutocomplete
  ]
})

export class MetadataComponent implements OnInit {
  @Input() object: Object;
  @Input() selectedFile: File;

  constructor(
    private objectService: ObjectService,
    private renderer: Renderer,
    private el: ElementRef) {
  }

  ngOnInit():void {
    this.objectService.objectChanged.subscribe(object => this.object = object);
    this.objectService.fileChanged.subscribe(file => this.selectedFile = file);
  }

  madeChanges(object: Object):void {
    this.objectService.setObject(object);
  }

  save(): void {
    this.objectService.saveObjects();
  }

  isImage(file: File): boolean {
    return /^image\/*/.test(file.mime);
  }

  openFile(file: File): void {
    shell.openItem(file.path);
  }

  openUrl(uri: string): void {
    shell.openExternal(uri);
  }

  clearFlag(): void {
    this.object.productionNotes = '';
    this.save();
  }

  addFlag(): void {
    this.object.productionNotes = ' ';
    this.el.nativeElement.scrollTop = 0;
  }

}
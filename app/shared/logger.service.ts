import { Injectable, Output, EventEmitter } from '@angular/core';

import { Entry } from './entry';

@Injectable()
export class LoggerService {

  entries: Entry[] = [];

  @Output() log:EventEmitter<any> = new EventEmitter();
  @Output() changed:EventEmitter<Entry> = new EventEmitter();

  info(message: string, notify?: boolean): void {
    this.addEntry('info', message, notify);
  }

  success(message: string, notify?: boolean): void {
    this.addEntry('success', message, notify);
  }

  error(message: string, notify?: boolean): void {
    this.addEntry('error', message, notify);
  }

  warn(message: string, notify?: boolean): void {
    this.addEntry('warning', message, notify);
  }

  addEntry(type: string, message: string, notify?: boolean): void {
    let entry = new Entry(type, message, notify);
    this.entries.push(entry);
    this.log.emit(this.entries);
    this.changed.emit(entry);
  }

  clear(): void {
    this.entries = [];
    this.log.emit(this.entries);
  }

  toString(): string {
    let output: string = '';
    for (let e of this.entries) {
      output += '[' + e.timestamp + '] ' + e.message + "\n";
    }
    return output;
  }

  toTodayISOString(): string {
    let date = new Date();
    return date.getFullYear() +
      '-' + this.padLeft(date.getMonth() + 1, 2, "0") +
      '-' + this.padLeft(date.getDate(), 2, "0");
  }

  private padLeft(value: any, length: number, character: string): string {
    value = String(value);
    return Array(length - value.length + 1).join(character || " ") + value;
  }

}

import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomWeeklyDateFormatter extends CalendarDateFormatter {
  public weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'EEE', locale);
  }

  public weekViewColumnSubHeader({ date, locale, }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'dd', locale);
  }
}

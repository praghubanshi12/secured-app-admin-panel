import { Component, AfterViewInit, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import * as AdminLte from 'admin-lte';

@Component({
    selector: 'app-home',
    template: require('./home.component.html'),
})
export class HomeComponent implements AfterViewInit {
    ngAfterViewInit(): void {
        $('[data-widget="treeview"]').each(function() {
            AdminLte.Treeview._jQueryInterface.call($(this), 'init');
        });
    }
}
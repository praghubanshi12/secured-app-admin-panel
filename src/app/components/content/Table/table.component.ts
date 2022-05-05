import { Component, OnInit, Input, SimpleChanges, ViewChild } from "@angular/core";
import * as $ from 'jquery';

@Component({
    selector: 'app-table',
    template: require('./table.component.html'),
})
export class TableComponent implements OnInit {

    @Input() tableHeaders: Object;
    @Input() tableData: Array<any>;
    @Input() tableTitle: String;
    @Input() paginationConfig: Object;
    @Input() modalFormElements: any

    tableColumns: String = '';
    tableDataColumns: String = '';
    tableHeadersKeyList = [];
    paginateData = [];

    modalData: Object = {}
    modalTitle = "";

    constructor() { }

    ngOnInit(): void {
        this.tableHeadersKeyList = Object.keys(this.tableHeaders)
    }

    ngOnChanges(changes: SimpleChanges) {
        this.tableHeadersKeyList = Object.keys(this.tableHeaders)
        if (changes.tableData?.currentValue && changes.paginationConfig?.currentValue) {
            this.getTableData(this.tableData);
        }
    }

    onToggle(data) {
        this.modalData = data;
        $('#show').show();
        this.modalFormElements = { ...this.modalFormElements, mode: 'U' }
        this.modalTitle = `Edit ${this.tableTitle}`
        $(".search").val('');
    }


    onAdd() {
        $('#show').show();
        this.modalFormElements = { ...this.modalFormElements, mode: 'I' }
        this.modalTitle = `Add ${this.tableTitle}`
        $(".search").val('');
    }

    onClickHandler = e => {
        let column = e.target.dataset.column;
        let order = e.target.dataset.order;
        let newTableData = [...this.paginateData];

        if (order === "desc") {
            e.target.setAttribute("data-order", "asc");
            e.target.setAttribute("class", `headerSortDown table-${column}`);
            newTableData.sort((a, b) => (a[column] > b[column] ? 1 : -1));
        } else {
            e.target.setAttribute("data-order", "desc");
            e.target.setAttribute("class", `headerSortUp table-${column}`);
            newTableData.sort((a, b) => (a[column] < b[column] ? 1 : -1));
        }
        this.paginateData = newTableData;
    };

    timeout = null;
    searchHandler = event => {
        const { value } = event.target;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            let data = this.tableData;
            let result = new RegExp(value, "ig");

            let searchKey = this.tableHeaders["searchFilter"];
            const search = data.filter(item => {
                for (let i = 0; i < searchKey.length; i++) {
                    if (item[searchKey[i]] !== null && item[searchKey[i]] !== undefined) {
                        if (item[searchKey[i]].length > 0) {
                            for (let j = 0; j < item[searchKey[i]].length; j++) {
                                if (result.test(item[searchKey[i]][j].name)) return true;
                            }
                        }
                        if (result.test(item[searchKey[i]])) return true;
                    }
                }
            });

            this.paginationConfig = {
                ...this.paginationConfig,
                data: search,
                currentPage: 1,
                totalRecordsCount: search.length
            }

            this.paginateData = this.getTableData(search);
        }, 500);
    }

    paginateHandler = () => {
        this.getTableData(this.paginationConfig["data"].length > 0 ? this.paginationConfig["data"] : this.tableData);
    }

    getTableData(tableData: any[]): any[] {
        let indexOfFirstRecord = (this.paginationConfig["currentPage"] - 1) * this.paginationConfig["recordPerPage"];
        let indexOfLastRecord = this.paginationConfig["currentPage"] * this.paginationConfig["recordPerPage"];
        const data = tableData.slice(
            indexOfFirstRecord,
            indexOfLastRecord
        );

        return this.paginateData = data;
    }
}
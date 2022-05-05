import { Component, OnInit, Inject } from '@angular/core';
import { SubscriberService } from './../../../services/subscribers/subscriber.service';
import * as $ from 'jquery';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-subscriber-list',
  template: require('./subscriber-list.component.html'),
})
export class SubscriberListComponent implements OnInit {

  currentListType = "";

  service: SubscriberService;

  tableHeaders = {
    subscriberId: "#",
    txtFullName: "Full Name",
    txtCity: "City",
    txtEmail: "Email",
    txtTelephoneNo: "Telephone No",
    createdAt: "Created At",
    action: "Action",
    searchFilter: ['txtFullName', 'txtCity', 'txtEmail']
  };

  paginationConfig = {
    data: [],
    currentPage: 1,
    recordPerPage: 2,
    totalRecordsCount: 0,
  };

  modalFormElements = {}
  tableData: any = [];

  constructor(
    @Inject(SubscriberService) service: SubscriberService,
  ) {
    this.service = service;
  }

  ngOnInit(): void {
    this.currentListType = "PENDING";
    this.modalFormElements = {
      htmlElements: [
        {
          label: "Password",
          initialValue: Math.random().toString(36).slice(2),
          name: "password",
          type: "text",
          element: "input",
          isRequired: true,
          isDisabled: true
        },
        {
          label: "Full Name",
          initialValue: '',
          name: "txtFullName",
          type: "text",
          element: "input",
          isRequired: true,
          isDisabled: false
        },
        {
          label: "Email",
          initialValue: '',
          name: "txtEmail",
          type: "email",
          element: "input",
          isRequired: true,
          isDisabled: false
        },
        {
          label: "City",
          initialValue: '',
          name: "txtCity",
          type: "text",
          element: "input",
          isRequired: true,
          isDisabled: false
        },
        {
          label: "Telephone No",
          initialValue: '',
          name: "txtTelephoneNo",
          type: "text",
          element: "input",
          isRequired: true,
          isDisabled: false
        },
        {
          label: "Primary Link",
          initialValue: '',
          name: "primaryLink",
          type: "text",
          element: "input",
          isRequired: true,
          isDisabled: false
        },
        {
          label: "Secondary Link",
          initialValue: '',
          name: "secondaryLink",
          type: "text",
          element: "input",
          isRequired: false,
          isDisabled: false
        },
        {
          label: "Timeout(In Seconds)",
          initialValue: 60,
          name: "timeoutInSeconds",
          type: "number",
          min: 10,
          max: 60,
          element: "input",
          isRequired: true,
          isDisabled: false
        }
      ],
      buttons:
      {
        "U": [
          {
            value: 'Approve',
            type: 'success',
            service: this.service,
            patchValues: [{ approvalStatus: "APPROVED" }],
            afterSubmit: () => { this.showApproved(this) },
            condition: this.currentListType === "PENDING"
          },
          {
            value: 'Disapprove',
            type: 'danger',
            service: this.service,
            patchValues: [{ approvalStatus: "DISAPPROVED" }],
            afterSubmit: () => { this.showDisapproved(this) },
            condition: true
          }
        ],
        "I": [
          {
            value: 'Add',
            type: 'success',
            service: this.service,
            patchValues: [],
            afterSubmit: () => { this.showApproved(this) }
          },
        ]
      }
    }
    this.updateTableData(true);
  }

  updateTableData(hasEdit) {
    if (!hasEdit) {
      delete this.tableHeaders["action"]
    } else {
      this.tableHeaders["action"] = "Action"
    }

    this.tableData = []
    this.service.getByApprovalStatus(this.currentListType).subscribe({
      next: data => {
        data.forEach(row => {
          row.createdAt = formatDate(row.createdAt, 'yyyy-MM-dd hh:mm:ss a', 'en-US')
        });
        data.forEach(row => {
          row['hasEdit'] = hasEdit
        })
        this.tableData = data
        this.paginationConfig = {
          ...this.paginationConfig,
          totalRecordsCount: data.length,
          currentPage: 1
        }
      },
      error: err => {
        alert(err.message)
      }
    })
  }

  showApproved($this) {
    $this.updateSubscriberList("APPROVED")
  }

  showDisapproved($this) {
    $this.updateSubscriberList("DISAPPROVED")
  }

  updateSubscriberList(approvalStatus) {
    $("#" + approvalStatus.toLowerCase()).prop("checked", true)
    this.currentListType = approvalStatus;
    this.updateTableData(approvalStatus !== "DISAPPROVED");
  }

  onSubscriberTypeChange(e: any) {
    this.currentListType = e.target.id?.toUpperCase();
    switch (e.target.id) {
      case "disapproved":
        this.updateTableData(false);
        break;

      case "pending":
        this.modalFormElements["buttons"]["U"][0]["value"] = "Approve"
        this.updateTableData(true)
        break;

      case "approved":
        this.modalFormElements["buttons"]["U"][0]["value"] = "Save"
        this.updateTableData(true)
        break;
    }

    $(".search").val('');
  }
}
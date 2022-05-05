import { Component, OnInit, Input, SimpleChanges, Inject } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import * as $ from 'jquery';
import { SubscriberService } from "../../../services/subscribers/subscriber.service";

@Component({
    selector: 'app-modal',
    template: require('./modal.component.html'),
})
export class ModalComponent implements OnInit {

    modalForm: FormGroup = new FormGroup({});
    formBuilder: FormBuilder;
    subscriberService: SubscriberService;

    constructor(@Inject(FormBuilder) formBuilder: FormBuilder,
        @Inject(SubscriberService) subscriberService: SubscriberService
    ) {
        this.formBuilder = formBuilder;
        this.subscriberService = subscriberService;
    }

    @Input() modalTitle: string;
    @Input() modalData: any;
    @Input() modalFormElements: Object

    ngOnInit(): void { }

    initializeForm(formElements) {
        //this is hidden in html

        if (this.modalFormElements["mode"] === "U")
            this.modalForm.setControl("_id", new FormControl('', [Validators.required]))

        if (this.modalFormElements["mode"] === "I")
            this.modalForm.removeControl("_id")

        formElements["htmlElements"].forEach(el => {
            let validatorOptions: any = [];
            if (el.isRequired) validatorOptions.push(Validators.required);
            if (el.type === 'email') validatorOptions.push(Validators.email);
            if (el.type === 'number') {
                validatorOptions = [...validatorOptions, Validators.min(el.min), Validators.max(el.max)]
            }
            this.modalForm.setControl(el.name, new FormControl(
                { value: el.initialValue, disabled: el.isDisabled })
            )
            this.modalForm.get(el.name).addValidators(validatorOptions)
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        let modalFormElementsCurrentVal = changes.modalFormElements?.currentValue
        if (modalFormElementsCurrentVal) {
            this.initializeForm(this.modalFormElements)
        }

        if (modalFormElementsCurrentVal["mode"] === 'U') {
            var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
            if (!this.modalData.password) this.modalData.password = Math.random().toString(36).slice(2)
            if (base64regex.test(this.modalData.password)) this.modalData.password = atob(this.modalData.password)
            this.modalForm.patchValue(this.modalData)
        }
    }

    generateRandomPassword() {
        this.modalForm.patchValue({ password: Math.random().toString(36).slice(2) })
    }

    get f(): { [key: string]: AbstractControl } {
        return this.modalForm.controls;
    }

    onSubmitHandler(service: any, patchValues: Array<Object>, afterSubmit, mode: String) {
        // afterSubmit()
        patchValues.forEach(object => {
            let key = Object.keys(object)[0]
            this.modalForm.setControl(Object.keys(object)[0], new FormControl(object[key]))
        })

        if (mode === 'U') {
            service.update(this.modalForm.getRawValue()).subscribe(data => {
                alert(data.message)
            })
        }

        if (mode === 'I') {
            alert("no insert api")
        }

        afterSubmit();
        $("#showModal").modal('hide')
    }
}
import { LightningElement, wire, track } from 'lwc';
import getApexClass from '@salesforce/apex/Metadata_Apex.fetchAllMetadataName';
import MetadataRecords from '@salesforce/apex/Metadata_Apex.MetadataAllRecord';
import SearchMetadataRecords from '@salesforce/apex/Metadata_Apex.searchMetaRecord';
import MetadataRecordsBody from '@salesforce/apex/Metadata_Apex.metaDataBody';
export default class MetadataApex extends LightningElement {

    @track selectedformId;
    @track fetchedMetadata;
    @track fetchedMetadataBody ;
    @track searchfetchedMetadata = false;
    inputValue = '';
    showCode = false;
    NoMetadata = false;
    labels='xxx';
    @track ApexClassOptions = [];
    handleMetadataChange = '';
    @track isShowModal = false;

    @track showSpinner = false;
    

    @wire(getApexClass)
    wiredApexClass({ data, error }) {
        if (data) {
            this.ApexClassOptions = data.map(apexWrapper => ({
                label: apexWrapper.formLabel,
                value: apexWrapper.formvalue
            }));
        } else if (error) {
            console.error('Error fetching accounts:', error);
        }
    }

    get placeHolder() {
		let search = 'Search ';
		if (this.selectedformId === 'ApexClass') {
			return search + 'Apex Classes';
		}
		else if (this.selectedformId === 'ApexTrigger') {
			return search + 'Trigger';
		}
		else if (this.selectedformId === 'ApexPage') {
			return search + 'Visualforce Page';
		}
		else if (this.selectedformId === 'ApexComponent') {
			return search + 'Visualforce Component';
		}
		return search;
	}

    handleInput(event){
        this.showSpinner = true;    
        this.fetchedMetadata = false;  
        this.inputValue = event.target.value;
        SearchMetadataRecords({metaValue: this.selectedformId, formName : this.inputValue}).then(result => {        
             this.fetchedMetadata = result;  
             console.log(this.fetchedMetadataBody);
            
        }).catch(error => {
             console.log('Error occurred : '+error);
        }).finally(() => {
                this.showSpinner = false;
        });
    }

    handleChange(event) {    
        this.fetchedMetadata = false;            
		this.selectedformId = event.detail.value;
        this.showSpinner = true;    
        this.labels = event.target.options.find(opt => opt.value === event.detail.value).label;
        MetadataRecords({metaValue :  this.selectedformId}).then(result => {        
             this.fetchedMetadata = result;             
           
        }).catch(error => {
             console.log('Error occurred : '+error);
        }).finally(() => {
                this.showSpinner = false;
            });
    }

    handleClick(event){
        this.isShowModal = true;
        const id = event.currentTarget.dataset.id;
        //console.log(typeof id);
        MetadataRecordsBody({metaValue :  this.selectedformId, bodyId : id}).then(result => {        
             this.fetchedMetadataBody = result;  
             console.log(this.fetchedMetadataBody.body);           
           
        }).catch(error => {
             console.log('Error occurred : '+error);
        })
    }

    hideModalBox(){
        this.isShowModal = false;
        this.fetchedMetadataBody = '';
    }

}

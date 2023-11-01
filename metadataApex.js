import { LightningElement, wire, track } from 'lwc';
import getApexClass from '@salesforce/apex/Metadata_Apex.fetchAllMetadataName';
import MetadataRecords from '@salesforce/apex/Metadata_Apex.MetadataAllRecord';
import SearchMetadataRecords from '@salesforce/apex/Metadata_Apex.searchMetaRecord';
import MetadataRecordsBody from '@salesforce/apex/Metadata_Apex.metaDataBody';
import sortingMetadata from '@salesforce/apex/Metadata_Apex.sortMetadata';
export default class MetadataApex extends LightningElement {

    sortbyId = [
        { value: 'dateAsc', label: 'Date 1->31'},{ value: 'dateDesc', label: 'Date 31->1'}, 
        { value: 'nameAsc', label: 'Name A->Z'}, { value: 'nameDesc', label: 'Name Z->A'},        
    ];

    @track refreshFlag = false;
    @track selectedformId;
    @track selectedSortForm;
    @track fetchedMetadata;
    @track storeFetchData = '';
    @track fetchedMetadataBody ;
    @track searchfetchedMetadata = false;
    inputValue = '';    sortFieldName = '';
    sortbyorder = '';   labels='xxx';
    @track ApexClassOptions = [];    
    @track isShowModal = false;
    @track isComboBoxDisabled = true;
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
             this.storeFetchData = result;
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
        this.labels = event.target.options.find(opt => opt.value === event.detail.value).label;
        this.showSpinner = true;  
        MetadataRecords({metaValue :  this.selectedformId}).then(result => {        
             this.fetchedMetadata = result;      
        }).catch(error => {
             console.log('Error occurred : '+error);
        }).finally(() => {
                this.showSpinner = false;
            });
        this.isComboBoxDisabled = false;
    }

    handleClick(event){
        this.isShowModal = true;
        const id = event.currentTarget.dataset.id;
        console.log(id);
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

    handleSortChange(event){
        this.fetchedMetadata = false;  
        this.showSpinner = true;         
        if (event.target.value === 'dateAsc') {
			this.sortFieldName = 'LastModifiedDate';  this.sortbyorder = 'asc';
		}
		else if (event.target.value === 'dateDesc') {
			this.sortFieldName = 'LastModifiedDate';  this.sortbyorder = 'desc';
		}
        else if (event.target.value === 'nameAsc') {
			this.sortFieldName = 'Name';  this.sortbyorder = 'asc';
		}
        else if (event.target.value === 'nameDesc') {
            this.sortFieldName = 'Name';  this.sortbyorder = 'desc';
        }
        
        sortingMetadata({metaValue: this.selectedformId, fieldName : this.sortFieldName, sortby : this.sortbyorder}).then(result => {        
             this.fetchedMetadata = result;  
             console.log(this.fetchedMetadataBody);            
        }).catch(error => {
             console.log('Error occurred : '+error);
        }).finally(() => {
                this.showSpinner = false;
        });
    }


    refreshTab() {        
        location.reload();
    }

    handleRefresh(event){
        this.refreshTab();
    }
  
}

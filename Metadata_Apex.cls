public class Metadata_Apex {
    @AuraEnabled(cacheable=true)
    public static List<ApexFormWrapper> fetchAllMetadataName(){	        
        List<ApexFormWrapper> apexWrapper = new List<ApexFormWrapper>();        
        Map<String, string> apexForm = new Map<String, string>();
        apexForm.put('ApexClass', 'Apex Classes');
        apexForm.put('ApexTrigger', 'Trigger');
        apexForm.put('ApexPage', 'Visualforce Page');
        apexForm.put('ApexComponent', 'Visualforce Component');        
        for(string af : apexForm.keySet()){
            ApexFormWrapper result = iterateAllData(af, apexForm.get(af));
            apexWrapper.add(result);
        }
        return apexWrapper;        
    }
    
    @AuraEnabled(cacheable=true)
    public static List<fetchMetadataAllRecord> MetadataAllRecord(String metaValue){    			// All record Form Name for the Apex
        String query = 'Select Id, Name, Status, LastModifiedDate, ApiVersion from '+ metaValue;  
        List<SObject> records = Database.query(query);
        return Datafetching(records);
    }
    
    @AuraEnabled(cacheable=true)
    public static List<MetadataBody> metaDataBody(String metaValue, String bodyId){				// Form Name Meta Body the Apex
        String query = 'select name, Body from '+ metaValue+ ' WHERE Id = \'' + bodyId + '\'';
        List<MetadataBody> metaBodyList = new List<MetadataBody>();
        List<SObject> records = Database.query(query);
        for(Sobject sobj : records){            
            MetadataBody metaBody = new MetadataBody();
            metaBody.body = (String)sobj.get('Body');
            metaBody.name = (String)sobj.get('name');
            metaBodyList.add(metaBody);
        }
        system.debug(metaBodyList);
        return metaBodyList;
    } 

    
    @AuraEnabled(cacheable=true)
    public static List<fetchMetadataAllRecord> searchMetaRecord(String metaValue, string formName){		// Search the Form Name for the Apex
        String query = 'select Id, Name, Status, LastModifiedDate, ApiVersion from '+ metaValue+ ' WHERE Name = \'' + formName + '\'';          
        List<SObject> records = Database.query(query);   
        return Datafetching(records);        
    }
    
    
    @AuraEnabled(cacheable=true)
    public static List<fetchMetadataAllRecord> sortMetadata(String metaValue, string fieldName, string sortby){				// sorting data         
        String query = 'Select Id, Name, Status, LastModifiedDate, ApiVersion from '+ metaValue +' order by '+ fieldName + ' ' +sortby;
        List<SObject> records = Database.query(query);   
        return Datafetching(records); 
    }

    
    public static ApexFormWrapper iterateAllData(String value, String label){			// Form Name and count getting for the combobox
        ApexFormWrapper afw = new ApexFormWrapper();
        String countApex = 'Select count() from '+value;
        Integer totalRecords = Database.countQuery((string)countApex, AccessLevel.USER_MODE);
        afw.formLabel = (label + ' ('+totalRecords+')' );
        afw.formvalue = value;        
        return afw;
    }

    
    public class MetadataBody{
        @AuraEnabled public string body, name;
    }

    
    public class fetchMetadataAllRecord{
        @AuraEnabled public string Id;
        @AuraEnabled public string name;
        @AuraEnabled public string Status;
        @auraEnabled public decimal version ;
        @AuraEnabled public datetime LastModifiedDate;       
    }

    
    public class ApexFormWrapper{
         @AuraEnabled public string formLabel, formvalue;
    }


    public static List<fetchMetadataAllRecord> Datafetching(List<sObject> records){
        List<fetchMetadataAllRecord> recordWrapper = new List<fetchMetadataAllRecord>();
        for(Sobject sobj : records){   
            fetchMetadataAllRecord fetchMeta = new fetchMetadataAllRecord();
            fetchMeta.id = (String)sobj.get('Id');
            fetchMeta.name = (String)sobj.get('Name');           	 
            fetchMeta.Status = (String)sobj.get('Status');
            fetchMeta.version = (Decimal)sobj.get('ApiVersion');
            fetchMeta.LastModifiedDate = (DateTime)sobj.get('LastModifiedDate');
            recordWrapper.add(fetchMeta);
        }
        return recordWrapper;
    }
}

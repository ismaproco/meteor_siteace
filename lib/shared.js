Websites = new Mongo.Collection("websites");

Websites.allow({
    insert: function(userId,doc) {
        if(Meteor.user()){
            if( doc.description && doc.url ){
                return true;    
            }
        }
        return false;
    },
    remove: function(userId, doc) {
        if(Meteor.userId){
            return true;    
        }
        
        return false;
    }, 
    update: function (userId, doc) {
        if(Meteor.user()){
            if( doc.description && doc.url ){
                return true;    
            }
        }
    }
});

/////
// template helpers 
/////

// helper function that returns all available websites
Template.website_list.helpers({
    websites:function(){
        return Websites.find( { } , { sort: { votes: -1 } } );
    }
});


/////
// template events 
/////

Template.website_item.events({
    "click .js-upvote":function(event){
        // example of how you can access the id for the website in the database
        // (this is the data context for the template)

        if(Meteor.user()){
            var website_id = this._id;
            console.log("Up voting website with id "+website_id);
            // put the code in here to add a vote to a website!
            
            var calc_votes = 0;
            if(typeof this.votes === "number" && !isNaN(this.votes)){
                this.votes_plus = 1 + ( this.votes_plus ? this.votes_plus : 0 );
                calc_votes = this.votes_plus - ( this.votes_minus ? this.votes_minus : 0 );
            } else {
                calc_votes = 1;
                this.votes_plus = 1;
            }
            
            Websites.update({ _id : website_id } , { $set: { votes:calc_votes, votes_plus: this.votes_plus } } );    
        } else {
            alert('You are not logged in!');
        }
        
        return false;// prevent the button from reloading the page
    }, 
    "click .js-downvote":function(event){

        if(Meteor.user()){
            // example of how you can access the id for the website in the database
            // (this is the data context for the template)
            var website_id = this._id;
            console.log("Down voting website with id "+website_id);

            // put the code in here to remove a vote from a website!
            var calc_votes = 0;
            if(typeof this.votes === "number" && !isNaN(this.votes)){
                this.votes_minus = 1 + ( this.votes_minus ? this.votes_minus : 0 );
                calc_votes = ( this.votes_plus ? this.votes_plus : 0 ) - this.votes_minus;
            } else {
                calc_votes = -1;
            }
            Websites.update({ _id : website_id } , { $set: { votes:calc_votes, votes_minus: this.votes_minus } } );
        } else {
            alert('You are not logged in!');    
        }
        return false;// prevent the button from reloading the page
    }
});

Template.website_detail.events({"submit .js-comments-website":function(event){
    var website_id = this._id;
    var comment = event.target.comments.value.trim();
    var commentsArray = this.comments || [];

    if(Meteor.user() && comment){
        
        commentsArray.push({
            "userId": Meteor.user()._id,
            "email": Meteor.user().emails[0].address,
            "createdOn":new Date(),
            "comment":comment
        });
        
        Websites.update({ _id : website_id } , { $set: { comments: commentsArray } } );
        //clear form
        $(event.target).trigger("reset");
    }
    
    return false;
}});


Template.website_form.events({
    "click .js-toggle-website-form":function(event){
        $("#website_form").toggle('slow');
    }, 
    "submit .js-save-website-form":function(event){
        var isValid = true;
        // here is an example of how to get the url out of the form:
        var _url = event.target.url.value;  
        var _title = event.target.title.value;
        var _description = event.target.description.value;
        
        console.log("The url they entered is: "+_url);
        
        if(_url.length === 0){
            isValid = false;
            $(event.target.url.parentElement).addClass('has-error has-feedback');
        } else {
            $(event.target.url.parentElement).removeClass('has-error has-feedback');
        }
        
        
        if(_description.length === 0) {
            isValid = false;
            $(event.target.description.parentElement).addClass('has-error has-feedback');
        } else {
            $(event.target.description.parentElement).removeClass('has-error has-feedback');
        }
        
        if(!Meteor.user()){
            alert('You are not logged in!');
            isValid = false; 
        }
        
        // validate input before saving the form
        if(isValid) {
            //  put your website saving code in here!   
            Websites.insert({
                title:_title, 
                url:_url, 
                description:_description, 
                votes:0,
                createdOn:new Date()
            });
            
            //clear form
            $('#website_form').trigger("reset");
            //toggle the visibility of the form
            $("#website_form").toggle('slow');
        }
        
        return false;// stop the form submit from reloading the page

    }
});
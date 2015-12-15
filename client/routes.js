Router.route('/', function () {
    this.layout('ApplicationLayout');
    this.render("summary",{to:'main'});
});

Router.route('/w/:_id', function () {
    this.layout('ApplicationLayout');
    this.render("website_detail", { 
        to:'main', 
        data: function(){
            return Websites.findOne({ _id: this.params._id });
        }
    });
});
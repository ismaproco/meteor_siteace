Router.route('/', function () {
    this.layout('ApplicationLayout');
    this.render("summary",{to:'main'});
});
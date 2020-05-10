const Handlebars = require("handlebars");
Handlebars.registerHelper('isAdmin', function(v1, options) {
    if(parseInt(v1) > 0) {
        return options.fn(this)
    }else{
      return options.inverse(this)
    }
  });
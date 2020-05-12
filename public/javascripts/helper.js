const Handlebars = require("handlebars");
Handlebars.registerHelper('ifCond', function(v1, options) {
    if(v1 != 0) {
        return options.fn(this)
    }else{
      return options.inverse(this)
    }
  });
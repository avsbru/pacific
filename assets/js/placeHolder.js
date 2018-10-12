addLoadEvent(initPlaceHolder);

function initPlaceHolder() {
    new PlaceHolder();
}

// PlaceHolder: construct
function PlaceHolder() 
{ 
    this.initialize();
}

// PlaceHolder: methods
PlaceHolder.prototype = {
   initialize: function() {
       var forms = document.getElementsByTagName('form');     
       for (var i = 0; i < forms.length; i++) {
           var elements = forms[i].elements;
           for (var j = 0; j < elements.length; j++) {
               if (elements[j].getAttribute('type') == "text") {
                   if (elements[j].className.indexOf("placeHolder") != -1) {
                        var el = elements[j];
                       
                        // set value as title
                        if (el.value == '') el.value = el.title;
                       
                        // controllers
                        el.onfocus = function() {
                            if (this.value == this.title) this.value = '';
                        }
                        el.onblur = function() {
                            if (this.value == '') this.value = this.title;
                        }
                        
                        // catch onsubmit for parent form
                        forms[i].onsubmit = function() {
                            var elements = this.elements;
                            for (var j = 0; j < elements.length; j++) {
                                    if (elements[j].className.indexOf("placeHolder") != -1) {
                                        if (elements[j].value == elements[j].title) elements[j].value = '';
                                    }
                            }
                            
                        }
                   }
               }
            }
        }
   }
}
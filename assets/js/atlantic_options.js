function get_color(str,params) {
    var sku = (params && params["sku"]) ? params["sku"] : window.sku;
  
  
  
    if(str.indexOf('/' + sku) > -1){
        str = str.replace('/' + sku, '/');
    } else {
        str = str.replace('_' + sku, '/');
        str = str.replace('-' + sku, '/');
    }
    if ( str.match(/\/\.\w+$/) ) return undefined;
    if ( str.match(/\/_\d+\.\w+$/) ) return undefined;
    var m = str.match(/\/_([^\/\.]+)_mini\.[^\/]+$/);
    var color = '';
  if ( m ) {return m[1].replace(/_/g,' ');}
    var m2 = str.match(/\/_([^\/\.]+)\.[^\/]+$/);
  if (m2) {return m2[1].replace(/_/g,' ');}
   var m3 = str.match(/\/-([^\/\.]+)\.[^\/]+$/);
  if (m3) {return m3[1].replace(/-/g,' ');}
    return undefined
}

AtlanticProduct = function(json) {    
    this.getSizeObject = function(variant) {
        for (var index in variant.option_values)  {
            var option_value = variant.option_values[index];
            if (option_value.option_name_id == this.size_option_id)
                return option_value;
        }
        return undefined;
    };
    
    this.getColorTitle = function(variant) {
        for (var index in variant.option_values)  {
            var option_value = variant.option_values[index];
            if (option_value.option_name_id == this.color_option_id)
                return option_value.title;
        }
        return undefined;
    }

    this.init = function(json) {
        for (property in json) { this[property] = json[property]; }
        for (var option  in this.option_names) { 
            if (this.option_names[option]['title'] == 'Цвет') {
                this.color_option_id = this.option_names[option]['id']
            } else if (this.option_names[option]['title'] == 'Размер') {
                this.size_option_id = this.option_names[option]['id']
            }
        }
        this.size_by_color = {};
        for(var index in this.variants) {
            var variant = this.variants[index];
            if (variant.available) {
                var color = this.getColorTitle(variant);
                if ( this.size_by_color[color] == undefined ) this.size_by_color[color] = [];
                var size = this.getSizeObject(variant);
                this.size_by_color[color][size['position']] = {title: size['title'], variant_id: variant.id};
            }
        };
        this.colors = [];
        for (var color in this.size_by_color) {
            this.colors.push(color);
            this.size_by_color[color] = compact(this.size_by_color[color]); 
        };
    };
    
    this.updateSizeSelect = function(color) {
        color = color.replace('_', ' ');
        var current = $('#variant-select option:selected').html();
        var options = '';

        $.each(this.size_by_color[color],function(index,size){
            options += '<option value="' + size.variant_id +'" '+ (size.title == current ? 'selected' : '') +' >' + size.title + '</option>';
        });


        $('#variant-select').html(options);
    }

    this.init(json);
};
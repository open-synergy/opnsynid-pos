function pos_order_date_save_models(instance, module){

    var _super = module.Order;
    module.Order = module.Order.extend({
        export_as_JSON: function(){
            var json = _super.prototype.export_as_JSON.apply(this,arguments);   
            json.date_order = instance.web.datetime_to_str(new Date());
            return json;
        },
    })
};

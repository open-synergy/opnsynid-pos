function pos_disable_product_grouping_models(instance, module){
    var QWeb = instance.web.qweb;
    _t = instance.web._t;

    var _initialize_ = module.PosModel.prototype.initialize;
    module.PosModel.prototype.initialize = function(session, attributes){
        self = this;
        for (var i = 0 ; i < this.models.length; i++){
            if (this.models[i].model == 'product.product'){
                if (this.models[i].fields.indexOf('pos_grouping_ok') == -1) {
                    this.models[i].fields.push('pos_grouping_ok');
                }
            }
        }
        return _initialize_.call(this, session, attributes);
    };

    var _super = module.Orderline;
    module.Orderline = module.Orderline.extend({
        can_be_merged_with: function(orderline){
            if (!orderline.get_product().pos_grouping_ok){
                return false;
            }
            else{
                var result = _super.prototype.can_be_merged_with.apply(this, arguments);
                return result;
            }
        },
    });

};


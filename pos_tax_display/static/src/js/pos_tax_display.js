'use strict';

openerp.pos_tax_display = function (instance) {
    var module = instance.point_of_sale;

    var _initialize_ = module.PosModel.prototype.initialize;
    module.PosModel.prototype.initialize = function(session, attributes){
        self = this;
        for (var i = 0 ; i < this.models.length; i++){
            if (this.models[i].model == 'account.tax'){
                if (this.models[i].fields.indexOf('pos_tax_display_name') == -1) {
                    this.models[i].fields.push('pos_tax_display_name');
                }
            }
        }
        return _initialize_.call(this, session, attributes);
    };

    var OrderParent = module.Order;
    module.Order = module.Order.extend({
        getTaxDetails: function () {
            var details = OrderParent.prototype.getTaxDetails.call(this);
            var details = {};
            var fulldetails = [];

            this.get('orderLines').each(function(line){
                var ldetails = line.get_tax_details();
                for(var id in ldetails){
                    if(ldetails.hasOwnProperty(id)){
                        details[id] = (details[id] || 0) + ldetails[id];
                    }
                }
            });

            for(var id in details){
                if(details.hasOwnProperty(id)){
                    this.tax_display_name = this.pos.taxes_by_id[id].pos_tax_display_name
                    if (this.tax_display_name){
                        this.tax_name = this.pos.taxes_by_id[id].pos_tax_display_name
                    }else{
                        this.tax_name = this.pos.taxes_by_id[id].name
                    }
                    fulldetails.push({
                        amount: details[id],
                        tax: this.pos.taxes_by_id[id],
                        name: this.tax_name
                    });
                }
            }
            return fulldetails;
        },
    });
};

function pos_product_tax_models(instance, module){
    var round_pr = instance.web.round_precision

    var _initialize_ = module.PosModel.prototype.initialize;
    module.PosModel.prototype.initialize = function(session, attributes){
        self = this;
        for (var i = 0 ; i < this.models.length; i++){
            if (this.models[i].model == 'product.product'){
                if (this.models[i].fields.indexOf('pos_tax_ids') == -1) {
                    this.models[i].fields.push('pos_tax_ids');
                }
            }
        }
        return _initialize_.call(this, session, attributes);
    };

    module.Orderline = module.Orderline.extend({
        get_applicable_taxes: function(){
            var ptaxes_ids = []
            var product =  this.get_product();
            if (product.pos_tax_ids == "" || product.pos_tax_ids == null){
                ptaxes_ids = product.taxes_id;
            }else{
                ptaxes_ids = product.pos_tax_ids;
            }
            var ptaxes_set = {};
            for (var i = 0; i < ptaxes_ids.length; i++) {
                ptaxes_set[ptaxes_ids[i]] = true;
            }
            var taxes = [];
            for (var i = 0; i < this.pos.taxes.length; i++) {
                if (ptaxes_set[this.pos.taxes[i].id]) {
                    taxes.push(this.pos.taxes[i]);
                }
            }
            return taxes;
        },
        get_all_prices: function(){
            var base = round_pr(this.get_quantity() * this.get_unit_price() * (1.0 - (this.get_discount() / 100.0)), this.pos.currency.rounding);
            var totalTax = base;
            var totalNoTax = base;
            var taxtotal = 0;

            var taxes_ids = []
            var product =  this.get_product();
            if (product.pos_tax_ids == "" || product.pos_tax_ids == null){
                taxes_ids = product.taxes_id;
            }else{
                taxes_ids = product.pos_tax_ids;
            }
            
            var taxes =  this.pos.taxes;
            var taxdetail = {};
            var product_taxes = [];

            _(taxes_ids).each(function(el){
                product_taxes.push(_.detect(taxes, function(t){
                    return t.id === el;
                }));
            });

            var all_taxes = _(this.compute_all(product_taxes, base)).flatten();

            _(all_taxes).each(function(tax) {
                if (tax.price_include) {
                    totalNoTax -= tax.amount;
                } else {
                    totalTax += tax.amount;
                }
                taxtotal += tax.amount;
                taxdetail[tax.id] = tax.amount;
            });
            totalNoTax = round_pr(totalNoTax, this.pos.currency.rounding);

            return {
                "priceWithTax": totalTax,
                "priceWithoutTax": totalNoTax,
                "tax": taxtotal,
                "taxDetails": taxdetail,
            };
        },
    });
};


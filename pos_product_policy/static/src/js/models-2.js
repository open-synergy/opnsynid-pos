openerp.pos_product_policy = function (instance) {
    var module = instance.point_of_sale;
    var PosModelParent = module.PosModel;

    module.PosModel = module.PosModel.extend({
        fetch: function (model, fields, domain, ctx) {
            PosModelParent.prototype.fetch.apply(this, arguments);
            if (this.model == 'pos.config'){
                this.fields.push('all_allowed_product_ids')
            }else if (model == 'product.product'){
                this.domain.push(['available_in_pos','=',false])
            }
        },
    });
};

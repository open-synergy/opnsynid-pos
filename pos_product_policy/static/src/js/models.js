function pos_product_policy_models(instance, module){
    var models = module.PosModel.prototype;

    var model_pos_config = {
        model:  'pos.config',
        fields: [],
        domain: function(self){ return [['id','=', self.pos_session.config_id[0]]]; },
        loaded: function(self,configs, tmp){
            self.config = configs[0];
            self.config.use_proxy = self.config.iface_payment_terminal || 
                                    self.config.iface_electronic_scale ||
                                    self.config.iface_print_via_proxy  ||
                                    self.config.iface_scan_via_proxy   ||
                                    self.config.iface_cashdrawer;
            
            self.barcode_reader.add_barcode_patterns({
                'product':  self.config.barcode_product,
                'cashier':  self.config.barcode_cashier,
                'client':   self.config.barcode_customer,
                'weight':   self.config.barcode_weight,
                'discount': self.config.barcode_discount,
                'price':    self.config.barcode_price,
            });

            tmp.products = []
            allowed_product_length = self.config.all_allowed_product_ids.length
            if (self.config.limit_product_selection){
                if (allowed_product_length > 0){
                    for(var j = 0, allowed_product_length; j < allowed_product_length; j++){
                        tmp.products.push(self.config.all_allowed_product_ids[j]);
                    }
                }
            }

            if (self.config.company_id[0] !== self.user.company_id[0]) {
                throw new Error(_t("Error: The Point of Sale User must belong to the same company as the Point of Sale. You are probably trying to load the point of sale as an administrator in a multi-company setup, with the administrator account set to the wrong company."));
            }
        },
    }

    var model_product = {
        model:  'product.product',
        fields: ['display_name', 'list_price','price','pos_categ_id', 'taxes_id', 'ean13', 'default_code', 
                     'to_weight', 'uom_id', 'uos_id', 'uos_coeff', 'mes_type', 'description_sale', 'description',
                     'product_tmpl_id'],
        domain: function(self,tmp){
            tmp_products_length = tmp.products.length
            if (tmp_products_length > 0){
                this.domain_allowed = [
                    ['sale_ok','=',true],
                    ['available_in_pos','=',true],
                    ['id', 'in', tmp.products]
                ]
            }else{
                this.domain_allowed = [
                    ['sale_ok','=',true],
                    ['available_in_pos','=',true]
                ]
            }

            return this.domain_allowed
        },
        context: function(self){ return { pricelist: self.pricelist.id, display_default_code: false }; },
        loaded: function(self, products){
            self.db.add_products(products);
        },
    }

    for(var i=0; i< models.models.length; i++){
        var model=models.models[i];
        if(model.model === 'pos.config'){
           models.models[i] = model_pos_config;
        }else if(model.model === 'product.product'){
            models.models[i] = model_product;
        }
     }

}

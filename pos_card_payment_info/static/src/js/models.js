function pos_card_payment_info_models(instance, module){

    module.PosModel.prototype.models.push({
        model: "pos.payment_bank",
        fields: [],
        domain: null,
        loaded: function(self, payment_banks){
            self.payment_banks = payment_banks;
        },
    });

    var _super = module.Paymentline;
    module.Paymentline = module.Paymentline.extend({
        set_payment_ref: function(payment_ref){
            this.set('payment_ref',payment_ref);
        },
        get_payment_ref: function(){
            return this.get('payment_ref');
        },
        set_payment_bank: function(payment_bank){
            this.set('payment_bank',payment_bank);
        },
        get_payment_bank: function(){
            return this.get('payment_bank');
        },
        export_as_JSON: function() {
            var json = _super.prototype.export_as_JSON.apply(this,arguments);
            json.payment_ref = this.get_payment_ref();
            json.payment_bank = this.get_payment_bank();
            return json;
        },
    });
};


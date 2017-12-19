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
        set_payment_name: function(payment_name){
            this.set('payment_name',payment_name);
        },
        get_payment_name: function(){
            return this.get('payment_name');
        },
        export_as_JSON: function() {
            var json = _super.prototype.export_as_JSON.apply(this,arguments);
            json.payment_ref = this.get_payment_ref();
            json.payment_bank = this.get_payment_bank();
            return json;
        },
        export_for_printing: function(attributes){
            var line = _super.prototype.export_for_printing.apply(this, arguments);
            line['payment_bank'] = this.get_payment_bank();
            line['payment_name'] = this.get_payment_name();
            return line;
        },
    });
};


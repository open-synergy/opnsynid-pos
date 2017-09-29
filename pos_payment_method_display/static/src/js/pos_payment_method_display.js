'use strict';

openerp.pos_payment_method_display = function (instance) {
    var module = instance.point_of_sale;

    var PaymentlineParent = module.Paymentline;
    module.Paymentline = module.Paymentline.extend({
        initialize: function (attributes, options) {
            PaymentlineParent.prototype.initialize.apply(this, arguments);
            this.cashregister = options.cashregister;
            this.display_name = this.cashregister.journal.pos_journal_display_name;
            if(this.display_name){
                this.name = this.display_name
            }
        },
        export_for_printing: function () {
            PaymentlineParent.prototype.export_for_printing.apply(this, arguments);
            this.display_name = this.cashregister.journal.pos_journal_display_name;
            if(this.display_name){
                this.journal_name = this.display_name
            }else{
                this.journal_name = this.cashregister.journal_id[1]
            }
            return {
                amount: this.get_amount(),
                journal: this.journal_name,
            };
        },
    });
};

function pos_card_payment_info_widget(instance, module){
    var QWeb = instance.web.qweb; 
    _t = instance.web._t;

    module.PosWidget.include({
        build_widgets: function() {
                
            var self = this;
            this._super();

            this.payment_card_info_popup = new module.PaymentCardInfoPopUp(this,{});
            this.payment_card_info_popup.appendTo(this.$el);
            this.payment_card_info_popup.hide();
            this.screen_selector.popup_set['payment-card-info'] = this.payment_card_info_popup;
        }
    });

    module.PaymentCardInfoPopUp = module.PopUpWidget.extend({
        template : 'PaymentCardInfoPopUp',
        back_screen: 'payment',

        init: function(options){
            this.banks = []
            this._super(options);
        },

        show : function(options) {
            var self = this;
            var payment_banks = self.pos.payment_banks;
            var order = self.pos.get("selectedOrder");
            var paymentLine = order.selected_paymentline;
            var list_allowed_payment_bank = paymentLine.cashregister.journal.payment_bank_ids;
            var list_payment_banks = []
            this.msg_show = options.msg_show || "";
            
            for (var i = 0; i < payment_banks.length; i++) {
                if ((list_allowed_payment_bank.indexOf(payment_banks[i].id) > -1) == true){
                    list_payment_banks.push(payment_banks[i])
                }
            }
            
            this.banks = list_payment_banks;
            this._super();
            this.renderElement();
            this.$('.button.ok').click(function() {
                var payment_ref = $('.paymentcard-input-ref').val();
                var $select = $("select[name='pos_payment_bank_id']");
                var payment_bank = parseInt($select.val())
                var nb = $select
                    .find("option[value="+(payment_bank || 0)+"]")
                    .show().text();
                paymentLine.set_payment_ref(payment_ref)
                paymentLine.set_payment_bank(payment_bank)
                paymentLine.set_payment_name(nb)
                self.pos_widget.screen_selector.set_current_screen(self.back_screen);
            });

            this.$('.button.cancel').click(function() {
                self.pos_widget.screen_selector.close_popup();
            });
        },
    });
};

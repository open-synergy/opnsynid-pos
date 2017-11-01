function pos_card_payment_info_screen(instance, module){
    var QWeb = instance.web.qweb;
    _t = instance.web._t;

    module.PaymentScreenWidget.include({
        render_paymentline: function(line){
            el_node = this._super(line);
            var self = this;
            if(line.cashregister.journal.type == 'bank'){
                el_node.querySelector('.payment-card-info').addEventListener('click', function(){
                    self.show_payment_card_info(line);
                    self.rerender_paymentline(line);
                });
            }
            return el_node;
        },

        show_payment_card_info: function(line){
            var self = this;
            var msg_show = "";
            msg_show += "<script>$('.paymentcard-input-ref').focus();" +
                    " </script>" +
                    "<p id='title' style='color: black;'>Electronic Payment Information</p><hr></hr>";
            self.pos_widget.screen_selector.show_popup("payment-card-info",{msg_show : msg_show});
        },

    });
};

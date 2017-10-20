// Proses mendaftarkan instance di POS
openerp.pos_card_payment_info = function(instance) {
    var module = instance.point_of_sale;
    pos_card_payment_info_widget(instance, module);
    pos_card_payment_info_models(instance, module);
    pos_card_payment_info_screen(instance, module);
};

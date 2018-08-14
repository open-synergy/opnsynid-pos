// Proses mendaftarkan instance di POS
openerp.pos_disable_product_grouping = function(instance) {
    var module = instance.point_of_sale;
    pos_disable_product_grouping_models(instance, module);
    pos_disable_product_grouping_widget(instance, module);
};

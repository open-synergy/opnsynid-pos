// Proses mendaftarkan instance di POS
openerp.pos_restaurant_table_management = function(instance) {
    var module = instance.point_of_sale;
    pos_restaurant_table_management_db(instance, module);
    pos_restaurant_table_management_models(instance, module);
    pos_restaurant_table_management_widget(instance, module);
};

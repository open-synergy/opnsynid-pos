function pos_disable_product_grouping_widget(instance, module){
    var QWeb = instance.web.qweb;
    _t = instance.web._t;

    module.OrderWidget.include({
        set_value: function(val){
            var order = this.pos.get("selectedOrder");
            var mode = this.numpad_state.get('mode');
            if (mode == 'quantity' && !order.getSelectedLine().get_product().pos_grouping_ok){
                alert(_t("You cannot change qty of this product"));
            }
            else{
                this._super(val);
            }
        }
    });


};

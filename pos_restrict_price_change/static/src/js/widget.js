function pos_restrict_price_change_widgets(instance, module){

    module.OrderWidget.include({
        check_allowed_user_change_price: function() {
            var restrict_price_change = this.pos.config.restrict_price_change;
            var current_user = this.pos.user.id;
            var result = false;
            if (restrict_price_change){
                var all_user_change_price_ids = this.pos.config.all_user_change_price_ids
                if(all_user_change_price_ids){
                    if (all_user_change_price_ids.includes(current_user.id)){
                        result = true;
                    }
                }
            }
            else{
                result = true;    
            }
            return result;
        },
        set_value: function(val){
            var self = this;
            var order = this.pos.get("selectedOrder");
            var mode = this.numpad_state.get('mode');
            if (mode == 'price'){
                var result = self.check_allowed_user_change_price();
                if (result == false){
                    alert("You are not authorized to change the price");
                }
                else{
                    this._super(val);
                }
            }
            else{
                this._super(val);
            }
        }
    });
};

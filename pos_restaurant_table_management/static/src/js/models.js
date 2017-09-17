function pos_restaurant_table_management_models(instance, module){
    //var module   = instance.point_of_sale;
    var QWeb = instance.web.qweb;
    _t = instance.web._t;


    var PosModelSuper = instance.point_of_sale.PosModel;
    
    module.PosModel = module.PosModel.extend({
    load_server_data: function(){
        var self = this;
        var loaded = PosModelSuper.prototype.load_server_data.call(this);       
        loaded = loaded.then(function(){
                    if(self.config.floor_ids)
                    {
                        return self.fetch(
                                'pos.table',
                                ['name'],
                                [['id', 'in',self.config.floor_ids]])
                        .then(function(floors){                           
                            self.set({'floors' : floors});
                        });
                    }
                    else{
                        self.set({'floors' :[]});
                    }
                });
        return loaded;
        },
    });

    };


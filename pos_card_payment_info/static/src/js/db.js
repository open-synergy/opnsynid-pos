function pos_card_payment_info_db(instance, module){
    var QWeb = instance.web.qweb;
    _t = instance.web._t;

    module.PosDB = module.PosDB.extend({
        init: function(options){
            this.bank_by_payment = {}
            this._super(options);
        },

        add_payment_bank: function(tables){
            var payment_banks = this.bank_by_payment;

            if(!tables instanceof Array){
                tables = [tables];
            }

            for(var i=0, len=tables.length; i<len; i++){
                var table = tables[i];
                var floor_id = table.floor_id[0];
                if(!stored_tables[floor_id]){
                    stored_tables[floor_id] = [];
                }
                stored_tables[floor_id].push(table.id);
                this.table_by_id[table.id] = table;
            }
        },
        // DB-1.2
        // Fungsi Mencari table berdasarkan ID
        get_table_by_id: function(id){
            return this.table_by_id[id];
        },

        // DB-1.3
        // Fungsi Mencari table berdasarkan Floor
        get_table_by_floor: function(floor_id){
            var table_ids = this.table_by_floor_id[floor_id];
            var list = [];
            if (table_ids){
                for (var i = 0, len=table_ids.length; i<len; i++){
                    list.push(this.table_by_id[table_ids[i]]);
                }
            }
            return list;
        },

    });


};


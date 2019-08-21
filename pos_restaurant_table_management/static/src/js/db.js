function pos_restaurant_table_management_db(instance, module){
    var QWeb = instance.web.qweb;
    _t = instance.web._t;

    // DB-1
    // Module yang mengatur Database di POS
    module.PosDB = module.PosDB.extend({
        // Initiasi Awal
        init: function(options){
            this.table_by_floor_id = {} // Mendefinisikan variabel
            this.table_by_id = {} // Mendefinisikan variabel
            this.guest_by_table = {} // Mendefinisikan variabel
            this._super(options);
        },
        // DB-1.1
        // Fungsi Add Table
        add_tables: function(tables){
            var stored_tables = this.table_by_floor_id;

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
        get_table_by_floor: function(floor_id, uid){
            var table_ids = this.table_by_floor_id[floor_id];
            var list = [];
            if (table_ids){
                for (var i = 0, len=table_ids.length; i<len; i++){
                    var table_by_id = this.table_by_id[table_ids[i]]
                    var total_guest = this.get_total_seat_table_another_order(table_ids[i], uid)
                    var table_name = table_by_id["table_name"]
                    var capacity = table_by_id["capacity"]
                    var remaining = capacity - total_guest
                    table_by_id["full_table_name"] = table_name + " (" + remaining + ") seat(s) available"
                    list.push(table_by_id);

                    // if (total_guest < table_by_id["capacity"]){
                    //     list.push(table_by_id);
                    // }
                }
            }
            return list;
        },

        update_seat_table: function(uid, table_id, guest){
            var list_order = []
            var dict_order = {};
            guest_by_table = this.guest_by_table;
            if (table_id in guest_by_table){
                var table = this.guest_by_table[table_id];
                for (var i = 0, len=table.length; i<len; i++){
                    if(uid in table[i]){
                        table[i][uid]["guest"] = parseInt(guest)
                    }else{
                        table[i][uid] = {
                            "guest" : parseInt(guest)
                        }
                    }
                }
            }else{
                dict_order[uid] = {
                    "guest" : parseInt(guest)
                }
                list_order.push(dict_order);
                guest_by_table[table_id] = list_order;
            }
        },

        get_total_seat_table: function(table_id){
            var total_guest = 0
            guest_by_table = this.guest_by_table;
            if (table_id in guest_by_table){
                var table = guest_by_table[table_id];
                for (var i = 0, len=table.length; i<len; i++){
                    for (k in table[i]){
                        guest = table[i][k]["guest"]
                        total_guest = total_guest + guest
                    }
                }
            }
            return total_guest;
        },

        get_total_seat_table_another_order: function(table_id, uid){
            var total_guest = 0
            guest_by_table = this.guest_by_table;
            if (table_id in guest_by_table){
                var table = guest_by_table[table_id];
                for (var i = 0, len=table.length; i<len; i++){
                    for (k in table[i]){
                        if(k != uid){
                          guest = table[i][k]["guest"]
                          total_guest = total_guest + guest
                        }
                    }
                }
            }
            return total_guest;
        },

        remove_seat_table: function(table_id, uid){
            guest_by_table = this.guest_by_table;
            if (table_id in guest_by_table){
                var table = guest_by_table[table_id];
                for (var i = 0, len=table.length; i<len; i++){
                    delete table[i][uid];
                }
            }
        },

    });


};

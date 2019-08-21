function pos_restaurant_table_management_models(instance, module){
    var QWeb = instance.web.qweb;
    _t = instance.web._t;

    // M-1
    // Menambahkan object baru pos.floor ke model POS
    module.PosModel.prototype.models.push({
        model: "pos.floor", // Nama model baru yang dibuat
        fields: ["name", "floor_name"], // Fields yang akan dipanggil
        domain: function(self){ return [["id", "in", self.config.floor_ids]]}, // Domain
        loaded: function(self, floors){ // Fungsi ketika di model ini diload oleh JS
            // Jika FloorPlan == True
            if(self.config.iface_floorplan){
                self.floors = floors; // Mendefinisikan variabel floors
                // Menampung data floors yang diload pada floor_list
                self.set({
                    'floor_list' : floors
                })
            }// Jika FloorPlan == False
            else{
                self.set({'floor_list' :[]});
            }
        },
    });

    // M-2
    // Menambahkan object baru pos.table ke model POS
    module.PosModel.prototype.models.push({
        model: "pos.table",
        fields: ["name", "table_name", "capacity", "state", "floor_id"],
        domain: function(self){ return [["floor_id", "in", self.config.floor_ids]]},
        loaded: function(self, tables){
            // Jika FloorPlan == True
            if(self.config.iface_floorplan){
                self.tables = tables;
                self.db.add_tables(tables);
            }
        },
    });

    // M-3
    // Menambahkan fungsi set_table pada module Order
    var _super = module.Order;
    module.Order = module.Order.extend({
        // M-3.1
        // Membuat Fungsi untuk menampung data ID Table
        set_table: function(table){
            this.set('table',table);
        },
        // M-3.2
        // Membuat Fungsi untuk mengambil data ID Table
        get_table: function(){
            return this.get('table');
        },
        // M-3.3
        // Membuat Fungsi untuk mengambil nama Table
        // Fungsi ini dipakai pada /src/xml/pos_table_management.xml
        // Lihat T-7
        get_table_name: function(){
            var table = this.get('table');
            return table ? table.table_name : "";
        },
        // M-3.4
        // Membuat Fungsi untuk menampung data Guest
        set_guest: function(guest){
            this.set('guest',guest);
        },
        // Membuat Fungsi untuk mengambil data Guest
        get_guest: function(){
            return this.get('guest');
        },
        // M-3.5
        // Inherit Fungsi export_as_JSON
        // Fungsi ini digunakan untuk mengeksport data yang akan dimasukan ke object pos.order
        export_as_JSON: function(){
            var json = _super.prototype.export_as_JSON.apply(this,arguments);
            // Menambahkan variabel tabel
            json.table = this.get_table();
            json.guest = this.get_guest();
            return json;
        },
    })
};

function pos_restaurant_table_management_widget(instance, module){
    var QWeb = instance.web.qweb;
    _t = instance.web._t;

    // S-1
    // Module yang mengatur Widget di POS
    module.PosWidget.include({
        // S-1.1
        // Nama Fungsi untuk mendaftakan widget baru yang dibuat
        build_widgets: function() {

            var self = this;
            this._super();

            //S.1-2
            // Proses mendaftarkan widget yang baru untuk Floor
            this.floor_popup = new module.FloorPopUp(this,{}); // Mendefinisikan module widget baru ke dalam variabel (this.floor_popup). Lihat S-3
            this.floor_popup.appendTo(this.$el); // Memasukan widget baru ke dalam screen
            this.floor_popup.hide(); // Widget baru kemudian dibuat invisible
            this.screen_selector.popup_set['floors'] = this.floor_popup;  // Mendefinisikan pop up untuk nanti dipanggil ke dalam variabel (floors)

            //S.1-3
            // Proses mendaftarkan widget yang baru untuk Table
            this.table_popup = new module.TablePopUp(this,{}); // Mendefinisikan module widget baru ke dalam variabel (this.table_popup). Lihat S-6
            this.table_popup.appendTo(this.$el);// Memasukan widget baru ke dalam screen
            this.table_popup.hide(); // Widget baru kemudian dibuat invisible
            this.screen_selector.popup_set['tables'] = this.table_popup; // Mendefinisikan pop up untuk nanti dipanggil ke dalam variabel (tables)
        }
    });

    // S-2
    // Module yang mengatur Client Screen di POS
    module.ClientListScreenWidget.include({
        // S-2.1 Proses menambahkan tombol baru pada Client Screen
        // Tombol baru sudah ditambahkan pada xml Client Screen /src/xml/pos_table_management.xml
        // Lihat T-1
        show: function(){
            var self = this;
            this._super();
            var floor_list = self.pos.get('floor_list');

            if(floor_list){
                // Membuat fungsi pada saat tombol "Select Table" di-klik
                this.$('.select-table').click(function(){
                    // Menampilkan widget Pop Up yang sudah didefinisikan di awal pada S.1-2
                    self.pos_widget.screen_selector.show_popup('floors');
                    // Membuat fungsi pada saat tombol "Cancel" di-klik
                    // Tombol ini berada pada template Pop Up Floor yang sudah dimunculkan
                    $('#floor-cancel').click(function(){
                        // Menampilkan widget Pop Up Client Screen
                        // Pop up ini sudah didaftarkan pada module default point_of_sale
                        self.pos_widget.screen_selector.set_current_screen('clientlist');
                    });
                });
            }
            else{
                this.$el.removeClass('.select-table');
            }
        }
    });

    module.PaymentScreenWidget.include({
        validate_order: function(options) {
            var currentOrder = this.pos.get('selectedOrder');
            var table_id = currentOrder.get('table')
            var uid = currentOrder["uid"]
            if(table_id){
                this.pos.db.remove_seat_table(table_id["id"], uid);
            }
            this._super(options);
        },
    });

    // S-3
    // Module yang mengatur widget PopUp
    // Module ini didaftarkan pada S.1-2
    module.FloorPopUp = module.PopUpWidget.extend({
        // Mendefinisikan template Pop Up yang dibuat
        // Template dibuat pada xml Client Screen /src/xml/pos_table_management.xml
        // Lihat T-2
        template:'FloorPopupWidget',

        // Fungsi Start ini akan dijalankan pertama kali setelah initiasi awal ketika module ini dipanggil
        start: function(){
            this._super();
            var self = this;
            // S-3.1
            // Mendefinisikan Screen Widget Untuk Floor yang dibuat pada S-4
            this.floor_list_widget = new module.FloorListScreenWidget(this,{});
        },

        // Fungsi Show ini akan dijalankan ketika Pop Up muncul ke screen
        show: function(){
            this._super();
            var self = this;
            // Proses mengganti DOM pada template dengan Screen Widget yang sudah didefiniskan pada S.3.-1
            // Struktur DOM bisa dilihat pada /src/xml/pos_table_management.xml
            // Lihat T-2
            this.floor_list_widget.replace($('.placeholder-FloorListScreenWidget'));
        },
    });

    // S-4
    // Module yang mengatur widget Screen
    module.FloorListScreenWidget = module.ScreenWidget.extend({
        // Mendefinisikan template Screen yang dibuat
        // Template dibuat pada xml Client Screen /src/xml/pos_table_management.xml
        // Lihat T-3
        template:'FloorListScreenWidget',

        // Fungsi yang mengatur initiasi awal
        init: function(parent, options) {
            this._super(parent,options);
        },

        // Fungsi Start ini akan dijalankan pertama kali setelah initiasi awal ketika module ini dipanggil
        start: function() {
            this._super();
            var self = this;
        },

        // Fungsi RenderElement mengatur element DOM pada template
        renderElement: function() {
            this._super();
            var self = this;

            // Mendefiniskan List Floor yang ada ke dalam Variabel
            // floor_list sudah didaftarkan pada /src/js/models.js
            // Lihat M-1
            var floors = this.pos.get('floor_list') || [];
            // Proses Memasukan data pada template
            // Melakukan looping terhadap data floor yang ada
            for(var i = 0; i < floors.length;  i++ ){
                // Mendefinisikan Widget Floor List
                // Melakukan parsing parameter model_floor
                // Nantinya variable ini akan dipakai sebagai element untuk menampilkan data di Template
                var floor = new module.FloorListWidget(this, {
                    model_floor: floors[i],
                });
                // Template yang sudah didefiniskan di atas di append ke DOM '.floor_list'
                // '.floor_list' ada pada T-3
                floor.appendTo(this.$('.floor_list'));
            }
        },
    }),

    // S-5
    // Module yang mengatur Widget di POS
    // Proses membuat widget baru untuk menampilkan list floor
    module.FloorListWidget = module.PosBaseWidget.extend({
        // Mendefinisikan Template
        // Template dibuat pada xml Client Screen /src/xml/pos_table_management.xml
        // Lihat T-4
        template: 'FloorListWidget',

        // Fungsi yang mengatur initiasi awal
        init: function(parent, options){
            this._super(parent, options);
            this.model_floor = options.model_floor;
        },

        // Fungsi RenderElement mengatur element DOM pada template
        renderElement: function(){
            var self = this;
            this._super();
            var currentOrder = self.pos.get('selectedOrder');
            var uid = currentOrder["uid"]
            // Membuat fungsi untuk setiap tombol floor apabila di-klik
            $("button", this.$el).click(function(e){
                // S-5.1
                // Memasukan data tabel berdasarkan floor
                // Data dimasukan ke dalam Fungsi "set_table_list"
                // Fungsi tersebut ada pada Module TablePopUp yang sudah didefinisikan di awal pada S.1-3
                // Lihat S-6.1
                // Fungsi get_table_by_floor ada pada /src/js/db.js
                // Lihat DB-1.3
                self.pos_widget.table_popup.set_table_list(self.pos.db.get_table_by_floor(self.model_floor.id, uid));
                // Menampilkan widget Pop Up yang sudah didefinisikan di awal pada S.1-3
                self.pos_widget.screen_selector.show_popup("tables");
            });
        }
    });

    // S-6
    // Module yang mengatur widget PopUp
    // Module ini didaftarkan pada S.1-3
    module.TablePopUp = module.PopUpWidget.extend({
        // Mendefinisikan template Pop Up yang dibuat
        // Template dibuat pada xml Client Screen /src/xml/pos_table_management.xml
        // Lihat T-5
        template: "TablePopupWidget",

        // Fungsi initiasi awal
        init: function(parent, options){
            var self = this;
            this._super(parent, options);
            this.table_list = options.table_list || []; // Membuat variabel baru
        },

        // S-6.1
        // Fungsi untuk menampung data table dari S-5.1
        set_table_list: function(table_list){
            this.table_list = table_list;
            this.renderElement();
        },
        // S-6.2
        // Fungsi RenderElement mengatur element DOM pada template
        renderElement: function() {
            var self = this;
            this._super();
            // Mendefiniskan List Table yang ada ke dalam Variabel
            // this.table_list sudah diset pada S-6.1
            var tables = this.table_list || [];
            // Proses Memasukan data pada template
            // Mendefinisikan Widget Table List
            // Melakukan parsing parameter model_table
            // Nantinya variable ini akan dipakai sebagai element untuk menampilkan data di Template
            var table = new module.TableListWidget(this, {
                model_table: tables,
            });
            // Template yang sudah didefiniskan di atas di append ke DOM '.table_data'
            // '.table_data' ada pada T-5
            table.appendTo(this.$('.table-data'));
        },
    });

    // S-7
    // Module yang mengatur Widget di POS
    // Proses membuat widget baru untuk menampilkan list table
    module.TableListWidget = module.PosBaseWidget.extend({
        // Mendefinisikan Template
        // Template dibuat pada xml Client Screen /src/xml/pos_table_management.xml
        // Lihat T-6
        template: 'TableListWidget',

        // Fungsi yang mengatur initiasi awal
        init: function(parent, options){
            this._super(parent, options);
            this.model_table = options.model_table;
        },

        // Fungsi RenderElement mengatur element DOM pada template
        renderElement: function(){
            this._super();
            var self = this;
            var currentOrder = self.pos.get('selectedOrder');
            var uid = currentOrder["uid"]
            // Membuat fungsi pada saat data tabel di-klik
            $("#table-ok", this.$el).click(function(e){
                // S-7.1
                // Memasukan data tabel
                // Data dimasukan ke dalam Fungsi "set_table"
                // Fungsi tersebut ada pada Module Order pada /src/js/model.js
                // Lihat M-3.1
                var guest = $('.table-guest').val();
                var table_id = parseInt($('select[name=select_table]').val())
                var total_guest = self.pos.db.get_total_seat_table_another_order(table_id, uid);
                var check = true

                if (parseInt(guest) > 0){
                    currentOrder.set_guest(guest);
                }else{
                    currentOrder.set_guest("0");
                }

                for (var i=0, len = self.model_table.length; i < len; i++){
                    if (self.model_table[i].id == table_id){
                        var capacity = self.model_table[i].capacity
                        var remaining = 0
                        if (total_guest == 0){
                            remaining = capacity
                        }else{
                            remaining = capacity - total_guest
                        }
                        if (remaining < guest){
                          alert("Number of guest exceeds maximum capacity")
                          check = false
                          break;
                        }
                        currentOrder.set_table(self.model_table[i]);
                        break;
                    }
                }

                if (table_id && check == true){
                    var guest_order = currentOrder.get('guest')
                    self.pos.db.update_seat_table(uid, table_id, guest_order);
                    // Fungsi ini untuk mengembalikan screen ke awal
                    self.pos_widget.screen_selector.set_current_screen('clientlist');
                }
            });
            $("#table-back", this.$el).click(function(e){
                // Menampilkan widget Pop Up Floors
                // Pop up ini sudah didaftarkan pada S-1.2
                self.pos_widget.screen_selector.show_popup("floors");
            });
        },

        // Fungsi untuk menambahkan table pada Order
        save_changes: function(){
            var table = self.pos.db.get_table_by_id(self.model_table.id);
            this.pos.get('selectedOrder').set_table(this.new_client);
        },
    });

};

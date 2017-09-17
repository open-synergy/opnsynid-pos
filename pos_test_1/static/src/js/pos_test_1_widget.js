function pos_test_1_widget(instance, module){
    module = instance.point_of_sale;
    var QWeb = instance.web.qweb;
    _t = instance.web._t;
    var OrderSuper = module.ProductListWidget;




     module.PosWidget = module.PosWidget.extend({
            build_widgets: function() {
                
                var self = this;
                this._super();

                // Mendaftarkan Widget Pada Additional Pane 1
                var test_widget = new module.TestButtonWidget(self);
                test_widget.appendTo(self.$el.find('.pos-additional-pane-1 .window .subwindow-container .subwindow-container-fix'))
                
                // Mendaftarkan Widget Pada Additional Pane 2
                var test_widget_2 = new module.TestWidget2(self);
                test_widget_2.appendTo(self.$el.find('.pos-additional-pane-2 .window .subwindow-container .subwindow-container-fix'))                

                // Mendaftarkan PopUp
                this.test_popup = new module.TestPopupWidget(this,{});
                this.test_popup.appendTo(this.$el);
                this.test_popup.hide();
                this.screen_selector.popup_set['select-test'] = this.test_popup;   

                
            },
            
            test_click: function(){
                console.log("Weks");
                }
    });
    
    module.TestPopupWidget = module.PopUpWidget.extend({
            template:'TestPopupWidget',
            
            start: function(){
                this._super();
                var self = this;
            },
        show: function(){
            this._super();
            var self = this; 
        },      
        events: {
            'click #customer-cancel': function(){
                        console.log('meh');
                        this.pos_widget.screen_selector.set_current_screen('products');
                }                
        },              
        });    

     module.TestButtonWidget =module.PosBaseWidget.extend({
        template: 'TestButtonWidget',    

        init: function(parent, options){
            this._super(parent, options);
            
        },
        renderElement: function() {
            var self = this;
            this._super();    
        },
        events: {
            'click button#test-warning': function(){
                    this.pos_widget.screen_selector.show_popup('error',{
                            'message': _t("Warning !!!!"),
                            'comment': _t("Test Warning" ),
                        });
                },                 
            'click button#test-popup': function(){
                        this.pos_widget.screen_selector.show_popup('select-test');
                },                                            
        },
    });    
    
     module.TestWidget2 =module.PosBaseWidget.extend({
        template: 'TestAdditionalPane2',    

        init: function(parent, options){
            this._super(parent, options);
            
        },
        renderElement: function() {
            var self = this;
            this._super();    
        },
        events: {
            'click button#test-client': function(){
                  this.pos_widget.screen_selector.set_current_screen('clientlist');            
                },                                                       
        },
    });       
    };


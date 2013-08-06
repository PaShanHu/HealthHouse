var ModuleView=Backbone.View.extend({
	tagName:'li',
	className:'item',
	template:_.template($('#item-template').html()),
	events:{

	},
	initialize:function(){
		// 每次更新模型后重新渲染  
		this.model.bind('change',this.render,this);
		// 每次删除模型之后自动移除UI  
		this.model.bind('destroy',this.remove,this);
	},
	render:function(){
		var jsonObj=this.model.toJSON();
		this.$el.html(this.template(jsonObj));  
        return this;  
	},
	remove: function() {  
        $(this.el).remove();  
    },  
    clear: function() {  
    	this.model.destroy();  
    }  
});

var InfoView=Backbone.View.extend({
	className:'info-wrapper',
	template:_.template($('#info-template').html()),
	initialize:function(){
		// 每次更新模型后重新渲染  
		this.model.bind('change',this.render,this);
		// 每次删除模型之后自动移除UI  
		this.model.bind('destroy',this.remove,this);
	},
	render:function(){
		var jsonObj=this.model.toJSON();
		this.$el.html(this.template(jsonObj));  
        return this;  
	}
})
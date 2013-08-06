//------------------model define------------------
var Employee=Backbone.Model.extend({
	// 模型值校验  
	validate:function (attrs) {
		for (var key in attrs) {
			if(attrs[key]==''){
				return key+'不能为空';
			}
			else if(key==='age'&&isNaN(attrs.age)){
				return '年龄必须是数字';
			}
		};
	},
	defaults:{
		name:'',
		gender:'',
		age:0
	}
});


//----------------collection define------------------
var EmployeeList=Backbone.Collection.extend({
	model:Employee,
	// 持久化到本地数据库  
    localStorage: new Store("employees")
    //设置 localStorage属性后Employees里面的数据
    //自动会同步保存到本地数据库里面，
    //每当调用Employees.fetch()后又会从localStorage里面恢复数据。
    //Employees = new EmployeeList();  
});


//----------------view define------------------
var EmployeeView=Backbone.View.extend({
	tagName:'li',
	template:_.template($('#item-template').html()),
	events:{
		'click #removeUser':'clear'
	},
	initialize:function() {
		// 每次更新模型后重新渲染  
		this.model.bind('change',this.render,this);
		// 每次删除模型之后自动移除UI  
		this.model.bind('destroy',this.remove,this);
	},
	close:function(e){
		var input=$(e.currentTarget);
		var obj={};
		obj[input.attr('name')]=input.val();
		this.model.save(obj);
		$(e.currentTarget).parent().parent().removeClass("editing");  
	},
	edit : function(e){  
        // 给td加上editing样式  
        $(e.currentTarget).addClass('editing').find('input,select').focus();  
    },  
    render: function() {  
        $(this.el).html(this.template(this.model.toJSON()));  
        return this;  
    },  
    remove: function() {  
        $(this.el).remove();  
    },  
    clear: function() {  
      this.model.destroy();  
    }  
})


//----------------view define------------------
var AppView = Backbone.View.extend({
	el : '#header',
	events : {
		'click #add-item':'createByBtn'
	},
	// 绑定collection的相关事件
	initialize: function() {
        Employees.bind('add', this.addOne, this);
        // 调用fetch的时候触发reset
        Employees.bind('reset', this.addAll, this);
        Employees.fetch();
        this.$add=this.$('#add-item');
        this.$name=this.$('#name');
        this.$gender=this.$('#gender');
        this.$age=this.$('#age');
        console.log('ini');
    },
    createOnEnter : function(event) {
    	if ( event.which !== 13 || !this.$input.val().trim() ) {
        	return;
        }
    	var employee = new Employee({
    		name:this.$input.val(),
    		age:18
    	});
    	employee.bind('error',function(model,error){
    		alert(error);
    	});
		Employees.create(employee);
		this.$input.val('');
    },
    createByBtn : function(event){
    	console.log('btn');
    	var tmpname=this.$name.val();
    	var tmpgender=this.$gender.val();
    	var tmpage=parseInt(this.$age.val());
    	console.log(tmpgender+' '+this.$age.val());
    	var employee=new Employee({
    		name:tmpname,
    		age:tmpage,
    		gender:tmpgender
    	});
    	Employees.create(employee);
    	this.$name.val('');
    	this.$age.val('');
    },
    addOne : function(employee){
    	console.log('addone');
    	employee.set({"eid":employee.get("eid")||Employees.length});
    	employee.bind('error',function(model,error){
    		alert(error);
    	});
    	var view = new EmployeeView({model:employee});
    	$("#user-list").append(view.render().el);
    },
    addAll : function(){
    	Employees.each(this.addOne);
    }
});

var Employees=new EmployeeList();
var appview=new AppView();
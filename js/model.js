var Module=Backbone.Model.extend({
	defaults:{
		//id:0,
		name:'',
		imgSrc:'',
		items:[],//{'device':'了解各种医疗设备。每种设备叫什么，怎么使用，作用是什么等等。','process'}
		title:'',
		//keywords:'',
		details:''
	},
	validate:function(attrs){
		for (var key in attrs) {
			if(attrs[key]==null){
				return key+'不能为空';
			}
		};
	}
});

var Exam=Backbone.Model.extend({
	defaults:{
		type:'',
		descrption:'',
		device:[],
		items:[]
	}
})
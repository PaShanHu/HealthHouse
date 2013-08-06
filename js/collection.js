var ModuleList=Backbone.Collection.extend({
	model:Module,
	localStorage:new Store('Modules')
})

var ExamList=Backbone.Collection.extend({
	model:Exam,
	localStorage:new Store('Exams')
})